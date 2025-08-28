import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";

// Import Bootstrap CSS and JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Create the Vue app instance
const app = createApp(App);

// Use the router plugin with the app instance
app.use(router);

// Mount the app to the DOM
app.mount("#app");
