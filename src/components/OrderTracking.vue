<template>
    <div class="order-tracking-page">
        <div class="container py-5">
            <h2 class="fw-bold mb-5 section-title text-center">Your Order History</h2>

            <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <div v-else-if="orders.length === 0" class="text-center py-5">
                <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                <h4 class="fw-bold">No Orders Found</h4>
                <p class="text-muted">You haven't placed any orders yet.</p>
            </div>

            <div v-else>
                <div class="card shadow-sm mb-4 order-card" v-for="order in orders" :key="order.order_id">
                    <div class="card-header bg-white d-flex flex-wrap justify-content-between align-items-center py-3">
                        <div>
                            <h6 class="fw-bold mb-1">Order #{{ order.order_id.slice(0, 8).toUpperCase() }}</h6>
                            <p class="text-muted small mb-0">Placed on {{ new Date(order.created_at).toLocaleDateString() }}</p>
                        </div>
                        <div>
                            <span class="fw-bold me-3">Item Total: ₱{{ order.total_price.toLocaleString() }}</span>
                        </div>
                    </div>
                    <div class="card-body p-4">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h6 class="fw-bold">Items in this Order</h6>
                                <ul class="list-unstyled">
                                    <li v-for="item in order.order_items" :key="item.id" class="mb-2">
                                        <p class="mb-0 fw-medium">{{ item.products.brand }} ({{ item.products.size }})</p>
                                        <p class="mb-0 text-muted small">
                                            Quantity: {{ item.quantity }} @ ₱{{ item.price_at_purchase.toLocaleString() }} each
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <h6 class="fw-bold mb-4">
                            Status: <span :class="getStatusColorClass(order.status)">{{ order.status }}</span>
                        </h6>

                        <div class="status-tracker">
                            <div :class="getStepClass(order.status, 'Payment Process')">
                                <div class="icon"><i class="fas fa-hourglass-half"></i></div>
                                <div class="label">Payment Process</div>
                            </div>
                            <div :class="getConnectorClass(order.status, 'Payment Process')"></div>
                            
                            <div :class="getStepClass(order.status, 'Payment Success')">
                                <div class="icon"><i class="fas fa-check-circle"></i></div>
                                <div class="label">Payment Success</div>
                            </div>
                            <div :class="getConnectorClass(order.status, 'Payment Success')"></div>
                            
                            <div :class="getStepClass(order.status, 'Order Processed')">
                                <div class="icon"><i class="fas fa-box"></i></div>
                                <div class="label">Order Processed</div>
                            </div>
                            <div :class="getConnectorClass(order.status, 'Order Processed')"></div>
                            
                            <div :class="getStepClass(order.status, 'Shipped')">
                                <div class="icon"><i class="fas fa-shipping-fast"></i></div>
                                <div class="label">Shipped</div>
                            </div>
                            <div :class="getConnectorClass(order.status, 'Shipped')"></div>
                            
                            <div :class="getStepClass(order.status, 'Delivered')">
                                <div class="icon"><i class="fas fa-home"></i></div>
                                <div class="label">Delivered</div>
                            </div>
                        </div>

                        <div v-if="order.status === 'Shipped'" class="mt-4 text-center">
                            <button 
                                class="btn btn-lg btn-success rounded-pill px-4" 
                                @click="handleOrderReceived(order.order_id)"
                                :disabled="isUpdatingStatus === order.order_id"
                            >
                                <span v-if="isUpdatingStatus === order.order_id" class="spinner-border spinner-border-sm me-2"></span>
                                <i v-else class="fas fa-hands me-2"></i>Order Received
                            </button>
                        </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
    <div class="order-tracking-page">
        <div class="container py-5">
        </div>

        <button @click="goToOrderingSystem" class="fab" title="Shop More">
            <i class="fas fa-shopping-bag"></i>
        </button>
    </div>
</template>

<script setup>
// --- IMPORTS & SETUP ---
import { ref, onMounted, computed } from 'vue'; // Core Vue functions for state, reactivity, and lifecycle
import { supabase } from '../server/supabase'; // Supabase client for data fetching
import { useRouter } from 'vue-router'; // Vue Router for navigation

// Initialize the router
const router = useRouter();

// --- REACTIVE STATE ---
const orders = ref([]); // Array to store the list of the current user's orders
const isLoading = ref(true); // Boolean to manage the loading state while fetching data
// NEW: Tracks the order ID currently being updated (to show spinner)
const isUpdatingStatus = ref(null); 

// Defines the sequence and valid names for the order status steps
const statusHierarchy = ['Payment Process', 'Payment Success', 'Order Processed', 'Shipped', 'Delivered']; 

// --- DATABASE FUNCTION ---
/**
 * Fetches all orders belonging to the currently logged-in user.
 * Orders the results by newest first.
 */
const fetchOrders = async () => {
    isLoading.value = true;
    try {
        // Get the current user's session data
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            orders.value = []; // Clear orders if no user is logged in
            return;
        }

        // Fetch orders and nested order items, including product details (brand, size)
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *, 
                order_items (
                    id, 
                    quantity, 
                    price_at_purchase,
                    products!inner(brand, size) 
                )
            `)
            .eq('user_id', user.id) // Filter orders by the current user
            .order('created_at', { ascending: false }); // Display newest orders first
        
        if (error) throw error;
        orders.value = data;
    } catch (error) {
        console.error("Error fetching orders:", error.message);
    } finally {
        isLoading.value = false;
    }
};

/**
 * Handles the customer confirming receipt of the order.
 * Updates the order status to 'Delivered'.
 * @param {string} orderId - The ID of the order to update.
 */
const handleOrderReceived = async (orderId) => {
    if (!window.confirm('Confirming receipt will mark the order as DELIVERED. Proceed?')) {
        return;
    }

    isUpdatingStatus.value = orderId;
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'Delivered' })
            .eq('order_id', orderId);

        if (error) throw error;

        // Success: Alert the user and refresh the list to update the tracker UI
        alert(`Order #${orderId.slice(0, 8)} successfully marked as delivered!`);
        await fetchOrders(); 

    } catch (error) {
        console.error("Error confirming delivery:", error.message);
        alert(`Failed to confirm delivery. Please try again. Details: ${error.message}`);
    } finally {
        isUpdatingStatus.value = null;
    }
};

// --- ORDER TRACKING UI LOGIC (Computed Classes) ---

/**
 * Maps the status string to a relevant color class for the Status tag.
 */
const getStatusColorClass = (status) => {
    switch (status) {
        case 'Delivered':
            return 'text-success';
        case 'Shipped':
            return 'text-warning'; // Yellow/orange for in-transit
        case 'Order Processed':
        case 'Payment Success':
            return 'text-info';
        default:
            return 'text-primary';
    }
};

/**
 * Determines the CSS class for a specific step in the tracking hierarchy.
 */
const getStepClass = (orderStatus, stepName) => {
    const orderIndex = statusHierarchy.indexOf(orderStatus);
    const stepIndex = statusHierarchy.indexOf(stepName);
    
    if (stepIndex < orderIndex) {
        return 'step completed'; // Step is already passed
    } else if (stepIndex === orderIndex) {
        return 'step active'; // Step is the current status
    } else {
        return 'step'; // Step is yet to come
    }
};

/**
 * Determines the CSS class for the connector line between steps.
 */
const getConnectorClass = (orderStatus, stepName) => {
    const orderIndex = statusHierarchy.indexOf(orderStatus);
    const stepIndex = statusHierarchy.indexOf(stepName);
    
    if (stepIndex < orderIndex) {
        return 'connector completed'; // Connector should be colored as complete
    } else {
        return 'connector'; // Connector is grey/default
    }
};

// --- NAVIGATION FUNCTION ---
/**
 * Navigates the user back to the main 'ordering system' page.
 */
const goToOrderingSystem = () => {
    router.push({ name: 'ordering system' });
};
// --- LIFECYCLE HOOKS ---

// Call fetchOrders immediately when the component loads
onMounted(fetchOrders);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');
/* ADDED STYLES FOR FAB */
.fab {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #0d6efd;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 1000;
    transition: transform 0.2s ease-in-out;
}

.fab:hover {
    transform: scale(1.1);
}
.order-tracking-page { font-family: 'Roboto', sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.section-title { font-family: 'Poppins', sans-serif; }
.order-card { border: none; }
.card-header h6 { font-family: 'Poppins', sans-serif; }
.status-tracker { display: flex; align-items: flex-start; justify-content: space-between; overflow-x: auto; padding-bottom: 1rem; }
.step { text-align: center; min-width: 100px; flex-shrink: 0; }
.step .icon { width: 40px; height: 40px; border-radius: 50%; background-color: #e9ecef; color: #adb5bd; display: inline-flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 3px solid #e9ecef; }
.step .label { margin-top: 10px; font-size: 0.85rem; font-weight: 500; color: #6c757d; }
.step.active .icon { background-color: #e7f1ff; color: #0d6efd; border-color: #0d6efd; }
.step.active .label { color: #0d6efd; }
.step.completed .icon { background-color: #198754; color: #fff; border-color: #198754; }
.step.completed .label { color: #198754; }
.connector { flex-grow: 1; height: 4px; background-color: #e9ecef; margin-top: 18px; }
.connector.completed { background-color: #198754; }
</style>