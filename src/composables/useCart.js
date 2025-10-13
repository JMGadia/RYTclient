import { ref, computed } from 'vue';
import { supabase } from '../server/supabase'; // Supabase client for database interaction
import { getProductImageURL } from '../services/apiService'; // Utility function to construct product image URLs

// --- CENTRAL CART STATE ---
// These refs store the application-wide state for the cart
const cart = ref([]);
const loading = ref(false);

/**
 * Custom Vue Composable to manage the shopping cart state and persistent storage
 * via Supabase. Provides methods for fetching, adding, removing, and updating items.
 * @returns {Object} - Reactive state and cart management functions.
 */
export function useCart() {
  // --- FETCH CART FROM DATABASE ---
  /**
   * Retrieves all cart items for the currently authenticated user from the 'on_cart' table.
   * Joins with the 'products' table to get item details.
   */
  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      cart.value = [];
      return;
    }

    loading.value = true;
    try {
      // Fetches cart items, joining the 'on_cart' table with 'products' (using the foreign key name)
      const { data, error } = await supabase
        .from('on_cart')
        .select('quantity, product_id:on_cart_product_id_fkey(*)') 
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Map the nested Supabase response structure to a flat cart array for the UI
      cart.value = data.map(item => ({
        ...item.product_id, // Spread product details (id, price, brand, etc.)
        image_url: getProductImageURL(item.product_id.image_url), // Construct full image URL
        quantity: item.quantity // Add the quantity from the pivot table
      }));
    } catch (error) {
      console.error('Error fetching cart (Check relationship name):', error.message);
    } finally {
      loading.value = false;
    }
  };

  // --- ADD TO CART ---
  /**
   * Adds a product to the cart. Increments quantity if the item already exists.
   * @param {Object} product - The product object to add.
   */
  const addToCart = async (product) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('Please log in to add items to your cart.');
      return;
    }

    const existingItem = cart.value.find(item => item.id === product.id);

    if (existingItem) {
      // Item exists: update quantity in both database and local state
      await updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // New item: insert into database
      const { error } = await supabase
        .from('on_cart')
        .insert({ user_id: user.id, product_id: product.id, quantity: 1 });
      
      if (error) {
        console.error('Error adding to cart:', error.message);
      } else {
        // Update local state
        cart.value.push({ ...product, quantity: 1 });
      }
    }
  };

  // --- REMOVE FROM CART ---
  /**
   * Removes a product entirely from the cart (database and local state).
   * @param {number} productId - The ID of the product to remove.
   */
  const removeFromCart = async (productId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Delete the entry from the database
    const { error } = await supabase
      .from('on_cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    
    if (error) {
      console.error('Error removing from cart:', error.message);
    } else {
      // Update local state
      cart.value = cart.value.filter(item => item.id !== productId);
    }
  };

  // --- UPDATE QUANTITY ---
  /**
   * Updates the quantity of an existing product in the cart.
   * @param {number} productId - The ID of the product.
   * @param {number} newQuantity - The new quantity value (must be >= 1).
   */
  const updateQuantity = async (productId, newQuantity) => {
    newQuantity = Math.max(1, parseInt(newQuantity) || 1); // Clamp quantity to a minimum of 1
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update the quantity in the database
    const { error } = await supabase
      .from('on_cart')
      .update({ quantity: newQuantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);
      
    if (error) {
      console.error('Error updating quantity:', error.message);
    } else {
      // Update the quantity in the local state
      const item = cart.value.find(item => item.id === productId);
      if (item) item.quantity = newQuantity;
    }
  };
  
  // --- CLEAR CART ---
  /**
   * Removes all items from the user's cart (database and local state).
   */
  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Delete all entries for the user from the database
    const { error } = await supabase.from('on_cart').delete().eq('user_id', user.id);
    if(error) console.error('Error clearing cart:', error.message);
    else cart.value = []; // Clear local state
  };

  // --- COMPUTED TOTAL ---
  /**
   * Reactive computed property that returns the sum of (price * quantity) for all cart items.
   */
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // --- RETURN INTERFACE ---
  return {
    cart, // Reactive array of cart items
    loading, // Loading state
    fetchCart, // Function to load cart from DB
    addToCart, // Function to add item
    removeFromCart, // Function to remove item
    updateQuantity, // Function to change item quantity
    clearCart, // Function to empty the cart
    cartTotal, // Reactive computed subtotal
  };
}
