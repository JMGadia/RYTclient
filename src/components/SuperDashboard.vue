<template>
  <div class="d-flex" id="wrapper">
    <div class="bg-dark border-right" id="sidebar-wrapper">
      <div class="sidebar-heading text-white text-center py-4 fs-4 fw-bold">
        RYT-Tyre Super Admin
      </div>
      <div class="list-group list-group-flush">

        <a
          href="#"
          class="list-group-item list-group-item-action bg-dark text-white py-3 px-4 d-lg-none d-none"
          id="sidebar-notifications"
        >
          <i class="fas fa-bell me-2"></i>Notifications
        </a>
        <a
          href="#"
          class="list-group-item list-group-item-action bg-dark text-white py-3 px-4 d-lg-none d-none"
          id="sidebar-profile"
        >
          <i class="fas fa-user-circle me-2"></i>Super Admin
        </a>

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

    <div id="page-content-wrapper">
      <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <button class="btn btn-primary ms-3" id="menu-toggle" @click="toggleSidebar">
          <img src="/images/carWheel.svg" alt="Car Wheel Icon" width="36" height="36" />
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
            <li class="nav-item active d-lg-block d-none d-sm-block" id="notifications-top-nav">
              <a class="nav-link" href="#">
                <i class="fas fa-bell me-1"></i>
                <span class="d-sm-inline">Notifications</span>
              </a>
            </li>

            <li class="nav-item dropdown d-lg-block d-none d-sm-block" id="super-admin-top-nav">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="d-sm-inline">Super Admin</span>
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
            <h2 class="h4">Tire Stock Monitoring</h2>
            <p>Here you can view and manage current stock levels, low stock alerts, and details for different tire types. 📊</p>

            <div class="card mt-4">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Current Tire Stock</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Tire Type</th>
                        <th>Size</th>
                        <th>Brand</th>
                        <th>Current Stock</th>
                        <th>Min. Stock Level</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tire in tires" :key="tire.id">
                        <td>{{ tire.type }}</td>
                        <td>{{ tire.size }}</td>
                        <td>{{ tire.brand }}</td>
                        <td>{{ tire.stock }}</td>
                        <td>{{ tire.minStock }}</td>
                        <td>
                          <span :class="['badge', tire.stock <= tire.minStock ? 'bg-danger' : 'bg-success']">
                            {{ tire.stock <= tire.minStock ? 'Low Stock' : 'In Stock' }}
                          </span>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-info me-2 text-white">
                            <i class="fas fa-plus"></i> Add
                          </button>
                          <button class="btn btn-sm btn-warning text-white">
                            <i class="fas fa-minus"></i> Remove
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="activeFeature === 'orders'">
            <h2 class="h4">Order Management</h2>
            <p>Manage customer orders, track their status, and process shipments.</p>
          </div>

          <div v-else-if="activeFeature === 'users'">
            <h2 class="h4">User Management</h2>
            <p>View, add, edit, and delete user accounts (admins, customers, etc.).</p>

            <div class="card mt-4">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">User Accounts</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                          <span :class="['badge', user.role === 'Admin' ? 'bg-danger' : 'bg-success']">
                            {{ user.role }}
                          </span>
                        </td>
                        <td>
                          <span :class="['badge', user.status === 'Active' ? 'bg-success' : 'bg-secondary']">
                            {{ user.status }}
                          </span>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-info me-2 text-white">
                            <i class="fas fa-edit"></i> Edit
                          </button>
                          <button class="btn btn-sm btn-danger">
                            <i class="fas fa-trash-alt"></i> Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div> <div v-else-if="activeFeature === 'settings'">
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
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
}

/* Hide overlay by default on larger screens */
@media (min-width: 768px) {
    .sidebar-overlay {
      display: none;
    }
}

/* **NEW STYLES to manage visibility based on screen size** */
@media (max-width: 429.98px) {
  /* Hide the top navbar links */
  #notifications-top-nav, #super-admin-top-nav {
    display: none !important;
  }

  /* Show the sidebar links */
  #sidebar-notifications, #sidebar-profile {
    display: block !important;
  }
}

@media (min-width: 430px) {
  /* Show the top navbar links */
  #notifications-top-nav, #super-admin-top-nav {
    display: block !important;
  }

  /* Hide the sidebar links */
  #sidebar-notifications, #sidebar-profile {
    display: none !important;
  }
}
/* **END NEW STYLES** */


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
  z-index: 1000;
  position: fixed;
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
@media (max-width: 767.98px) {
    #sidebar-wrapper {
      margin-left: -15rem;
      transform: translateX(0);
    }

    #wrapper.toggled #sidebar-wrapper {
      margin-left: 0;
    }

    #page-content-wrapper {
      margin-left: 0;
    }

    #wrapper.toggled #page-content-wrapper {
      margin-left: 0;
    }
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    margin-left: 0;
    position: sticky;
  }

  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }

  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem;
  }

  #wrapper.toggled #page-content-wrapper {
    margin-left: 0;
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

const users = ref([
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob.j@example.com', role: 'User', status: 'Inactive' },
]);

// New data for tires stock monitoring
const tires = ref([
  { id: 1, type: 'All-Season', size: '205/55R16', brand: 'Michelin', stock: 150, minStock: 50 },
  { id: 2, type: 'Performance', size: '225/45R17', brand: 'Goodyear', stock: 30, minStock: 40 },
  { id: 3, type: 'Off-Road', size: '265/70R17', brand: 'BFGoodrich', stock: 80, minStock: 20 },
  { id: 4, type: 'Winter', size: '195/65R15', brand: 'Bridgestone', stock: 10, minStock: 20 },
  { id: 5, type: 'Touring', size: '215/60R16', brand: 'Pirelli', stock: 120, minStock: 30 },
]);

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