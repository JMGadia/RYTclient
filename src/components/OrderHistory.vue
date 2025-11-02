<template>
  <div class="order-history-page">
    <div class="container py-5">
      <h2 class="fw-bold mb-4 section-title text-center">Order History</h2>

      <div class="card shadow-sm">
        <div class="card-header bg-white p-3 d-flex justify-content-end">
          <div class="d-flex align-items-center">
            <label for="yearFilter" class="form-label me-2 mb-0">Filter:</label>
            <select class="form-select form-select-sm" id="yearFilter" style="width: 120px;" v-model="selectedYear" @change="fetchOrders">
              <option value="All Time">All Time</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">Product Description</th>
                  <th scope="col">Date Delivered</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total Purchased</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="5" class="text-center py-4">Loading orders...</td>
                </tr>
                <tr v-else-if="paginatedOrders.length === 0">
                  <td colspan="5" class="text-center py-4">No orders found for this user.</td>
                </tr>
                <tr v-else v-for="order in paginatedOrders" :key="order.order_id">
                  <td>{{ order.order_id }}</td>
                  <td>{{ order.main_product_name }}</td>
                  <td>{{ order.date_shipped || 'Pending Shipment' }}</td>
                  <td>{{ order.items_count }}</td>
                  <td class="fw-bold">{{ formatCurrency(order.total_price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-footer bg-white d-flex justify-content-center">
          <nav aria-label="Order history pagination">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
              </li>

              <li class="page-item"
                  v-for="page in totalPages"
                  :key="page"
                  :class="{ 'active': currentPage === page }">
                <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
              </li>

              <li class="page-item" :class="{ 'disabled': currentPage === totalPages || totalPages === 0 }">
                <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '../server/supabase'; // Corrected path

// --- STATE ---
const orders = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 12; // List length requirement
const selectedYear = ref('All Time');
let realtimeChannel = null;

// --- COMPUTED PROPERTIES & HELPERS (No logic changes) ---
const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));
const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return orders.value.slice(start, end);
});

const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

// Function to process raw order data from the join
const processOrderData = (rawOrders) => {
    return rawOrders.map(order => {

        // 1. Calculate the TOTAL quantity by summing the 'quantity' column from all order_items
        const totalQuantity = order.order_items
            ? order.order_items.reduce((sum, item) => sum + item.quantity, 0)
            : 0; // If no items, total quantity is 0

        // 2. Get main_product_name (unchanged)
        const firstItem = order.order_items ? order.order_items[0] : null;
        const mainProductName = firstItem?.products?.brand || 'Multiple Items';

        return {
            ...order,
            // 'items_count' now holds the numerical sum of all items' quantity
            items_count: totalQuantity,
            main_product_name: mainProductName,
        };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// --- DATA FETCHING & REALTIME ---
const fetchOrders = async () => {
    loading.value = true;
    currentPage.value = 1;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
        console.error('Authentication Check: User not logged in or session expired.');
        loading.value = false;
        orders.value = [];
        return;
    }

    let query = supabase
        .from('orders')
        // FIX: Updated select to request 'brand' from products, not 'title'.
        .select('order_id, date_shipped, total_price, created_at, status, order_items(quantity, products(brand))') // <--- USING 'BRAND'
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (selectedYear.value !== 'All Time') {
        const startOfYear = `${selectedYear.value}-01-01T00:00:00Z`;
        const endOfYear = `${selectedYear.value}-12-31T23:59:59Z`;
        query = query.gte('created_at', startOfYear).lte('created_at', endOfYear);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching orders:', error.message);
        orders.value = [];
    } else {
        orders.value = processOrderData(data);
    }

    loading.value = false;
};

// (Realtime and Pagination functions remain unchanged)

const subscribeToOrders = async () => { /* ... unchanged ... */ await fetchOrders(); };
const prevPage = () => { /* ... unchanged ... */ };
const nextPage = () => { /* ... unchanged ... */ };
const goToPage = (page) => { /* ... unchanged ... */ };

onMounted(() => {
    fetchOrders();
    subscribeToOrders();
});

onUnmounted(() => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
    }
});
</script>

<style scoped>
/* ============================================================
    STYLES from UI-focused Code (Keep all your existing styles)
   ============================================================
*/
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');

.order-history-page {
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.order-history-page::before {
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

.container {
  position: relative;
  z-index: 2;
}

.card {
  border: none;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header, .card-footer {
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.4);
}

.table thead th {
  background-color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.table {
    --bs-table-bg: transparent;
}

.table tbody tr:hover {
  background-color: rgba(13, 110, 253, 0.05);
  transition: background 0.3s ease;
}

.page-link {
  border-radius: 50rem !important;
  font-family: 'Poppins', sans-serif;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

.page-link:hover {
  background-color: rgba(13, 110, 253, 0.1);
}

.section-title {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>