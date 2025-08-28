<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { useRouter } from 'vue-router'; // Import useRouter hook

const router = useRouter(); // Initialize the router

// All currentPage logic is removed as the router handles view state

const handleNavigateToSuperAdmin = () => {
  router.push({ name: 'super signup' }); // Navigate to the Super Admin signup route instead of login
};

// New handler to navigate back to Super Admin Login
const handleNavigateToSuperLogin = () => {
  router.push({ name: 'super login' }); // Navigate to the Super Admin login route
};

const handleNavigateToAdmin = () => {
  router.push({ name: 'admin signup' }); // Navigate to the Admin login route
};

const handleGoBack = () => {
  router.push({ name: 'account selection' }); // Navigate back to account selection
};

const handleLoginSuccess = (userData) => {
  console.log('Login successful:', userData);
  if (userData.role === 'admin') {
    router.push({ name: 'admin' }); // Redirect to Admin Dashboard
  } else if (userData.role === 'super-admin') {
    router.push({ name: 'super admin' }); // Redirect to Super Admin Dashboard
  }
};

// Handles navigation events from admin dashboards (e.g., to stock-out)
const handleAdminDashboardNavigation = (page) => {
  // Assuming 'page' will directly map to a route name suffix or be 'stock-out'
  if (page === 'stock-out') {
    router.push({ name: 'admin stock-out' });
  } else {
    // Default to admin dashboard or another specific route if 'page' indicates it
    router.push({ name: 'admin dashboard' });
  }
};

const handleStockOutGoBack = () => {
  router.push({ name: 'admin dashboard' }); // Always go back to Admin Dashboard
};

const handleSuperAdminLogout = () => {
  router.push({ name: 'account selection' }); // Go back to account selection on logout
};

const handleAdminLogout = () => {
  router.push({ name: 'account selection' }); // Go back to account selection on logout
};
</script>

<template>
  <speed-insights />

  <!-- The RouterView component will render the component associated with the current route -->
  <!-- All events that were previously passed to specific components now need to be handled
        by the component currently rendered by RouterView. This is a common pattern:
        the parent (App.vue) defines the handlers, and the child (rendered by RouterView) emits them. -->
  <router-view
    @navigate-to-super-admin="handleNavigateToSuperAdmin"
    @navigate-to-super-login="handleNavigateToSuperLogin" 
    @navigate-to-admin="handleNavigateToAdmin"
    @go-back="handleGoBack"
    @login-success="handleLoginSuccess"
    @navigate-to="handleAdminDashboardNavigation"
    @logout="handleAdminLogout"
    @stock-out-go-back="handleStockOutGoBack"
    @super-admin-logout="handleSuperAdminLogout"
  />
</template>