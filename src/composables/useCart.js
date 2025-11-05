import { ref, computed } from 'vue';
import { supabase } from '../server/supabase'; // Supabase client for database interaction
import { getProductImageURL } from '../services/apiService'; // Utility function to construct product image URLs

// --- CENTRAL CART STATE ---
const cart = ref([]);
const loading = ref(false);

/**
 * Custom Vue Composable to manage the shopping cart state and persistent storage
 * via Supabase. Provides methods for fetching, adding, removing, and updating items.
 * @returns {Object} - Reactive state and cart management functions.
 */
export function useCart() {

    // --- FETCH CART FROM DATABASE (CRITICAL MAPPING FIX) ---
    /**
     * Retrieves all cart items for the user, mapping the two 'quantity' fields
     * into distinct properties: 'quantity' (cart) and 'stock_limit' (product).
     */
    const fetchCart = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            cart.value = [];
            return;
        }

        loading.value = true;
        try {
            // Fetches cart quantity (from 'on_cart') and all product details (from 'products')
            const { data, error } = await supabase
                .from('on_cart')
                .select('quantity, product_id:on_cart_product_id_fkey(*)')
                .eq('user_id', user.id);

            if (error) throw error;

            // Map the fetched data to a clear local state structure
            cart.value = data.map(item => {
                const productDetails = item.product_id;
                return {
                    ...productDetails,
                    // 1. The actual current quantity in the cart (from on_cart table)
                    quantity: item.quantity,
                    // 2. The maximum available stock (from products table's 'quantity' column)
                    stock_limit: productDetails.quantity,
                    image_url: getProductImageURL(productDetails.image_url),
                };
            });
        } catch (error) {
            console.error('Error fetching cart:', error.message);
        } finally {
            loading.value = false;
        }
    };

    // --- ADD TO CART (UPDATED with Stock Check) ---
    /**
     * Adds a product to the cart. Increments quantity if the item already exists,
     * preventing addition if stock limit is reached.
     */
    const addToCart = async (product) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.warn('Please log in to add items to your cart.');
            return;
        }

        const existingItem = cart.value.find(item => item.id === product.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        const stockLimit = existingItem ? existingItem.stock_limit : product.quantity; // Use product.quantity for stock limit of a new item

        if (newQuantity > stockLimit) {
             console.warn(`Cannot add: Product ${product.brand} stock limit (${stockLimit}) reached.`);
             return;
        }

        if (existingItem) {
            await updateQuantity(product.id, newQuantity);
        } else {
             // New item: insert into database
             const { error } = await supabase
                .from('on_cart')
                .insert({ user_id: user.id, product_id: product.id, quantity: 1 });

            if (error) {
                console.error('Error adding to cart:', error.message);
            } else {
                // Update local state, mapping the product's quantity column to stock_limit
                cart.value.push({ ...product, quantity: 1, stock_limit: product.quantity });
            }
        }
    };

    // --- REMOVE FROM CART (UNCHANGED) ---
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
            cart.value = cart.value.filter(item => item.id !== productId);
        }
    };

    // --- UPDATE QUANTITY (UPDATED with Stock Check) ---
    /**
     * Updates the cart quantity, using the local 'stock_limit' property as the ceiling.
     */
    const updateQuantity = async (productId, newQuantity) => {
        const item = cart.value.find(i => i.id === productId);

        if (!item) return;

        let quantityToSet = Math.max(1, parseInt(newQuantity) || 1);

        // Use the mapped 'stock_limit' property for the cap
        if (item.stock_limit !== undefined && quantityToSet > item.stock_limit) {
            quantityToSet = item.stock_limit; // Cap to max stock
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Update the 'on_cart' table quantity in the database
        const { error } = await supabase
            .from('on_cart')
            .update({ quantity: quantityToSet })
            .eq('user_id', user.id)
            .eq('product_id', productId);

        if (error) {
            console.error('Error updating quantity:', error.message);
        } else {
            // Update the quantity in the local state with the actual value set
            if (item) item.quantity = quantityToSet;
        }
    };

    // --- CLEAR CART (UNCHANGED) ---
    const clearCart = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('on_cart').delete().eq('user_id', user.id);
        if(error) console.error('Error clearing cart:', error.message);
        else cart.value = [];
    };

    // --- COMPUTED TOTAL (UNCHANGED) ---
    const cartTotal = computed(() => {
        return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });

    // --- RETURN INTERFACE (UNCHANGED) ---
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