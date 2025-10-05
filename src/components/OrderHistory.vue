<template>
  <div class="order-history-page">
    <div class="container py-5">
      <h2 class="fw-bold mb-4 section-title text-center">Order History</h2>

      <div class="card shadow-sm">
        <div class="card-header bg-white p-3 d-flex justify-content-end">
          <div class="d-flex align-items-center">
            <label for="yearFilter" class="form-label me-2 mb-0">Filter:</label>
            <select class="form-select form-select-sm" id="yearFilter" style="width: 120px;">
              <option selected>All Time</option>
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
                  <th scope="col">Date Completed</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in pastOrders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.date }}</td>
                  <td>{{ order.items }}</td>
                  <td class="fw-bold">{{ order.total }}</td>
                  <td><a href="#" class="btn btn-sm btn-outline-primary rounded-pill">View Invoice</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-white d-flex justify-content-center">
          <nav aria-label="Order history pagination">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Sample data for demonstration
const pastOrders = ref([
  { id: '#RYT-10521', date: '04 Oct 2025', items: 2, total: '₱7,800.00' },
  { id: '#RYT-10498', date: '28 Sep 2025', items: 1, total: '₱1,250.00' },
  { id: '#RYT-10455', date: '15 Sep 2025', items: 4, total: '₱15,200.00' },
  { id: '#RYT-10399', date: '22 Aug 2025', items: 1, total: '₱3,500.00' },
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');
.order-history-page {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}
.section-title { font-family: 'Poppins', sans-serif; }
.card { border: none; }
.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>