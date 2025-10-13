<template>
  <div class="shopping-cart-page">
    <div class="container py-5">
      <h2 class="fw-bold mb-5 section-title text-center">Shopping Cart</h2>
      <div v-if="cart.length > 0" class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0 fw-bold">Your Items ({{ cart.length }})</h5>
            </div>
            <div class="card-body">
              <div v-for="(item, index) in cart" :key="item.id">
                <div class="row align-items-center mb-4 cart-item">
                  <div class="col-2 col-md-2">
                    <img :src="item.image_url || '/images/placeholder.png'" class="img-fluid rounded" :alt="item.brand">
                  </div>
                  <div class="col-5 col-md-5">
                    <h6 class="fw-bold mb-1">{{ item.brand }}</h6>
                    <p class="text-muted small mb-0">Size: {{ item.size }}</p>
                  </div>
                  <div class="col-3 col-md-3">
                    <input 
                      type="number" 
                      class="form-control form-control-sm text-center" 
                      :value="item.quantity"
                      @input="updateQuantity(item.id, parseInt($event.target.value))"
                      min="1"
                    >
                  </div>
                  <div class="col-2 col-md-2 text-end">  
                    <h6 class="fw-bold mb-0">₱{{ (item.price * item.quantity).toLocaleString() }}</h6>
                    <a href="#" class="text-danger small" @click.prevent="removeFromCart(item.id)">Remove</a>
                  </div>
                </div>
                <hr v-if="index < cart.length - 1">
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
                  <span>₱{{ cartTotal.toLocaleString() }}.00</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-2">
                  <span>Shipping</span>
                  <span>₱{{ shippingFee.toLocaleString() }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 mb-3">
                  <strong class="fw-bold">Total</strong>
                  <strong class="fw-bold fs-5 text-danger">₱{{ grandTotal.toLocaleString() }}.00</strong>
                </li>
              </ul>
              <div class="d-grid">
                <button class="btn btn-primary btn-lg rounded-pill" @click="proceedToAddress">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-5">
        <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
        <h4 class="fw-bold">Your cart is empty</h4>
        <p class="text-muted">Looks like you haven't added anything to your cart yet.</p>
        <button class="btn btn-primary rounded-pill mt-3" @click="router.push({ name: 'ordering system' })">
          Start Shopping
        </button>
      </div>
    </div>
  </div>
  <div class="shopping-cart-page">
    <div class="container py-5">
      </div>

    <button @click="goToOrderingSystem" class="fab" title="Continue Shopping">
      <i class="fas fa-shopping-bag"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '../composables/useCart';

const router = useRouter();
const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

const shippingFee = "Free Shipping"; // Example shipping fee

const grandTotal = computed(() => {
  return cartTotal.value;
});

// ADDED FUNCTION
const goToOrderingSystem = () => {
  router.push({ name: 'ordering system' });
};

// The only function that needs to be created
const proceedToAddress = () => {
  if (cart.value.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  // UPDATED: Navigate to the address book instead of payment
  router.push({ name: 'BookOrderAddress' });
};
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
</style>