<script setup>
/* ============================================================
   App Entry Component
   Responsibilities:
   - Fetch user's cart on mount
   - Handle Supabase password recovery redirect
   - Display Vercel Speed Insights
   - Render routed components
============================================================ */

import { onMounted } from 'vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';
import { useCart } from './composables/useCart';
import { supabase } from './server/supabase';
import { useRouter } from 'vue-router';

// --- SETUP ---
const { fetchCart } = useCart();
const router = useRouter();

// --- ON MOUNT ---
onMounted(() => {
  // Fetch user's cart
  fetchCart();

  // ✅ Listen for Supabase password recovery event
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event detected:', event);

    if (event === 'PASSWORD_RECOVERY') {
      console.log('Detected password recovery event — redirecting to /update-password');
      router.push({ name: 'update password' });
    }
  });
});
</script>

<template>
  <!-- Performance Metrics -->
  <speed-insights />

  <!-- Routed Pages -->
  <router-view />
</template>
