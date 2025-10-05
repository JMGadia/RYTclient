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
            path: '/login',
            name: 'login',
            component: () => import('../components/LogIn.vue')
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
            path: '/success',
            name: 'success',
            component: () => import('../components/Success.vue')
        },

        {
            path: '/Ordering-system',
            name: 'ordering system',
            component: () => import('../views/OrderingSystem.vue')
        },

        {
            path: '/Payment-system',
            name: 'payment system',
            component: () => import('../components/PaymentSystem.vue')
        }
        
    ],
});

export default router;