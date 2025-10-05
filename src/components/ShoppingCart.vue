<template>
  <div class="shopping-cart-page">
    <div class="container py-5">
      <h2 class="fw-bold mb-5 section-title text-center">Shopping Cart</h2>
      <div class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0 fw-bold">Your Items (2)</h5>
            </div>
            <div class="card-body">
              <div class="row align-items-center mb-4 cart-item">
                <div class="col-2 col-md-2">
                  <img src="../assets/products/toyota.png" class="img-fluid rounded" alt="Product Image">
                </div>
                <div class="col-5 col-md-5">
                  <h6 class="fw-bold mb-1">Bridgestone Ecopia</h6>
                  <p class="text-muted small mb-0">Size: 205/55R16</p>
                </div>
                <div class="col-3 col-md-3">
                  <input type="number" class="form-control form-control-sm text-center" value="2">
                </div>
                <div class="col-2 col-md-2 text-end">  
                  <h6 class="fw-bold mb-0">₱7,800</h6>
                  <a href="#" class="text-danger small">Remove</a>
                </div>
              </div>
              <hr>
              <div class="row align-items-center cart-item">
                 <div class="col-2 col-md-2">
                  <img src="../assets/products/honda.png" class="img-fluid rounded" alt="Product Image">
                </div>
                <div class="col-5 col-md-5">
                  <h6 class="fw-bold mb-1">Engine Oil 5L</h6>
                  <p class="text-muted small mb-0">Brand: Castrol</p>
                </div>
                <div class="col-3 col-md-3">
                  <input type="number" class="form-control form-control-sm text-center" value="1">
                </div>
                <div class="col-2 col-md-2 text-end">
                  <h6 class="fw-bold mb-0">₱1,250</h6>
                  <a href="#" class="text-danger small">Remove</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0 fw-bold">Order Summary</h5>
            </div>
            <div class="card-body p-4">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-2">
                  <span>Subtotal</span>
                  <span>₱9,050.00</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-2">
                  <span>Shipping</span>
                  <span>₱150.00</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 mb-3">
                  <strong class="fw-bold">Total</strong>
                  <strong class="fw-bold fs-5 text-danger">₱9,200.00</strong>
                </li>
              </ul>
              <div class="d-grid">
                <button class="btn btn-primary btn-lg rounded-pill" @click="router.push({ name: 'payment system' })">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // UPDATED: Import useRouter

const router = useRouter(); // UPDATED: Initialize the router
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');

.shopping-cart-page {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
}
.section-title, .card-header h5, .cart-item h6 {
  font-family: 'Poppins', sans-serif;
}
.card { border: none; }
.cart-item img {
  border: 1px solid #dee2e6;
}
.form-control-sm {
  max-width: 80px;
  margin: 0 auto;
}
.list-group-item {
  background-color: transparent;
}
.btn-primary {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
</style>