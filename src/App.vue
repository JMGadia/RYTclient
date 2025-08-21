<script setup>
import { ref } from 'vue'
import AccountSelection from './components/AccountSelection.vue'
import SuperAdmin from './components/SuperlogIn.vue'
import Admin from './components/AdminlogIn.vue'
import SuperDash_main from './components/SuperAdmin.vue'
import AdminDashboard from './components/Admin.vue'

const currentPage = ref('account-selection')

const handleNavigateToSuperAdmin = () => {
  currentPage.value = 'super-admin'
}

const handleNavigateToAdmin = () => {
  currentPage.value = 'admin'
}

const handleGoBack = () => {
  currentPage.value = 'account-selection'
}

const handleLoginSuccess = (userData) => {
  console.log('Login successful:', userData)
  if (userData.role === 'admin') {
    currentPage.value = 'admin-dashboard' // Redirect to AdminDash_StockIn (default admin view)
  } else if (userData.role === 'super-admin') {
    currentPage.value = 'super-dashboard' // Redirect to Super Admin Dashboard
  }
}

// Handles navigation events emitted by AdminDash_StockIn and AdminDash_StockOut
const handleAdminDashboardNavigation = (page) => {
  currentPage.value = `admin-${page}` // Sets currentPage to 'admin-stock-in' or 'admin-stock-out'
}

// Handles go-back event from AdminDash_StockOut (though sidebar navigation is primary)
const handleStockOutGoBack = () => {
  currentPage.value = 'admin-dashboard'; // Always go back to Stock In dashboard
}

// Handles logout from SuperDash_main
const handleSuperAdminLogout = () => {
  currentPage.value = 'account-selection'; // Go back to account selection on logout
}
</script>

<template>
  <!-- Account Selection Page -->
  <AccountSelection 
    v-if="currentPage === 'account-selection'"
    @navigate-to-super-admin="handleNavigateToSuperAdmin"
    @navigate-to-admin="handleNavigateToAdmin"
  />
  
  <!-- Super Admin Login Page -->
  <SuperAdmin 
    v-else-if="currentPage === 'super-admin'"
    @go-back="handleGoBack"
    @login-success="handleLoginSuccess"
  />

  <!-- Admin Login Page -->
  <Admin 
    v-else-if="currentPage === 'admin'"
    @go-back="handleGoBack"
    @login-success="handleLoginSuccess"
  />

  <!-- Admin Dashboard (Stock In) Page -->
  <!-- Renders when currentPage is 'admin-stock-in' -->
  <AdminDashboard
    v-else-if="currentPage === 'admin-dashboard'"
    @navigate-to="handleAdminDashboardNavigation"
  />

  <!-- Admin Dashboard (Stock Out/Purchase Orders) Page -->
  <!-- Renders when currentPage is 'admin-stock-out' -->
  <AdminDash_StockOut
    v-else-if="currentPage === 'admin-stock-out'"
    @navigate-to="handleAdminDashboardNavigation"
    @go-back="handleStockOutGoBack"
  />

  <!-- Super Admin Dashboard Page -->
  <SuperDash_main
    v-else-if="currentPage === 'super-dashboard'"
    @logout="handleSuperAdminLogout"
  />
</template>