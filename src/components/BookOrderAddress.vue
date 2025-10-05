<template>
  <div class="address-book-page">
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h2 class="fw-bold section-title text-center mb-0">Book Order Address</h2>
        <button class="btn btn-primary rounded-pill px-4">
          <i class="fas fa-plus me-2"></i>Add New Address
        </button>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4" v-for="address in addresses" :key="address.id">
          <div class="card shadow-sm h-100 address-card" :class="{ 'default-address': address.isDefault }">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="card-title fw-bold">{{ address.name }}</h5>
                  <p class="card-text text-muted mb-1">{{ address.phone }}</p>
                  <p class="card-text text-muted">{{ address.fullAddress }}</p>
                </div>
                <span v-if="address.isDefault" class="badge bg-success">Default</span>
              </div>
            </div>
            <div class="card-footer bg-white d-flex justify-content-end">
                <button class="btn btn-sm btn-light border me-2">Edit</button>
                <button class="btn btn-sm btn-outline-danger">Delete</button>
            </div>
          </div>
        </div>

        <div v-if="addresses.length === 0" class="col-12">
            <div class="text-center p-5 bg-light rounded">
                <i class="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
                <h4 class="fw-bold">No Addresses Found</h4>
                <p class="text-muted">Add a new address to get started.</p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Sample data - you will replace this with data from your database
const addresses = ref([
  {
    id: 1,
    name: 'Zaldy Co',
    phone: '+63 912 345 6789',
    fullAddress: '123 Rizal Street, Brgy. Poblacion, Pagbilao, Quezon, 4302',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Zaldy Co (Work)',
    phone: '+63 998 765 4321',
    fullAddress: '456 Bonifacio Avenue, Makati City, Metro Manila, 1229',
    isDefault: false,
  }
]);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');

.address-book-page {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}
.section-title { font-family: 'Poppins', sans-serif; }
.card { border: none; }
.btn-primary { font-family: 'Poppins', sans-serif; }

.address-card {
  transition: all 0.2s ease-in-out;
  border: 1px solid #dee2e6;
}
.address-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}
.address-card.default-address {
  border-color: #198754;
  border-width: 2px;
}
.card-footer {
    border-top: 1px solid #f0f0f0;
}
</style>