<!--Back-bone Section-->
<template>
  <div class="account-selection-page min-vh-100">
    <div class="background-overlay"></div>
    
    <div class="floating-bg-shapes">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
      <div class="bg-shape bg-shape-4"></div>
    </div>

    <div class="container-fluid h-100 position-relative d-flex align-items-center justify-content-center">
      <div class="row w-100">
        <div class="col-12">
          <div class="text-center mb-5">
            <div class="brand-logo mb-4">
              <h1 class="display-3 fw-bold text-white mb-3 brand-title">
                Account Selection Portal
              </h1>
              <div class="brand-subtitle">
                <h2 class="h3 fw-light text-white-75 mb-2">Choose your access level to continue</h2>
              </div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-lg-10 col-xl-8">
              <div class="row g-4">
                <div class="col-md-6">
                  <div 
                    class="account-card h-100"
                    @click="navigateToSuperAdmin"
                    @mouseenter="playHoverSound"
                  >
                    <div class="card border-0 shadow-lg h-100 account-card-inner">
                      <div class="card-body p-5 text-center d-flex flex-column position-relative">
                        <div class="card-pattern"></div>
                        
                        <div class="account-icon-wrapper mb-4">
                          <div class="account-icon bg-primary-gradient">
                            <img 
                              v-if="superAdminImageLoaded"
                              :src="superAdminImage" 
                              alt="Super Admin Icon" 
                              class="account-image"
                              @error="superAdminImageLoaded = false"
                              @load="superAdminImageLoaded = true"
                            >
                            <i 
                              v-else
                              class="fas fa-user-shield fa-3x text-white"
                            ></i>
                          </div>
                          <div class="icon-glow"></div>
                        </div>

                        <h3 class="card-title fw-bold text-dark mb-3">Super Administrator</h3>
                        <p class="card-text text-muted mb-4 flex-grow-1">
                          Full system access with complete administrative privileges and monitor all operations.
                        </p>

                        <ul class="list-unstyled text-start mb-4 features-list">
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">Sales Report</small>
                          </li>
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">Stock Level Monitoring</small>
                          </li>
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">Order Management</small>
                          </li>
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">User Management</small>
                          </li>
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">System Setting</small>
                          </li>
                        </ul>

                        <div class="mt-auto">
                          <div class="btn btn-primary btn-lg rounded-pill px-4 fw-semibold">
                            <i class="fas fa-sign-in-alt me-2"></i>
                            Access Portal
                          </div>
                        </div>

                        <div class="hover-overlay"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div 
                    class="account-card h-100"
                    @click="navigateToAdmin"
                    @mouseenter="playHoverSound"
                  >
                    <div class="card border-0 shadow-lg h-100 account-card-inner">
                      <div class="card-body p-5 text-center d-flex flex-column position-relative">
                        <div class="card-pattern"></div>
                        
                        <div class="account-icon-wrapper mb-4">
                          <div class="account-icon bg-success-gradient">
                            <img 
                              v-if="adminImageLoaded"
                              :src="adminImage" 
                              alt="Admin Icon" 
                              class="account-image"
                              @error="adminImageLoaded = false"
                              @load="adminImageLoaded = true"
                            >
                            <i 
                              v-else
                              class="fas fa-user-tie fa-3x text-white"
                            ></i>
                          </div>
                          <div class="icon-glow"></div>
                        </div>

                        <h3 class="card-title fw-bold text-dark mb-3">Administrator</h3>
                        <p class="card-text text-muted mb-4 flex-grow-1">
                          Standard administrative access with limited capabilities and operational control.
                        </p>

                        <ul class="list-unstyled text-start mb-4 features-list">
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">Stock In</small>
                          </li>
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">Stock Out</small>
                          </li>
                          <li class="feature-item">
                            <i class="fas fa-check-circle text-success me-2"></i>
                            <small class="text-muted">Barcode Generation & Scanning</small>
                          </li>
                        </ul>

                        <div class="mt-auto">
                          <div class="btn btn-success btn-lg rounded-pill px-4 fw-semibold">
                            <i class="fas fa-sign-in-alt me-2"></i>
                            Access Portal
                          </div>
                        </div>

                        <div class="hover-overlay"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-5">
            <div class="footer-content">
              <p class="text-white-50 mb-0">
                <i class="fas fa-shield-alt me-2"></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isNavigating" class="loading-overlay">
      <div class="loading-content text-center">
        <div class="spinner-border text-light mb-3" style="width: 3rem; height: 3rem;"></div>
        <h4 class="text-white">Redirecting...</h4>
        <p class="text-white-75">Please wait while we prepare your session</p>
      </div>
    </div>
  </div>
</template>
<!--End of Back-bone-->

<!--Design Section-->
<style scoped>
.account-selection-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;
  display: flex; /* Added for vertical centering */
  align-items: center; /* Added for vertical centering */
  justify-content: center; /* Added for horizontal centering */
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/background.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.1;
  z-index: 1;
}

/* Floating background shapes */
.floating-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.bg-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  animation: floatBackground 20s ease-in-out infinite;
}

.bg-shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.bg-shape-2 {
  width: 150px;
  height: 150px;
  top: 70%;
  right: 10%;
  animation-delay: 5s;
}

.bg-shape-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 20%;
  animation-delay: 10s;
}

.bg-shape-4 {
  width: 250px;
  height: 250px;
  bottom: 10%;
  left: 15%;
  animation-delay: 15s;
}

@keyframes floatBackground {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
  }
  75% {
    transform: translateY(-20px) rotate(270deg);
  }
}

/* Brand styling */
.logo-circle {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.brand-title {
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.text-white-75 {
  color: rgba(255, 255, 255, 0.75) !important;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important;
}

.text-white-25 {
  color: rgba(255, 255, 255, 0.25) !important;
}

/* Account cards */
.account-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 2;
  perspective: 1000px; /* For 3D effect on hover */
}

.account-card:hover {
  transform: translateY(-10px) scale(1.02);
}

.account-card-inner {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 1rem; /* More rounded corners */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Softer shadow */
}

.account-card:hover .account-card-inner {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
  transform: rotateY(3deg); /* Slight 3D rotation on hover */
}

/* Card pattern */
.card-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 120px; /* Slightly larger */
  height: 120px; /* Slightly larger */
  background: linear-gradient(45deg, transparent 30%, rgba(0, 0, 0, 0.03) 50%, transparent 70%); /* Stronger effect */
  opacity: 0.6;
  border-bottom-left-radius: 100%; /* Curved edge */
  transition: all 0.3s ease;
}

.account-card:hover .card-pattern {
    transform: scale(1.1) rotate(5deg);
    opacity: 0.8;
}

/* Account icons */
.account-icon-wrapper {
  position: relative;
  display: inline-flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  width: 100%; /* Ensure it takes full width for centering */
}

.account-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* Shadow for icon */
}

.account-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-success-gradient {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  z-index: 1;
  transition: all 0.3s ease;
}

.account-card:hover .icon-glow {
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
}

.account-card:hover .account-icon {
  transform: scale(1.1) rotate(5deg); /* Slight rotation on icon */
}

/* Feature list styling */
.features-list {
  display: flex;
  flex-wrap: wrap; /* This is key for wrapping features */
  justify-content: center; /* Center items when they wrap */
  gap: 0.5rem; /* Space between wrapped items */
  padding: 0; /* Remove default list padding */
}

.feature-item {
  display: inline-flex; /* Allows for icon and text on one line */
  align-items: center;
  background-color: #f0f2f5; /* Light background for each feature */
  border-radius: 0.5rem; /* Rounded corners for feature tags */
  padding: 0.4rem 0.8rem;
  margin: 0.2rem; /* Small margin for spacing */
  transition: all 0.2s ease;
}

.feature-item:hover {
  background-color: #e0e2e5; /* Slightly darker on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

.feature-item .text-muted {
  font-weight: 500; /* Slightly bolder text for features */
  color: #555 !important;
}

/* Hover overlay */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 1rem; /* Match card border-radius */
}

.account-card:hover .hover-overlay {
  opacity: 1;
}

/* Buttons */
.btn {
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Softer button shadow */
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.account-card:hover .btn::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.loading-content {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .brand-title {
    font-size: 2.5rem;
  }
  
  .account-card-inner .card-body {
    padding: 2rem !important;
  }
  
  .account-icon {
    width: 80px;
    height: 80px;
  }
  
  .account-image {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 576px) {
  .logo-circle {
    width: 80px;
    height: 80px;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .account-card-inner .card-body {
    padding: 1.5rem !important;
  }
  
  .features-list {
    justify-content: flex-start; /* Align left on smaller screens */
  }

  .feature-item {
    font-size: 0.75rem; /* Smaller font for features on mobile */
    padding: 0.3rem 0.6rem;
  }
}

/* Animation delays for staggered effect */
.col-md-6:nth-child(1) .account-card {
  animation: slideInLeft 0.8s ease 0.2s both;
}

.col-md-6:nth-child(2) .account-card {
  animation: slideInRight 0.8s ease 0.4s both;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
<!--End of Design-->

<!--Logic Section-->
<script setup>
import { ref } from 'vue'

// Define emits for parent communication
const emit = defineEmits(['navigate-to-super-admin', 'navigate-to-admin'])

// Image loading states
const superAdminImageLoaded = ref(true)
const adminImageLoaded = ref(true)
const isNavigating = ref(false)

// Image paths
const superAdminImage = '/images/superadmin.png'
const adminImage = '/images/admin.png'

// Navigation functions
const navigateToSuperAdmin = async () => {
  isNavigating.value = true
  
  // Add a small delay for better UX
  setTimeout(() => {
    console.log('Navigating to Super Admin signup...')
    emit('navigate-to-super-admin')
    isNavigating.value = false
  }, 1000)
}

const navigateToAdmin = async () => {
  isNavigating.value = true
  
  // Add a small delay for better UX
  setTimeout(() => {
    console.log('Navigating to Admin signup...')
    emit('navigate-to-admin')
    isNavigating.value = false
  }, 1000)
}

const playHoverSound = () => {
  // Optional: Add hover sound effect
  console.log('Card hovered')
}

</script>
<!--End of Logic-->