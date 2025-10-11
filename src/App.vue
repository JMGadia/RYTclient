<script setup>
import { onMounted } from 'vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { useCart } from './composables/useCart'; // Adjust path if your composables folder is elsewhere

// Get the fetchCart function from our composable
const { fetchCart } = useCart();

// When the application component is mounted, fetch the cart from the database
onMounted(() => {
  fetchCart();
});
</script>

<template>
  <speed-insights />
  <router-view />
</template>