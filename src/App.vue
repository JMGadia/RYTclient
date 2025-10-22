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
import { useCart } from './composables/useCart';
import { supabase } from './server/supabase';
import { useRouter } from 'vue-router'; // Although imported, not used in the simplified onMounted

// --- SETUP ---
const { fetchCart } = useCart();
// const router = useRouter(); // No longer needed if not used in onMounted

// --- ON MOUNT ---
onMounted(() => {
  // Fetch user's cart
  fetchCart();

  // ❌ REMOVE: The logic is now handled correctly in the router/index.js beforeEach guard.
  /*
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event detected:', event);

    if (event === 'PASSWORD_RECOVERY') {
      console.log('Detected password recovery event — redirecting to /update-password');
      router.push({ name: 'update password' });
    }
  });
  */
});
</script>

<template>
  <speed-insights />

  <router-view />
</template>