import { createRouter, createWebHistory } from "vue-router";
import SuperSignUp from '../components/SignUp.vue';

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
            name: 'forgot password',
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

export default router;