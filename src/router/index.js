import { createRouter, createWebHistory } from "vue-router";
import SuperSignUp from '../components/SignUp.vue';
import { supabase } from '../server/supabase.js';

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
            path: 'Update-Password',
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

// --- 👇 THIS IS THE NAVIGATION GUARD ---
router.beforeEach(async (to, from, next) => {
  // Get the current user session
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Define which pages require a user to be logged in
  const authRequiredRoutes = [
    'super admin', 'admin', 'ordering system', 'profile',
    'order tracking', 'cart', 'BookOrderAddress', 'OrderHistory', 'ImortProduct',
    'update password', 'payment system', 'success', 'forgot password'
  ]; //

  // Rule 1: If the user is trying to access a protected page BUT is NOT logged in...
  if (authRequiredRoutes.includes(to.name) && !user) {
    // ...redirect them to the login page.
    next({ name: 'login' }); //
  }
  // Rule 2: If the user is already logged in BUT tries to access the signup or login page...
  else if (['signup', 'login'].includes(to.name) && user) {
    // ...redirect them to their main dashboard instead.
    next({ name: 'ordering system' }); //
  }
  // Rule 3: Otherwise, let them go to the page they requested.
  else {
    next();
  }
});
// --- 👆 END OF NAVIGATION GUARD ---

export default router;