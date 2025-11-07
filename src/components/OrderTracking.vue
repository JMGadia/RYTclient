<template>
  <div class="order-tracking-page">
    <div class="container py-5">
      <h2 class="fw-bold mb-5 section-title text-center">Your Order History</h2>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="inProcessOrders.length === 0 && !isLoading" class="text-center py-5">
        <i class="fas fa-box-open fa-3x text-light mb-3"></i>
        <h4 class="fw-bold text-light">No Orders Found</h4>
        <p class="text-muted text-light">You haven't placed any orders yet.</p>
      </div>

      <div v-else>
        <div class="card shadow-sm mb-4 order-card" v-for="order in inProcessOrders" :key="order.order_id">
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

    <button @click="goToOrderingSystem" class="fab" title="Shop More">
      <i class="fas fa-shopping-bag"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'; // Added 'onUnmounted'
import { supabase } from '../server/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

const orders = ref([]); // Holds ALL orders fetched from DB
const isLoading = ref(true);
const isUpdatingStatus = ref(null);
let orderSubscription = null; // Variable to hold the real-time subscription object

const statusHierarchy = [
  'Payment Process',
  'Payment Success',
  'Order Processed',
  'Shipped',
  'Delivered'
];

// --- 🎯 CORE CHANGE: COMPUTED PROPERTY FOR FILTERING ---
/**
 * Filters the raw orders array, excluding any order that is 'Delivered'.
 * This ensures the UI only shows active/in-process orders.
 */
const inProcessOrders = computed(() => {
    return orders.value.filter(order => order.status !== 'Delivered');
});
// --------------------------------------------------------

// --- REAL-TIME UPDATE HANDLER ---
const handleRealtimeUpdate = (payload) => {
    console.log('Realtime update received:', payload);
    const updatedOrder = payload.new;

    // Find the index of the order in the local array
    const index = orders.value.findIndex(order => order.order_id === updatedOrder.order_id);

    // Process the status update
    const newStatus = updatedOrder.status === 'Pre-Ordered' ? 'Order Processed' : updatedOrder.status;

    if (index !== -1) {
        // If the order exists locally, update its status (and other fields if needed)
        orders.value[index] = {
            ...orders.value[index], // Preserve nested data (order_items) that wasn't included in the UPDATE payload
            status: newStatus,
            // You can update other top-level fields here if they might change
        };
    } else if (newStatus !== 'Delivered') {
        // OPTIONAL: If the update is for a new order that hasn't been fetched yet
        // You would typically re-fetch or construct the full order object here.
        // For simplicity, we assume 'fetchOrders' will capture new orders on page load.
        // If a new order is placed *while* this page is open, you might need a more complex merge/refetch logic.
        // Given this page is Order History, a simple update to existing orders is usually sufficient.
    }
};

// --- SETUP REAL-TIME SUBSCRIPTION ---
const setupRealtimeSubscription = async (userId) => {
    // 1. Remove previous subscription if it exists
    if (orderSubscription) {
        await supabase.removeChannel(orderSubscription);
    }

    // 2. Subscribe to changes in the 'orders' table, filtered by the current user's ID
    orderSubscription = supabase
        .channel(`order_updates:${userId}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE', // Only listen for updates
                schema: 'public',
                table: 'orders',
                filter: `user_id=eq.${userId}` // Crucial: Only listen for the current user's orders
            },
            handleRealtimeUpdate
        )
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('Real-time subscription to orders is active.');
            }
        });
};

// --- FETCH ORDERS ---
const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      orders.value = [];
      return;
    }

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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Store ALL fetched orders. The computed property handles filtering for display.
    orders.value = data.map(order => ({
      ...order,
      status: order.status === 'Pre-Ordered' ? 'Order Processed' : order.status
    }));

    // Setup real-time listener after successfully fetching the initial data
    await setupRealtimeSubscription(user.id);

  } catch (error) {
    console.error('Error fetching orders:', error.message);
  } finally {
    isLoading.value = false;
  }
};

// --- CONFIRM ORDER RECEIVED (The status update here will also trigger the Realtime listener for other users/devices) ---
const handleOrderReceived = async (orderId) => {
  if (!window.confirm('Confirming receipt will mark the order as DELIVERED. Proceed?')) return;

  isUpdatingStatus.value = orderId;
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'Delivered' })
      .eq('order_id', orderId);

    if (error) throw error;

    alert(`Order #${orderId.slice(0, 8)} successfully marked as delivered!`);

    // Note: Instead of explicit 'fetchOrders()' now,
    // the change will be reflected automatically via the Realtime subscription
    // which calls 'handleRealtimeUpdate' when this update completes in the database.

    // However, if you want *immediate* local feedback without waiting for the RT event:
    handleRealtimeUpdate({ new: { order_id: orderId, status: 'Delivered' } });


  } catch (error) {
    console.error('Error confirming delivery:', error.message);
    alert(`Failed to confirm delivery. Please try again. Details: ${error.message}`);
  } finally {
    isUpdatingStatus.value = null;
  }
};

// --- STATUS TRACKER HELPERS (Unchanged) ---
const getStatusColorClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'text-success';
    case 'Shipped':
    case 'Ready for Pickup':
      return 'text-warning';
    case 'Order Processed':
    case 'Payment Success':
      return 'text-info';
    default:
      return 'text-primary';
  }
};

const getStepClass = (orderStatus, stepName) => {
  const orderIndex = statusHierarchy.indexOf(orderStatus);
  const stepIndex = statusHierarchy.indexOf(stepName);
  if (stepIndex < orderIndex) return 'step completed';
  if (stepIndex === orderIndex) return 'step active';
  return 'step';
};

const getConnectorClass = (orderStatus, stepName) => {
  const orderIndex = statusHierarchy.indexOf(orderStatus);
  const stepIndex = statusHierarchy.indexOf(stepName);
  return stepIndex < orderIndex ? 'connector completed' : 'connector';
};

// --- NAVIGATION ---
const goToOrderingSystem = () => {
  router.push({ name: 'ordering system' });
};

// --- INITIAL LOAD & CLEANUP ---
onMounted(fetchOrders);

// Crucial: Clean up the subscription when the component is unmounted
onUnmounted(() => {
    if (orderSubscription) {
        supabase.removeChannel(orderSubscription);
        console.log('Real-time subscription removed.');
    }
});
</script>

<style scoped>
/* ============================================================
    STYLES from UI-focused Code (Modern Aurora Background & Glassmorphism)
  ============================================================
*/
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400;500&display=swap');

/* 🌈 Aurora Gradient Background (unchanged) */
.order-tracking-page {
    font-family: 'Roboto', sans-serif;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Animated Aurora Background (unchanged) */
.order-tracking-page::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image:
        radial-gradient(circle at 15% 20%, #5a7dff 10%, transparent 50%),
        radial-gradient(circle at 80% 80%, #d08bff 10%, transparent 40%),
        radial-gradient(circle at 50% 40%, #ff8ed1 10%, transparent 40%),
        linear-gradient(120deg, #0c0a24, #241e4e, #17133d);
    filter: blur(80px);
    opacity: 0.9;
    animation: auroraAnimation 25s ease-in-out infinite;
    z-index: 0;
}

@keyframes auroraAnimation {
    0% { transform: rotate(0deg) translateX(0); }
    50% { transform: rotate(180deg) translateX(10%); }
    100% { transform: rotate(360deg) translateX(0); }
}

/* Keep main content above background (unchanged) */
.container,
.fab {
    position: relative;
    z-index: 2;
}

/* --- Floating Action Button (FAB) (unchanged) --- */
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

/* --- Section Title (unchanged) --- */
.section-title {
    font-family: 'Poppins', sans-serif;
    color: #fff;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

/* --- Order Card (Glass Effect) (unchanged) --- */
.order-card {
    border: none;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.order-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(13, 110, 253, 0.25);
}

/* --- Card Header (unchanged) --- */
.card-header h6 {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
}
.card-header {
    background-color: rgba(255, 255, 255, 0.9) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

/* --- Status Tracker (Standardized for Bootstrap 5) --- */
.status-tracker {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    /* This scrollbar is necessary since there are 5 steps */
    overflow-x: auto;
    padding-bottom: 1rem;
}

/* 💥 FIX 1: Ensure header content wraps cleanly on mobile */
.card-header.d-flex.flex-wrap {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 0.5rem;
}
.card-header .fw-bold.me-3 {
    margin-right: 0 !important;
    font-size: 1.1rem; /* Make total price stand out slightly */
}


.step {
    text-align: center;
    /* 💥 FIX 2: Reduce min-width of each step for mobile */
    min-width: 85px;
    flex-shrink: 0;
}
.step .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e9ecef;
    color: #adb5bd;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 3px solid #e9ecef;
}
.step .label {
    margin-top: 10px;
    /* 💥 FIX 3: Smaller font for labels on mobile */
    font-size: 0.7rem;
    font-weight: 500;
    color: #6c757d;
    /* 💥 FIX 4: Allow text to wrap for long labels */
    word-break: break-word;
    white-space: normal;
    padding: 0 5px; /* Add slight padding for separation */
}
.step.active .icon {
    background-color: #e7f1ff;
    color: #0d6efd;
    border-color: #0d6efd;
}
.step.completed .icon {
    background-color: #198754;
    color: #fff;
    border-color: #198754;
}
.step.completed .label {
    color: #198754;
}

/* --- Connector --- */
.connector {
    /* 💥 FIX 5: Reduce connector width for more step space */
    flex-grow: 0.5;
    height: 4px;
    background-color: #e9ecef;
    margin-top: 18px;
    /* Set a max width for extra small screens to prevent overflow */
    max-width: 15px;
}
.connector.completed {
    background-color: #198754;
}

/* --- Media Query for Larger Screens (Restore default values) --- */
@media (min-width: 576px) { /* Restore spacing on tablet/desktop views */
    .card-header.d-flex.flex-wrap {
        flex-direction: row;
        align-items: center !important;
        gap: 0;
    }
    .step {
        min-width: 100px;
    }
    .step .label {
        font-size: 0.85rem;
        padding: 0;
    }
    .connector {
        flex-grow: 1;
        max-width: none;
    }
}


/* --- Empty State Overrides for Dark Background (unchanged) --- */
.order-tracking-page .text-light,
.order-tracking-page .fa-box-open {
    color: #fff !important;
}

.order-tracking-page .text-muted.text-light {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* Overriding text color for Order Item details (unchanged) */
.card-body p {
    color: #212529 !important;
}

.card-body .text-muted {
    color: #6c757d !important;
}
</style>