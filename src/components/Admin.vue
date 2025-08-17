<template>
  <div id="admin-dashboard" class="d-flex flex-column min-vh-100 bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <button class="btn btn-primary" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
        <a class="navbar-brand fw-bold ms-3" href="#">Administrator</a>

        <div v-if="!isMobile" class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#"><i class="fas fa-bell me-1"></i> Notifications</a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                ref="adminDropdownToggle"
                @click.prevent="toggleDesktopAdminMenu"
              >
                <i class="fas fa-user-circle me-1"></i> Admin User
              </a>
              <ul class="dropdown-menu dropdown-menu-end" v-show="desktopAdminDropdownOpen">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="d-flex flex-grow-1">
      <div
        :class="[
          'sidebar bg-dark text-white shadow',
          { collapsed: isCollapsed && !isMobile },
          { 'sidebar-visible': isSidebarVisible && isMobile }
        ]"
      >
        <nav class="h-100 p-3">
          <h5 class="text-center mb-4 text-uppercase" v-if="!isCollapsed || isMobile">RYT-Tyre</h5>
          <ul class="nav flex-column">
            <li class="nav-item mt-2" v-if="isMobile">
              <div
                class="nav-link text-white py-2 px-3 d-flex align-items-center justify-content-between"
                @click="toggleAdminMenu"
                style="cursor: pointer;"
              >
                <div>
                  <i class="fas fa-user-circle me-2"></i>
                  <span>Admin User</span>
                </div>
                <i :class="adminMenuOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </div>
              <ul v-if="adminMenuOpen" class="ps-4 mt-2">
                <li><a class="text-white d-block py-1" href="#">Profile</a></li>
                <li><a class="text-white d-block py-1" href="#">Settings</a></li>
                <li><a class="text-white d-block py-1" href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>

            <li class="nav-item mt-2" v-if="isMobile">
              <a class="nav-link text-white py-2 px-3 d-flex align-items-center" href="#">
                <i class="fas fa-bell me-2"></i>
                <span>Notifications</span>
              </a>
            </li>

            <li
              class="nav-item mt-3 mb-2"
              v-for="item in menuItems"
              :key="item.label"
              :class="{ active: currentView === item.label }"
            >
              <a
                class="nav-link text-white py-2 px-3 d-flex align-items-center"
                href="#"
                @click.prevent="selectView(item.label)"
              >
                <i :class="[item.icon, 'me-2']"></i>
                <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div
        v-if="isMobile && isSidebarVisible"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>

      <main class="flex-grow-1 p-4">
        <h2 class="text-primary mb-4">{{ currentView }}</h2>

        <div v-if="currentView === 'Dashboard'">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm border-0 rounded-lg">
                <div class="card-body text-center">
                  <i class="fas fa-cubes fa-3x text-info mb-3"></i>
                  <h5 class="card-title">Total Products</h5>
                  <p class="card-text fs-4 fw-bold">1200</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm border-0 rounded-lg">
                <div class="card-body text-center">
                  <i class="fas fa-arrow-alt-circle-down fa-3x text-success mb-3"></i>
                  <h5 class="card-title">Stock In Today</h5>
                  <p class="card-text fs-4 fw-bold">50</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm border-0 rounded-lg">
                <div class="card-body text-center">
                  <i class="fas fa-arrow-alt-circle-up fa-3x text-danger mb-3"></i>
                  <h5 class="card-title">Stock Out Today</h5>
                  <p class="card-text fs-4 fw-bold">30</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-lg mt-4">
            <div class="card-header bg-white text-dark fw-bold">Recent Activities</div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">逃 Product A received (Qty: 10) - 2 mins ago</li>
                <li class="list-group-item">囹 Product B shipped (Qty: 5) - 1 hour ago</li>
                <li class="list-group-item">逃 Product C received (Qty: 15) - 3 hours ago</li>
                <li class="list-group-item">囹 Product D shipped (Qty: 8) - yesterday</li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="currentView === 'Stock In'">
          <div class="card shadow-sm border-0 rounded-lg mb-4">
            <div class="card-header bg-white text-dark fw-bold">Record New Stock In</div>
            <div class="card-body">
              <form @submit.prevent="addStockIn">
                <div class="mb-3">
                  <label for="productNameIn" class="form-label">Product Name</label>
                  <input type="text" class="form-control" id="productNameIn" v-model="stockIn.productName" required>
                </div>
                <div class="mb-3">
                  <label for="quantityIn" class="form-label">Quantity</label>
                  <input type="number" class="form-control" id="quantityIn" v-model="stockIn.quantity" min="1" required>
                </div>
                <div class="mb-3">
                  <label for="supplierIn" class="form-label">Supplier</label>
                  <input type="text" class="form-control" id="supplierIn" v-model="stockIn.supplier">
                </div>
                <div class="mb-3">
                  <label for="dateIn" class="form-label">Date</label>
                  <input type="date" class="form-control" id="dateIn" v-model="stockIn.date" required>
                </div>
                <button type="submit" class="btn btn-success rounded-pill px-4">Record Stock In</button>
              </form>
            </div>
          </div>

          <div class="card shadow-sm border-0 rounded-lg">
            <div class="card-header bg-white text-dark fw-bold">Stock In History</div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Supplier</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in stockInHistory" :key="index">
                      <td>{{ item.productName }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.supplier }}</td>
                      <td>{{ item.date }}</td>
                    </tr>
                    <tr v-if="stockInHistory.length === 0">
                      <td colspan="4" class="text-center text-muted">No stock in records yet.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentView === 'Stock Out'">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0 text-dark">Pending Orders</h4>
            <button class="btn btn-primary rounded-pill" @click="showAddOrderForm = !showAddOrderForm">
              <i class="fas fa-plus me-2"></i> Add New Order
            </button>
          </div>

          <div class="card shadow-sm border-0 rounded-lg mb-4" v-if="showAddOrderForm">
            <div class="card-header bg-white text-dark fw-bold">Record New Stock Out Order</div>
            <div class="card-body">
              <form @submit.prevent="addStockOut">
                <div class="mb-3">
                  <label for="productNameOut" class="form-label">Product Name</label>
                  <input type="text" class="form-control" id="productNameOut" v-model="stockOut.productName" required>
                </div>
                <div class="mb-3">
                  <label for="quantityOut" class="form-label">Quantity</label>
                  <input type="number" class="form-control" id="quantityOut" v-model="stockOut.quantity" min="1" required>
                </div>
                <div class="mb-3">
                  <label for="customerOut" class="form-label">Customer Name</label>
                  <input type="text" class="form-control" id="customerOut" v-model="stockOut.customer" required>
                </div>
                <div class="mb-3">
                  <label for="dateOut" class="form-label">Order Date</label>
                  <input type="date" class="form-control" id="dateOut" v-model="stockOut.date" required>
                </div>
                <button type="submit" class="btn btn-danger rounded-pill px-4">Create Order</button>
              </form>
            </div>
          </div>

          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col" v-for="(order, index) in pendingOrders" :key="index">
              <div class="card h-100 shadow-sm border-0 rounded-lg">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title fw-bold text-primary">{{ order.customer }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">Order ID: #{{ 1000 + index }}</h6>
                  <ul class="list-group list-group-flush flex-grow-1 mb-3">
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span>Product:</span>
                      <span class="fw-bold">{{ order.productName }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span>Quantity:</span>
                      <span class="fw-bold">{{ order.quantity }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span>Order Date:</span>
                      <span class="fw-bold">{{ order.date }}</span>
                    </li>
                  </ul>
                  <button class="btn btn-success rounded-pill mt-auto" @click="takeOrder(index)">
                    <i class="fas fa-check-circle me-2"></i> Take Order
                  </button>
                </div>
              </div>
            </div>
            <div class="col" v-if="pendingOrders.length === 0">
              <div class="card h-100 shadow-sm border-0 rounded-lg">
                <div class="card-body text-center text-muted">
                  No pending orders at the moment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showLogoutModal" class="logout-modal-overlay">
      <div class="logout-modal-card card shadow-lg">
        <div class="card-header bg-primary text-white text-center">
          <h5 class="mb-0"><i class="fas fa-sign-out-alt me-2"></i> Confirm Logout</h5>
        </div>
        <div class="card-body text-center">
          <p class="lead">Are you sure you want to log out?</p>
          <div class="d-flex justify-content-center gap-3 mt-4">
            <button class="btn btn-secondary" @click="cancelLogout">Cancel</button>
            <button class="btn btn-primary" @click="confirmLogout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      isCollapsed: false,
      isSidebarVisible: false,
      isMobile: false,
      adminMenuOpen: false,
      desktopAdminDropdownOpen: false,
      showLogoutModal: false, // New data property for the modal
      currentView: 'Dashboard', // Default view
      showAddOrderForm: false,
      menuItems: [
        { icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
        { icon: 'fas fa-boxes', label: 'Stock In' },
        { icon: 'fas fa-truck-loading', label: 'Stock Out' }
      ],
      stockIn: {
        productName: '',
        quantity: 1,
        supplier: '',
        date: new Date().toISOString().slice(0, 10)
      },
      stockInHistory: [
        { productName: 'Tire Model A', quantity: 100, supplier: 'Supplier X', date: '2023-01-10' },
        { productName: 'Rim Type B', quantity: 50, supplier: 'Supplier Y', date: '2023-01-15' },
      ],
      stockOut: {
        productName: '',
        quantity: 1,
        customer: '',
        date: new Date().toISOString().slice(0, 10)
      },
      pendingOrders: [
        { productName: 'Tire Model A', quantity: 5, customer: 'Customer Z', date: '2023-01-12' },
        { productName: 'Rim Type B', quantity: 2, customer: 'Customer W', date: '2023-01-18' },
      ],
      stockOutHistory: [],
    };
  },
  methods: {
    toggleSidebar() {
      if (this.isMobile) {
        this.isSidebarVisible = !this.isSidebarVisible;
      } else {
        this.isCollapsed = !this.isCollapsed;
      }
    },
    closeSidebar() {
      this.isSidebarVisible = false;
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 992;
      if (!this.isMobile) {
        this.isSidebarVisible = false;
        this.adminMenuOpen = false;
        this.desktopAdminDropdownOpen = false;
      }
    },
    toggleAdminMenu() {
      this.adminMenuOpen = !this.adminMenuOpen;
    },
    toggleDesktopAdminMenu() {
      this.desktopAdminDropdownOpen = !this.desktopAdminDropdownOpen;
      if (this.desktopAdminDropdownOpen) {
        document.addEventListener('click', this.closeDesktopDropdownOnClickOutside);
      } else {
        document.removeEventListener('click', this.closeDesktopDropdownOnClickOutside);
      }
    },
    closeDesktopDropdownOnClickOutside(event) {
      const toggleEl = this.$refs.adminDropdownToggle;
      const dropdownMenu = toggleEl.nextElementSibling;
      if (toggleEl && !toggleEl.contains(event.target) && (!dropdownMenu || !dropdownMenu.contains(event.target))) {
        this.desktopAdminDropdownOpen = false;
        document.removeEventListener('click', this.closeDesktopDropdownOnClickOutside);
      }
    },
    selectView(label) {
      this.currentView = label;
      if (this.isMobile) this.closeSidebar();
    },
    addStockIn() {
      this.stockInHistory.unshift({ ...this.stockIn });
      this.stockIn = {
        productName: '',
        quantity: 1,
        supplier: '',
        date: new Date().toISOString().slice(0, 10)
      };
      alert('Stock In recorded successfully!');
    },
    addStockOut() {
      this.pendingOrders.unshift({ ...this.stockOut });
      this.stockOut = {
        productName: '',
        quantity: 1,
        customer: '',
        date: new Date().toISOString().slice(0, 10)
      };
      this.showAddOrderForm = false;
      alert('New order created successfully!');
    },
    takeOrder(index) {
      const order = this.pendingOrders.splice(index, 1)[0];
      this.stockOutHistory.unshift(order);
      alert(`Order for ${order.customer} has been taken.`);
    },
    // This method now only shows the modal
    logout() {
      this.showLogoutModal = true;
    },
    // New method to confirm and perform the logout
    confirmLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      this.showLogoutModal = false; // Hide the modal after a successful logout
      window.location.href = '/login'; // Redirect to login page
    },
    // New method to cancel the logout
    cancelLogout() {
      this.showLogoutModal = false;
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
    document.removeEventListener('click', this.closeDesktopDropdownOnClickOutside);
  }
};
</script>

<style scoped>
/* Ensure Bootstrap and Font Awesome are linked in your main HTML for these styles to work */
@import url('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

/* Custom Logout Modal Styles */
.logout-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Higher than other elements to be on top */
  transition: opacity 0.3s ease;
}

.logout-modal-card {
  max-width: 400px;
  width: 90%;
  border-radius: 1rem;
  overflow: hidden;
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  from {
    transform: scale(0.7);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.logout-modal-card .card-header {
  border-bottom: none;
  font-weight: bold;
  padding: 1.5rem;
}

.logout-modal-card .card-body {
  padding: 2rem;
}

/* Existing styles for the rest of the dashboard components */
.sidebar {
  width: 250px;
  transition: all 0.3s ease-in-out;
  overflow-x: hidden;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 1050;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
}

.sidebar.collapsed .nav-link span {
  display: none;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.nav-item.active > .nav-link {
  background-color: #0d6efd;
  font-weight: bold;
}

@media (max-width: 991.98px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1050;
    height: 100%;
  }

  .sidebar.sidebar-visible {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 250px;
  }

  .sidebar.collapsed .nav-link span {
    display: inline;
  }

  .sidebar.collapsed .nav-link {
    justify-content: flex-start;
  }
}

ul.ps-4 li a {
  text-decoration: none;
  font-size: 0.95rem;
}

.dropdown-menu {
  z-index: 2000;
  display: block;
  position: absolute;
  top: 100%;
  left: auto;
  right: 0;
  min-width: 10rem;
}

.card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid rgba(0,0,0,.125);
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
}

.btn-success, .btn-danger {
  padding: 0.75rem 1.5rem;
  font-weight: bold;
}

.form-control {
  border-radius: 0.5rem;
}

.table thead th {
  background-color: #f8f9fa;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: #f2f2f2;
}

.list-group-item {
  border: none;
  padding-left: 0;
  padding-right: 0;
}
</style>