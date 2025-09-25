<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Corrected handler for navigating to Super Admin signup
const handleNavigateToSuperAdmin = () => {
  router.push({ name: 'super signup' });
};

const handleNavigateToSuperLogin = () => {
  router.push({ name: 'super login' });
};

const handleNavigateToAdmin = () => {
  router.push({ name: 'admin signup' });
};

const handleGoBack = () => {
  router.push({ name: 'account selection' });
};

const handleLoginSuccess = (userData) => {
  console.log('Login successful:', userData);
  if (userData.role === 'admin') {
    router.push({ name: 'admin' });
  } else if (userData.role === 'super-admin') {
    router.push({ name: 'super admin' });
  }
};

const handleAdminDashboardNavigation = (page) => {
  if (page === 'stock-out') {
    router.push({ name: 'admin stock-out' });
  } else {
    router.push({ name: 'admin dashboard' });
  }
};

const handleStockOutGoBack = () => {
  router.push({ name: 'admin dashboard' });
};

const handleSuperAdminLogout = () => {
  router.push({ name: 'account selection' });
};

const handleAdminLogout = () => {
  router.push({ name: 'account selection' });
};
</script>

<template>
  <speed-insights />

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