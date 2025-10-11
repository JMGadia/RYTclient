<template>
  <div class="ordering-page">
    <nav class="navbar navbar-expand-md navbar-light bg-white py-3 border-bottom shadow-sm sticky-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="../assets/background.jpg" alt="RYT-Tyre Logo" height="40" class="me-2 rounded-circle" />
          <strong class="text-dark fs-5">RYT-Tyre</strong>
        </a>

        <form class="d-none d-md-flex mx-auto" style="max-width: 500px;" @submit.prevent>
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0"><i class="fas fa-search"></i></span>
            <input class="form-control rounded-pill rounded-start-0 border-start-0" type="search" placeholder="Search for tires and parts..." aria-label="Search" />
          </div>
        </form>

        <button class="navbar-toggler d-md-none" type="button" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="d-none d-md-flex align-items-center">
          <a href="#" class="nav-icon-link" @click.prevent="router.push({ name: 'profile' })" title="My Account">
            <img src="../assets/userIcon.png" alt="Account Management" height="28" />
          </a>
          <a href="#" class="nav-icon-link" @click.prevent="router.push({ name: 'order tracking' })" title="Track Order">
            <img src="../assets/orderTrackicon.png" alt="Order Tracking" height="28" />
          </a>
          <a href="#" class="nav-icon-link" @click.prevent="router.push({ name: 'cart' })" title="Shopping Cart">
            <img src="../assets/cartIcon.png" alt="Cart" height="28" />
          </a>
        </div>
      </div>
    </nav>

    <div class="container d-md-none py-2 bg-white border-bottom">
        <form @submit.prevent>
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class="fas fa-search"></i></span>
                <input class="form-control rounded-pill rounded-start-0 border-start-0" type="search" placeholder="Search..." aria-label="Search" />
            </div>
        </form>
    </div>

    <Transition name="slide-right">
      <div v-if="isMobileMenuOpen" class="mobile-side-panel">
        <ul class="list-unstyled mb-0">
          <li>
            <a href="#" class="panel-link" @click.prevent="navigateAndCloseMenu('profile')">
              <img src="../assets/userIcon.png" alt="Account" height="24" />
              <span>My Account</span>
            </a>
          </li>
          <li>
            <a href="#" class="panel-link" @click.prevent="navigateAndCloseMenu('order tracking')">
              <img src="../assets/orderTrackicon.png" alt="Track Order" height="24" />
              <span>Track Order</span>
            </a>
          </li>
          <li>
            <a href="#" class="panel-link" @click.prevent="navigateAndCloseMenu('cart')">
              <img src="../assets/cartIcon.png" alt="Cart" height="24" />
              <span>Shopping Cart</span>
            </a>
          </li>
        </ul>
      </div>
    </Transition>

    <section class="advertisement-banner">
      <img src="../assets/mainAds.png" alt="Best place to buy tires online advertisement" class="img-fluid" />
    </section>

    <section class="py-5">
      <div class="container">
        <h3 class="fw-bold mb-4 text-center section-title">BROWSE BY CATEGORY</h3>
        <div class="d-flex justify-content-center flex-wrap gap-2">
          <button @click="selectCategory('All')" :class="['btn-glass', { 'active': selectedCategory === 'All' }]">All</button>
          <button @click="selectCategory('Tires')" :class="['btn-glass', { 'active': selectedCategory === 'Tires' }]">Tires</button>
          <button @click="selectCategory('Non-Tires')" :class="['btn-glass', { 'active': selectedCategory === 'Non-Tires' }]">Non-Tires</button>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div v-if="loading" class="text-center py-5 text-white">
          <p class="fs-5">Loading products...</p>
        </div>
        <div v-else-if="error" class="text-center py-5 text-danger">
          <p class="fs-5">Could not load products at this time.</p>
        </div>
        <div v-else-if="filteredProducts.length > 0" class="row g-4 justify-content-center">
          <div class="col-6 col-md-4 col-lg-3" v-for="product in filteredProducts" :key="product.id">
            <div class="card h-100 product-card">
              <div class="card-img-container">
                <img :src="product.image_url || '/images/placeholder.png'" class="card-img-top p-3" :alt="product.brand">
              </div>
              <div class="card-body text-center d-flex flex-column">
                <h6 class="fw-semibold mb-2 product-name">{{ product.brand }} - {{ product.size }}</h6>
                <p class="text-danger fw-bold fs-5 mb-3">₱{{ product.price }}</p>
                
                <span v-if="product.status !== 'In Stock'" 
                  :class="['badge', 'mb-3', 'align-self-center', 'stock-badge', product.status === 'Out of Stock' ? 'bg-danger' : 'bg-warning text-dark']">
                  {{ product.status }}
                </span>

                <button 
                  v-if="product.status === 'In Stock' || product.status === 'Low Stock'"
                  class="btn btn-sm btn-primary mt-auto rounded-pill px-4" 
                  @click="handleAddToCart(product)"
                >
                  Add to Cart
                </button>

              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
          <p class="text-muted fs-5">No products found in this category.</p>
        </div>
      </div>
    </section>

    <footer class="bg-dark text-white pt-5 pb-3">
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProducts, getProductImageURL } from '../services/apiService';
import { useCart } from '../composables/useCart'; // Import the new cart composable

// --- Logic for cart ---
const { addToCart } = useCart();
const handleAddToCart = (product) => {
  addToCart(product);
  router.push({ name: 'cart' });
};

// --- Logic for navigation and UI state ---
const router = useRouter();
const isMobileMenuOpen = ref(false);
const selectedCategory = ref('All');

const navigateAndCloseMenu = (routeName) => {
  isMobileMenuOpen.value = false;
  router.push({ name: routeName });
};

const selectCategory = (category) => {
  selectedCategory.value = category;
};

// --- Logic for fetching and displaying products ---
const allProducts = ref([]);
const loading = ref(true);
const error = ref(null);

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') {
    return allProducts.value;
  }
  return allProducts.value.filter(product => product.product_type === selectedCategory.value);
});

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: fetchError } = await getProducts();
    if (fetchError) throw fetchError;

    if (data) {
      allProducts.value = data.map(product => ({
        ...product,
        image_url: getProductImageURL(product.image_url)
      }));
    }
  } catch (err) {
    error.value = err.message;
    console.error("Failed to fetch products:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

@keyframes auroraAnimation {
    0% { transform: rotate(0deg) translateX(10%); }
    50% { transform: rotate(180deg) translateX(10%); }
    100% { transform: rotate(360deg) translateX(10%); }
}

.ordering-page { 
  font-family: 'Roboto', sans-serif; 
  position: relative;
  background-color: #0c0a24;
  overflow-x: hidden;
}

.ordering-page::before {
  content: '';
  position: fixed;
  top: -50%; left: -50%; right: -50%; bottom: -50%;
  z-index: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, #6e86ff 10%, transparent 40%),
    radial-gradient(circle at 80% 90%, #d8b4fe 15%, transparent 50%),
    radial-gradient(circle at 50% 50%, #f7c2d8 12%, transparent 45%),
    radial-gradient(circle at 90% 10%, #63a4ff 20%, transparent 60%);
  filter: blur(100px);
  animation: auroraAnimation 20s ease-in-out infinite;
}

.navbar, section, footer {
  position: relative;
  z-index: 1;
}

section {
  background-color: transparent !important;
}

.section-title { 
  font-family: 'Poppins', sans-serif; 
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative; 
  padding-bottom: 10px; 
}
.section-title::after { 
  content: ''; 
  position: absolute; 
  left: 50%; bottom: 0; 
  transform: translateX(-50%); 
  width: 60px; height: 3px; 
  background-color: #0d6efd; 
  border-radius: 2px; 
}

.product-card { 
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem; 
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); 
}
.card-img-container { 
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  height: 160px; 
}

/* --- NAVBAR STYLES --- */
.navbar-brand strong { font-family: 'Poppins', sans-serif; font-weight: 600; color: #212529 !important; }
.input-group-text { border-radius: 50rem 0 0 50rem; background-color: #f8f9fa; }
.form-control:focus { box-shadow: none; border-color: #ced4da; }
.navbar-toggler { border: none; }
.navbar-toggler:focus { box-shadow: none; }
.nav-icon-link { 
    margin-left: 1rem; 
}

/* --- MOBILE SIDE PANEL STYLES --- */
.mobile-side-panel {
  position: fixed;
  top: 80px;
  right: 0;
  width: auto;
  background-color: #343a40; /* Simple solid dark color */
  border-radius: 1rem 0 0 1rem; /* Rounded on the left side */
  box-shadow: -5px 5px 20px rgba(0, 0, 0, 0.3);
  z-index: 1050;
  padding: 0.5rem;
  padding-left: 2rem; /* Make space for the handle */
}
/* This creates the "handle" from your sketch */
.mobile-side-panel::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 60px;
  background-color: #343a40;
  border-radius: 10px 0 0 10px;
}
.panel-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: #f8f9fa;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  white-space: nowrap; /* Prevent text from wrapping */
}
.panel-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.panel-link img {
  filter: invert(1);
  margin-right: 0.75rem;
}

/* --- TRANSITION FOR THE PANEL --- */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.advertisement-banner img { width: 100%; height: auto; display: block; }

.card-img-top { max-height: 100%; max-width: 100%; object-fit: contain; padding: 10px; }
.product-name { min-height: 40px; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; color: #212529; }
.product-card .card-body { padding: 1rem; }
.btn { font-family: 'Poppins', sans-serif; font-weight: 500; }
footer { background-color: rgba(12, 10, 36, 0.8) !important; backdrop-filter: blur(5px); }

.btn-glass {
  padding: 0.5rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  border-radius: 50rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}
.btn-glass.active {
  background: #0d6efd;
  border-color: #0d6efd;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

@media (max-width: 767.98px) {
  h3.section-title { font-size: 1.5rem; }
  section.py-5 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
  .card-img-container { height: 120px; }
  .product-name { font-size: 0.9rem; }
}
</style>