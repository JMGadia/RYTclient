<script setup>
/* ============================================================
   App Entry Component
   Responsibilities:
   - Fetch user's cart on mount
   - Display Vercel Speed Insights
   - Render routed components
============================================================ */

import { onMounted } from 'vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { useCart } from './composables/useCart'; // Adjust path as needed

// --- CART COMPOSABLE ---
// Fetch the user's cart from the database
const { fetchCart } = useCart();

onMounted(() => {
  fetchCart();
});
</script>

<template>
  <!-- Performance Metrics -->
  <speed-insights />

  <!-- Routed Pages -->
  <router-view />
</template>
