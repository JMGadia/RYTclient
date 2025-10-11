import { ref, computed } from 'vue';
import { supabase } from '../server/supabase'; // Ensure this path is correct for your project
import { getProductImageURL } from '../services/apiService'; // We'll need this for image URLs

// These refs are the central state for the cart
const cart = ref([]);
const loading = ref(false);

export function useCart() {
  // --- FETCH CART ---
  // Fetches all cart items for the logged-in user from the database
  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      cart.value = []; // If no user, the cart is empty
      return;
    }

    loading.value = true;
    try {
      // This query gets the quantity from 'on_cart' and all product details from 'products'
      const { data, error } = await supabase
        .from('on_cart')
        .select('quantity, products(*)') // This joins the tables
        .eq('user_id', user.id);

      if (error) throw error;
      
      // The data from Supabase needs to be formatted to match our UI's expectations
      cart.value = data.map(item => ({
        ...item.products, // Spread all product details (id, brand, price, etc.)
        image_url: getProductImageURL(item.products.image_url), // Build the full image URL
        quantity: item.quantity // Add the quantity from the on_cart table
      }));
    } catch (error) {
      console.error('Error fetching cart:', error.message);
    } finally {
      loading.value = false;
    }
  };

  // --- ADD TO CART ---
  const addToCart = async (product) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Please log in to add items to your cart.');

    const existingItem = cart.value.find(item => item.id === product.id);

    if (existingItem) {
      // If item is already in the cart, just increase its quantity
      await updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      // If it's a new item, insert it into the 'on_cart' table
      const { error } = await supabase
        .from('on_cart')
        .insert({ user_id: user.id, product_id: product.id, quantity: 1 });
      
      if (error) {
        console.error('Error adding to cart:', error.message);
      } else {
        // Also add it to our local 'cart' ref for instant UI update
        cart.value.push({ ...product, quantity: 1 });
      }
    }
  };

  // --- REMOVE FROM CART ---
  const removeFromCart = async (productId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('on_cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    
    if (error) {
      console.error('Error removing from cart:', error.message);
    } else {
      // Remove from the local array for instant UI update
      cart.value = cart.value.filter(item => item.id !== productId);
    }
  };

  // --- UPDATE QUANTITY ---
  const updateQuantity = async (productId, newQuantity) => {
    newQuantity = Math.max(1, parseInt(newQuantity) || 1); // Ensure quantity is a valid number >= 1
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('on_cart')
      .update({ quantity: newQuantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);
      
    if (error) {
      console.error('Error updating quantity:', error.message);
    } else {
      // Update the quantity in the local array for instant UI update
      const item = cart.value.find(item => item.id === productId);
      if (item) item.quantity = newQuantity;
    }
  };
  
  // --- CLEAR CART ---
  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('on_cart').delete().eq('user_id', user.id);
    if(error) console.error('Error clearing cart:', error.message);
    else cart.value = [];
  };

  // --- COMPUTED TOTAL ---
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  return {
    cart,
    loading,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
  };
}
