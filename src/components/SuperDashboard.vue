<template>
  <div class="d-flex" id="wrapper">
    <!-- Sidebar -->
    <div class="bg-dark border-right" id="sidebar-wrapper">
      <div class="sidebar-heading text-white text-center py-4 fs-4 fw-bold">
        RYT-Tyre Super Admin
      </div>
      <div class="list-group list-group-flush">
        <a
          href="#"
          class="list-group-item list-group-item-action bg-dark text-white py-3 px-4"
          :class="{ 'active-link': activeFeature === 'dashboard' }"
          @click.prevent="setActiveFeature('dashboard')"
        >
          <i class="fas fa-tachometer-alt me-2"></i>Dashboard
        </a>
        <a
          href="#"
          class="list-group-item list-group-item-action bg-dark text-white py-3 px-4"
          :class="{ 'active-link': activeFeature === 'sales-report' }"
          @click.prevent="setActiveFeature('sales-report')"
        >
          <i class="fas fa-chart-line me-2"></i>Sales Report
        </a>
        <a
          href="#"
          class="list-group-item list-group-item-action bg-dark text-white py-3 px-4"
          :class="{ 'active-link': activeFeature === 'stock-monitoring' }"
          @click.prevent="setActiveFeature('stock-monitoring')"
        >
          <i class="fas fa-boxes me-2"></i>Stock Monitoring
        </a>
        <a
          href="#"
          class="list-group-item list-group-item-action bg-dark text-white py-3 px-4"
          :class="{ 'active-link': activeFeature === 'orders' }"
          @click.prevent="setActiveFeature('orders')"
        >
          <i class="fas fa-shopping-cart me-2"></i>Purchased Orders
        </a>
        <a
          href="#"
          class="list-group-item list-group-item-action bg-dark text-white py-3 px-4"
          :class="{ 'active-link': activeFeature === 'users' }"
          @click.prevent="setActiveFeature('users')"
        >
          <i class="fas fa-users me-2"></i>User Management
        </a>
      </div>
    </div>

    <div v-if="sidebarToggled && isMobile" class="sidebar-overlay" @click="toggleSidebar"></div>

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <button class="btn btn-primary ms-3" id="menu-toggle" @click="toggleSidebar">
          <img src="/images/carWheel.svg" alt="Car Wheel Icon" width="36" height="36" />
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <a class="nav-link" href="#"><i class="fas fa-bell me-1"></i> Notifications</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Super Admin
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#" @click.prevent="handleLogout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div class="container-fluid p-4">
        <h1 class="mt-4 mb-4 text-primary">{{ pageTitle }}</h1>
        <div class="dashboard-content">
          <div v-if="activeFeature === 'dashboard'">
            <h2 class="h4">Dashboard Overview</h2>
            <p>Welcome to your Super Admin Dashboard!</p>
          </div>
          <div v-else-if="activeFeature === 'sales-report'">
            <h2 class="h4">Sales Report Overview</h2>
            <p>This section will display charts and data related to sales performance.</p>
          </div>
          <div v-else-if="activeFeature === 'stock-monitoring'">
            <h2 class="h4">Stock Monitoring</h2>
            <p>Here you can view and manage current stock levels, low stock alerts, etc.</p>
          </div>
          <div v-else-if="activeFeature === 'orders'">
            <h2 class="h4">Order Management</h2>
            <p>Manage customer orders, track their status, and process shipments.</p>
          </div>
          <div v-else-if="activeFeature === 'users'">
            <h2 class="h4">User Management</h2>
            <p>View, add, edit, and delete user accounts (admins, customers, etc.).</p>
          </div>
          <div v-else-if="activeFeature === 'settings'">
            <h2 class="h4">System Settings</h2>
            <p>Configure application settings, permissions, and other administrative options.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Mobile Sidebar Overlay Styles (New Addition) */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999; /* Lower than sidebar but higher than main content */
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
}

/* Hide overlay by default on larger screens */
@media (min-width: 768px) {
    .sidebar-overlay {
        display: none;
    }
}


/* Icon Rotation for Car Wheel Effect - TARGETING THE IMG TAG NOW */
#menu-toggle img {
    width: 36px;
    height: 36px;
    transform: rotate(0deg);
    transition: transform 0.6s ease-in-out;
    display: block;
    object-fit: contain;
}

/* Make the button transparent */
#menu-toggle {
    background-color: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
    padding: 0.375rem 0.75rem;
}

/* Ensure hover, active, and focus states remain transparent */
#menu-toggle:hover,
#menu-toggle:active,
#menu-toggle:focus {
    background-color: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
}

/* When the sidebar is toggled open, rotate the wheel */
#wrapper.toggled #menu-toggle img {
    transform: rotate(-360deg);
}


/* Original CSS provided by you - no changes here unless specified */
#wrapper {
  overflow-x: hidden;
  height: 100vh;
  background-color: #f8f9fa;
}

#sidebar-wrapper {
  min-height: 100vh;
  margin-left: -15rem;
  transition: margin 0.35s ease-in-out;
  width: 15rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Ensure sidebar is above the overlay */
  position: fixed; /* Added to make it slide from off-screen */
}

#sidebar-wrapper .sidebar-heading {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
  background-color: #343a40;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#sidebar-wrapper .list-group {
  width: 15rem;
}

#page-content-wrapper {
  min-width: 100vw;
  flex-grow: 1;
  transition: margin 0.35s ease-in-out;
}

/* Mobile-specific adjustments for sidebar */
@media (max-width: 767.98px) { /* Use Bootstrap's sm breakpoint or adjust as needed */
    #sidebar-wrapper {
        margin-left: -15rem; /* Hidden by default on mobile */
        transform: translateX(0); /* Reset transform for mobile transition */
    }

    #wrapper.toggled #sidebar-wrapper {
        margin-left: 0; /* Show sidebar on mobile when toggled */
    }

    #page-content-wrapper {
        margin-left: 0; /* Content always starts at 0 on mobile */
    }

    /* Important: When sidebar is open on mobile, ensure content doesn't shift */
    #wrapper.toggled #page-content-wrapper {
        margin-left: 0;
    }
}


@media (min-width: 768px) { /* Desktop behavior */
  #sidebar-wrapper {
    margin-left: 0; /* Visible by default on desktop */
    position: sticky; /* Keep it sticky on desktop */
  }

  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }

  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem; /* Hide sidebar on desktop when toggled */
  }

  #wrapper.toggled #page-content-wrapper {
    margin-left: 0; /* Content takes full width when sidebar hidden on desktop */
  }
}

.list-group-item-action {
  color: #dee2e6;
  border: none;
  transition: background-color 0.3s ease, color 0.3s ease, padding-left 0.3s ease;
  position: relative;
  overflow: hidden;
}

.list-group-item-action:hover {
  background-color: #495057;
  color: #fff;
  padding-left: 1.5rem;
}

.list-group-item-action.active-link {
  background-color: #0d6efd;
  color: #fff;
  font-weight: bold;
  padding-left: 1.5rem;
  position: relative;
}

.list-group-item-action.active-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 5px;
  background-color: #007bff;
  transition: width 0.3s ease-out;
}

.list-group-item-action:not(.active-link)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: transparent;
  transition: width 0.3s ease-out;
}


.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.dashboard-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.fas {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['logout']);

const activeFeature = ref('dashboard');
const sidebarToggled = ref(false);
const isMobile = ref(false);

const pageTitle = computed(() => {
  switch (activeFeature.value) {
    case 'dashboard':
      return 'Dashboard';
    case 'sales-report':
      return 'Sales Report';
    case 'stock-monitoring':
      return 'Stock Monitoring';
    case 'orders':
      return 'Purchased Orders';
    case 'users':
      return 'User Management';
    case 'settings':
      return 'System Settings';
    default:
      return 'Super Admin Dashboard';
  }
});

const setActiveFeature = (feature) => {
  activeFeature.value = feature;
};

const toggleSidebar = () => {
  sidebarToggled.value = !sidebarToggled.value;
  document.getElementById('wrapper').classList.toggle('toggled');

  if (isMobile.value && sidebarToggled.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;

  if (!isMobile.value) {
    sidebarToggled.value = false;
    document.getElementById('wrapper').classList.remove('toggled');
    document.body.style.overflow = '';
  }
};

const handleLogout = () => {
  console.log('Super Admin Logout');
  emit('logout');
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>