import { createRouter, createWebHistory } from "vue-router";
import SuperSignUp from '../components/SignUp.vue';
import { supabase } from '../server/supabase';

// This helper function checks if a user is currently logged in
const getUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
}

// 💥 DEDICATED RECOVERY ROUTING LOGIC
const handleRecoveryRedirect = async (to, next) => {
    // Check for the Supabase recovery token in the URL hash or query string
    const isRecoveryFlow = window.location.hash.includes('type=recovery') || window.location.href.includes('type=recovery');

    if (isRecoveryFlow) {
        console.log('Recovery hash detected. Forcing sign-out and redirect to Update Password.');
        
        // CRITICAL FIX: Explicitly sign out to clear the temporary session.
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.auth.signOut();
            console.log('Temporary session signed out.');
        }

        // Force redirect to the correct page to handle the token.
        if (to.name !== 'update password') {
            return next({ 
                name: 'update password',
                // Preserve the hash and query parameters for the UpdatePassword component to use
                query: to.query, 
                hash: window.location.hash 
            });
        }
    }
    // If not a recovery flow, or already on the correct page, continue through the main guard.
    return next();
};


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/",
      name: "signup",
      component: SuperSignUp,
    },

    {
      path: '/super-admin',
      name: 'super admin',
      component: () => import('../views/SuperAdmin.vue')
    },

    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin.vue')
    },

    {
      path: '/Ordering-system',
      name: 'ordering system',
      component: () => import('../views/OrderingSystem.vue')
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../components/LogIn.vue')
    },

    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../components/ForgotPassword.vue')
    },

    {
      path: '/success',
      name: 'success',
      component: () => import('../components/Success.vue')
    },

    {
      path: '/Payment-system',
      name: 'payment system',
      component: () => import('../components/PaymentSystem.vue')
    },

    {
      path: '/Update-Password',
      name: 'update password',
      component: () => import('../components/UpdatePassword.vue')
    },

    {
      path: '/profile',
      name: 'profile',
      component: () => import('../components/UserProfile.vue')
    },

    {
      path: '/order-tracking',
      name: 'order tracking',
      component: () => import('../components/OrderTracking.vue')
    },

    {
      path: '/cart',
      name: 'cart',
      component: () => import('../components/ShoppingCart.vue')
    },

    {
      path: '/address-book',
      name: 'BookOrderAddress',
      component: () => import('../components/BookOrderAddress.vue')
    },

    {
      path: '/order-history',
      name: 'OrderHistory',
      component: () => import('../components/OrderHistory.vue')
    },

    {
      path: '/import-product',
      name: 'ImportProduct',
      component: () => import('../components/ImportProduct.vue')
    }
  ],
});

// ✅ REVISED NAVIGATION GUARD
router.beforeEach(async (to, from, next) => {
    // 1. ABSOLUTE PRIORITY: Handle Recovery Redirect
    // This must be the very first check to override all other authentication logic.
    if (window.location.hash.includes('type=recovery') || window.location.href.includes('type=recovery')) {
        return handleRecoveryRedirect(to, next);
    }
    
    // 2. Resume normal authentication checks if not a recovery flow
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    // Routes part of password reset flow (no protection needed)
    const authFlowRoutes = ['forgot-password', 'success', 'update password'];

    // Protected routes
    const authRequiredRoutes = [
        'super admin', 'admin', 'ordering system', 'profile', 
        'order tracking', 'cart', 'BookOrderAddress', 'OrderHistory', 'ImportProduct',
        'payment system'
    ]; 

    // Allow password reset flow pages
    if (authFlowRoutes.includes(to.name)) {
        return next();
    }

    // Redirect logged-in users away from signup/login
    // This is the logic that was causing the unintended redirect.
    if (['signup', 'login'].includes(to.name) && user) {
        return next({ name: 'ordering system' });
    }

    // Redirect unauthenticated users trying to access protected pages
    if (authRequiredRoutes.includes(to.name) && !user) {
        return next({ name: 'login' });
    }

    return next();
});

export default router;