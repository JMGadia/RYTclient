import { createRouter, createWebHistory } from "vue-router";
import AccountSelection from "../views/AccountSelection.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "account selection",
            component: AccountSelection,
        },

        {
            path: '/super-login',
            name: 'super login',
            component: () => import('../views/SuperlogIn.vue')
        },

        {
            path: '/super-signup',
            name: 'super signup',
            component: () => import('../views/SuperSignUp.vue')
        },

        {
            path: '/super-admin',
            name: 'super admin',
            component: () => import('../views/SuperAdmin.vue')
        },

        {
            path: '/admin-login',
            name: 'admin login',
            component: () => import('../views/AdminlogIn.vue')
        },

        {
            path: '/admin-signup',
            name: 'admin signup',
            component: () => import('../views/AdminSignUp.vue')
        },

        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/Admin.vue')
        }
        
    ],
});

export default router;