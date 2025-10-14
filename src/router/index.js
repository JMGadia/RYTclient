import { createRouter, createWebHistory } from "vue-router";
import SuperSignUp from '../components/SignUp.vue';
import { supabase } from '../server/supabase';

// This helper function checks if a user is currently logged in
const getUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
}

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

// ✅ UPDATED NAVIGATION GUARD
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // ✅ --- FIX START ---
  // If the URL includes Supabase recovery query params, skip guards and redirect to /update-password
  if (window.location.href.includes('type=recovery')) {
    console.log('Detected Supabase recovery link — forcing redirect to /update-password');
    return next({ name: 'update password' });
  }
  // ✅ --- FIX END ---

  // Routes part of password reset flow
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
