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
                    <h6 class="fw-bold">Product Details</h6>
                    <p class="mb-1">{{ order.product_name }} ({{ order.size }})</p>
                    <p class="mb-0 text-muted">Quantity: {{ order.quantity }}</p>
                </div>
                <div class="col-md-6 mt-3 mt-md-0">
                    <h6 class="fw-bold">Shipping Address</h6>
                    <p class="mb-0 text-muted">{{ order.shipping_address }}</p>
                </div>
            </div>

            <h6 class="fw-bold mb-4">Status: <span class="text-primary">{{ order.status }}</span></h6>
            
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../server/supabase';

const orders = ref([]);
const isLoading = ref(true);
const statusHierarchy = ['Payment Process', 'Payment Success', 'Order Processed', 'Shipped', 'Delivered'];

const fetchOrders = async () => {
  isLoading.value = true;
  try {
    // Get the current user to fetch only their orders
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        orders.value = [];
        return;
    }

    const { data, error } = await supabase
      .from('orders') // Reading from the new 'orders' table
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }); // Show newest first
    
    if (error) throw error;
    orders.value = data;
  } catch (error) {
    console.error("Error fetching orders:", error.message);
  } finally {
    isLoading.value = false;
  }
};

const getStepClass = (orderStatus, stepName) => {
  const orderIndex = statusHierarchy.indexOf(orderStatus);
  const stepIndex = statusHierarchy.indexOf(stepName);
  
  if (stepIndex < orderIndex) {
    return 'step completed';
  } else if (stepIndex === orderIndex) {
    return 'step active';
  } else {
    return 'step';
  }
};

const getConnectorClass = (orderStatus, stepName) => {
  const orderIndex = statusHierarchy.indexOf(orderStatus);
  const stepIndex = statusHierarchy.indexOf(stepName);
  
  if (stepIndex < orderIndex) {
    return 'connector completed';
  } else {
    return 'connector';
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');
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