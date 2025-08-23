<template>
  <div class="d-flex" id="wrapper" :class="{ toggled: sidebarToggled }">
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
          data-bs-toggle="collapse"
          data-bs-target="#sidebarProfileCollapse"
          aria-expanded="false"
          aria-controls="sidebarProfileCollapse"
        >
          <i class="fas fa-user-circle me-2"></i>Super Admin
        </a>
        <div class="collapse" id="sidebarProfileCollapse">
          <a
            href="#"
            class="list-group-item list-group-item-action bg-dark text-white py-2 ps-5"
          >
            Profile
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action bg-dark text-white py-2 ps-5"
          >
            Settings
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action bg-dark text-white py-2 ps-5"
            data-bs-toggle="modal"
            data-bs-target="#logoutConfirmationModal"
            >Logout</a
          >
        </div>
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
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#logoutConfirmationModal">Logout</a></li>
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
            <p>Welcome to your Super Admin Dashboard! Here's a quick look at your key metrics.</p>

            <div class="row g-4 mb-4">
              <div class="col-lg-3 col-md-6">
                <div class="card text-white bg-primary h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Total Sales (Last 30 Days)</h5>
                        <h3 class="card-text display-6 fw-bolder">₱{{ totalSalesLast30Days.toLocaleString() }}</h3>
                      </div>
                      <i class="fas fa-chart-bar fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="card text-white bg-success h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Pending Orders</h5>
                        <h3 class="card-text display-6 fw-bolder">{{ pendingOrdersCount }}</h3>
                      </div>
                      <i class="fas fa-clock fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="card text-white bg-warning h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Low Stock Items</h5>
                        <h3 class="card-text display-6 fw-bolder">{{ lowStockCount }}</h3>
                      </div>
                      <i class="fas fa-exclamation-triangle fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="card text-white bg-info h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">New Users (This Month)</h5>
                        <h3 class="card-text display-6 fw-bolder">{{ newUsersCount }}</h3>
                      </div>
                      <i class="fas fa-user-plus fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-lg-12">
                <div class="card shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="mb-0 text-primary fw-bold">Recent Activities</h5>
                  </div>
                  <div class="card-body p-0">
                    <div class="list-group list-group-flush">
                      <a href="#" class="list-group-item list-group-item-action">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        Order #101 was completed by John Doe.
                        <span class="float-end text-muted small">Just now</span>
                      </a>
                      <a href="#" class="list-group-item list-group-item-action">
                        <i class="fas fa-box-open text-info me-2"></i>
                        Stock for "Performance" tires is now below minimum level.
                        <span class="float-end text-muted small">5 mins ago</span>
                      </a>
                      <a href="#" class="list-group-item list-group-item-action">
                        <i class="fas fa-user-plus text-primary me-2"></i>
                        A new user, Alice Williams, registered.
                        <span class="float-end text-muted small">1 hour ago</span>
                      </a>
                      <a href="#" class="list-group-item list-group-item-action">
                        <i class="fas fa-truck text-secondary me-2"></i>
                        Order #103 was shipped.
                        <span class="float-end text-muted small">Yesterday</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          <div v-else-if="activeFeature === 'sales-report'">
            <h2 class="h4">Sales Report Overview</h2>
            <p>View key sales metrics and performance over time.</p>

            <div class="row g-4 mb-4">
              <div class="col-lg-6 col-md-6">
                <div class="card text-white bg-info h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Total Sales (Today)</h5>
                        <h3 class="card-text display-6 fw-bolder">
                          ₱{{ totalSalesToday.toLocaleString() }}
                        </h3>
                      </div>
                      <i class="fas fa-peso-sign fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="card text-white bg-dark h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Total Orders (Today)</h5>
                        <h3 class="card-text display-6 fw-bolder">
                          {{ totalOrdersToday.toLocaleString() }}
                        </h3>
                      </div>
                      <i class="fas fa-shopping-cart fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-lg-8">
                <div class="card shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="mb-0 text-primary fw-bold">Sales Trend (Last 7 Days)</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="salesTrendChart"></canvas>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="card shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="mb-0 text-primary fw-bold">Sales by Tire Type</h5>
                  </div>
                  <div class="card-body d-flex justify-content-center align-items-center">
                    <canvas id="salesByTireTypeChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="activeFeature === 'stock-monitoring'">
            <h2 class="h4">Tire Stock Monitoring</h2>
            <p>
              View and manage current stock levels, low stock alerts, and details for different tire
              types. 📊
            </p>

            <div class="row g-4 mb-4">
              <div class="col-lg-4 col-md-6">
                <div class="card bg-primary text-white h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Total Stock</h5>
                        <h3 class="card-text display-6 fw-bolder">{{ totalStock }}</h3>
                      </div>
                      <i class="fas fa-boxes fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="card bg-warning text-dark h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Low Stock Alerts</h5>
                        <h3 class="card-text display-6 fw-bolder">{{ lowStockCount }}</h3>
                      </div>
                      <i class="fas fa-exclamation-triangle fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-12">
                <div class="card bg-success text-white h-100 shadow-sm border-0">
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Tire Types</h5>
                        <h3 class="card-text display-6 fw-bolder">{{ totalTireTypes }}</h3>
                      </div>
                      <i class="fas fa-list fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mt-4 shadow-sm">
              <div
                class="card-header bg-white d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0 text-primary fw-bold">Current Tire Stock</h5>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#addStockModal"
                >
                  <i class="fas fa-plus-circle me-2"></i>Add New Stock
                </button>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th class="py-3 px-4">Tire Type</th>
                        <th class="py-3 px-4">Size</th>
                        <th class="py-3 px-4">Brand</th>
                        <th class="py-3 px-4">Current Stock</th>
                        <th class="py-3 px-4">Min. Stock Level</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tire in tires" :key="tire.id">
                        <td class="py-3 px-4">{{ tire.type }}</td>
                        <td class="py-3 px-4">{{ tire.size }}</td>
                        <td class="py-3 px-4">{{ tire.brand }}</td>
                        <td class="py-3 px-4">{{ tire.stock }}</td>
                        <td class="py-3 px-4">{{ tire.minStock }}</td>
                        <td class="py-3 px-4">
                          <span
                            :class="[
                              'badge',
                              tire.stock <= tire.minStock ? 'bg-danger' : 'bg-success',
                            ]"
                          >
                            {{ tire.stock <= tire.minStock ? 'Low Stock' : 'In Stock' }}
                          </span>
                        </td>
                        <td class="py-3 px-4 text-center">
                          <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info me-2 text-dark">
                              <i class="fas fa-plus"></i> Add
                            </button>
                            <button class="btn btn-sm btn-outline-warning text-dark">
                              <i class="fas fa-minus"></i> Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="activeFeature === 'orders'">
            <h2 class="h4">Purchased Orders Overview</h2>
            <p>Track and manage the status of all incoming customer orders. 🛒</p>

            <div class="row g-4 mb-4">
              <div class="col-lg-4 col-md-6">
                <div
                  class="card text-white bg-info h-100 shadow-sm border-0"
                  :class="{ 'card-active': selectedStatus === 'All' }"
                  @click="filterOrders('All')"
                >
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Total Orders</h5>
                        <h3 class="card-text display-6 fw-bolder">
                          {{ totalOrders }}
                        </h3>
                      </div>
                      <i class="fas fa-shopping-cart fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div
                  class="card text-white bg-warning h-100 shadow-sm border-0"
                  :class="{ 'card-active': selectedStatus === 'Pending' }"
                  @click="filterOrders('Pending')"
                >
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Pending Orders</h5>
                        <h3 class="card-text display-6 fw-bolder">
                          {{ pendingOrdersCount }}
                        </h3>
                      </div>
                      <i class="fas fa-clock fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-12">
                <div
                  class="card text-white bg-success h-100 shadow-sm border-0"
                  :class="{ 'card-active': selectedStatus === 'Completed' }"
                  @click="filterOrders('Completed')"
                >
                  <div class="card-body d-flex flex-column justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 class="card-title fw-bold">Completed Orders</h5>
                        <h3 class="card-text display-6 fw-bolder">
                          {{ completedOrdersCount }}
                        </h3>
                      </div>
                      <i class="fas fa-check-circle fa-3x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mt-4 shadow-sm">
              <div
                class="card-header bg-white d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0 text-primary fw-bold">Recent Orders</h5>
                <div class="d-flex align-items-center">
                  <input
                    type="text"
                    class="form-control form-control-sm me-2"
                    placeholder="Search orders..."
                    v-model="searchQuery"
                  />
                  <button class="btn btn-sm btn-primary">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="row g-4">
                  <div class="col-lg-4 col-md-6" v-for="order in filteredOrders" :key="order.id">
                    <div class="card h-100 shadow-sm border-2" :class="getCardBorder(order.status)">
                      <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                          <h6 class="card-subtitle text-muted fw-bold">Order ID: #{{ order.id }}</h6>
                          <span class="badge" :class="getStatusBadge(order.status)">{{ order.status }}</span>
                        </div>
                        <h5 class="card-title">{{ order.customer }}</h5>
                        <p class="card-text mb-1">
                          <i class="fas fa-calendar-alt text-muted me-2"></i>
                          <span class="fw-bold">Date:</span> {{ order.date }}
                        </p>
                        <p class="card-text">
                          <i class="fas fa-peso-sign text-muted me-2"></i>
                          <span class="fw-bold">Total:</span> ₱{{ order.amount.toLocaleString() }}
                        </p>
                      </div>
                      <div class="card-footer bg-light border-top-0 d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-primary me-2">
                          <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-danger" v-if="order.status === 'Pending'">
                          <i class="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-if="filteredOrders.length === 0" class="col-12 text-center py-4 text-muted">
                    <p>No orders found matching your criteria.</p>
                  </div>
                </div>
              </div>
            </div>
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
                          <span
                            :class="['badge', user.role === 'Admin' ? 'bg-danger' : 'bg-success']"
                          >
                            {{ user.role }}
                          </span>
                        </td>
                        <td>
                          <span
                            :class="[
                              'badge',
                              user.status === 'Active' ? 'bg-success' : 'bg-secondary',
                            ]"
                          >
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
          </div>
          <div v-else-if="activeFeature === 'settings'">
            <h2 class="h4">System Settings</h2>
            <p>Configure application settings, permissions, and other administrative options.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="logoutConfirmationModal" tabindex="-1" aria-labelledby="logoutConfirmationModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="logoutConfirmationModalLabel">Confirm Logout</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <div class="p-3">
              <i class="fas fa-sign-out-alt fa-3x text-primary mb-3"></i>
              <p class="fs-5">Are you sure you want to log out of your account?</p>
              <p class="text-muted">You will be redirected to the account selection page.</p>
            </div>
          </div>
          <div class="modal-footer justify-content-center border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmLogout">Logout</button>
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
@media (max-width: 920.98px) {
  /* Hide the top navbar links */
  #notifications-top-nav,
  #super-admin-top-nav {
    display: none !important;
  }

  /* Show the sidebar links */
  #sidebar-notifications,
  #sidebar-profile {
    display: block !important;
  }
}

@media (min-width: 913px) {
  /* Show the top navbar links */
  #notifications-top-nav,
  #super-admin-top-nav {
    display: block !important;
  }

  /* Hide the sidebar links */
  #sidebar-notifications,
  #sidebar-profile {
    display: none !important;
  }
}
/* **END NEW STYLES** */

.list-group-item-action.ps-5 {
  padding-left: 2.5rem !important; /* Adjust as needed */
  font-size: 0.9rem;
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

/* Original CSS provided by you - with corrections */
#wrapper {
  overflow-x: hidden;
  height: 100vh;
  background-color: #f8f9fa;
  display: flex; /* Add this to make it a flex container */
}

#sidebar-wrapper {
  /* Use fixed positioning to keep the sidebar in place */
  position: fixed;
  top: 0;
  bottom: 0; /* Ensures it fills the height of the viewport */
  height: 100vh; /* Fallback */
  overflow-y:auto; /* Add vertical scrolling */
  margin-left: -15rem;
  transition: margin 0.35s ease-in-out;
  width: 15rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

#sidebar-wrapper .sidebar-heading {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
  background-color: #343a40;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

#sidebar-wrapper .list-group {
  width: 15rem;
  flex-grow: 1;
  /* Make this specific part scrollable */
  overflow-y: visible;
}

#page-content-wrapper {
  min-width: 100vw;
  flex-grow: 1;
  transition: margin 0.35s ease-in-out;
  /* Add overflow-y for the main content area */
  overflow-y: auto;
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
    top: 0;
    height: 100vh; /* Re-apply for desktop */
    bottom: unset; /* Important: unset the bottom property */
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
  position: sticky;
  top: 0;
  z-index: 1020
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
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

/* NEW STYLES FOR THE CARD-BASED ORDER LIST */
.border-completed {
  border-left: 5px solid #198754; /* Green */
}
.border-shipped {
  border-left: 5px solid #0d6efd; /* Blue */
}
.border-pending {
  border-left: 5px solid #ffc107; /* Yellow */
}
.card-footer {
  background-color: #f8f9fa;
}

/* Added styles for card hover and active state */
.card-active {
  box-shadow: 0 0 10px rgba(13, 110, 253, 0.5) !important;
  border: 1px solid #0d6efd !important;
  cursor: pointer;
}

.card:not(.card-active):hover {
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  transition: all 0.2s ease-in-out;
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import Chart from 'chart.js/auto';

const emit = defineEmits(['logout']);

const activeFeature = ref('dashboard');
const sidebarToggled = ref(false);
const isMobile = ref(false);
let logoutModal = null; // A reference to the Bootstrap Modal instance

const users = ref([
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob.j@example.com', role: 'User', status: 'Inactive' },
]);

const tires = ref([
  { id: 1, type: 'All-Season', size: '205/55R16', brand: 'Michelin', stock: 150, minStock: 50 },
  { id: 2, type: 'Performance', size: '225/45R17', brand: 'Goodyear', stock: 30, minStock: 40 },
  { id: 3, type: 'Off-Road', size: '265/70R17', brand: 'BFGoodrich', stock: 80, minStock: 20 },
  { id: 4, type: 'Winter', size: '195/65R15', brand: 'Bridgestone', stock: 10, minStock: 20 },
  { id: 5, type: 'Touring', size: '215/60R16', brand: 'Pirelli', stock: 120, minStock: 30 },
  { id: 6, type: 'All-Terrain', size: '235/75R15', brand: 'Cooper', stock: 65, minStock: 25 },
]);

const salesData = ref({
  totalSalesToday: 2350,
  totalOrdersToday: 45,
  salesTrend: {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Total Sales (₱)',
        data: [1200, 1900, 1500, 2200, 2800, 2500, 3100],
        backgroundColor: '#0d6efd',
        borderColor: '#0d6efd',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  },
  salesByTireType: {
    labels: ['All-Season', 'Performance', 'Off-Road', 'Winter', 'Touring', 'All-Terrain'],
    datasets: [
      {
        label: 'Sales by Tire Type',
        data: [3000, 2500, 1800, 1000, 2200, 1500],
        backgroundColor: [
          '#0d6efd',
          '#6610f2',
          '#6f42c1',
          '#dc3545',
          '#fd7e14',
          '#ffc107',
        ],
        hoverOffset: 4,
      },
    ],
  },
});

const orders = ref([
  { id: 101, customer: 'John Doe', date: '2025-08-10', amount: 1250, status: 'Completed' },
  { id: 102, customer: 'Jane Smith', date: '2025-08-10', amount: 800, status: 'Pending' },
  { id: 103, customer: 'Bob Johnson', date: '2025-08-09', amount: 2100, status: 'Shipped' },
  { id: 104, customer: 'Alice Williams', date: '2025-08-08', amount: 550, status: 'Completed' },
  { id: 105, customer: 'Charlie Brown', date: '2025-08-08', amount: 1800, status: 'Pending' },
  { id: 106, customer: 'Eva Green', date: '2025-08-07', amount: 950, status: 'Completed' },
  { id: 107, customer: 'Frank Miller', date: '2025-08-07', amount: 450, status: 'Shipped' },
]);
const searchQuery = ref('');
const selectedStatus = ref('All');

const totalSalesLast30Days = computed(() => {
  // A simple mockup calculation for the dashboard card
  return salesData.value.salesTrend.datasets[0].data.reduce((acc, val) => acc + val, 0) * 4;
});

const newUsersCount = computed(() => {
  // A simple mockup calculation for the dashboard card
  return users.value.length;
});

const totalStock = computed(() => {
  return tires.value.reduce((sum, tire) => sum + tire.stock, 0);
});

const lowStockCount = computed(() => {
  return tires.value.filter((tire) => tire.stock <= tire.minStock).length;
});

const totalTireTypes = computed(() => {
  return tires.value.length;
});

const totalSalesToday = computed(() => salesData.value.totalSalesToday);
const totalOrdersToday = computed(() => salesData.value.totalOrdersToday);

const totalOrders = computed(() => orders.value.length);
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'Pending').length);
const completedOrdersCount = computed(() => orders.value.filter(o => o.status === 'Completed').length);

const filteredOrders = computed(() => {
  let filtered = orders.value;
  // Apply status filter first
  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(order => order.status === selectedStatus.value);
  }
  // Then apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(order =>
      order.id.toString().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  }
  return filtered;
});

let salesTrendChart = null;
let salesByTireTypeChart = null;

const createCharts = () => {
  if (salesTrendChart) salesTrendChart.destroy();
  if (salesByTireTypeChart) salesByTireTypeChart.destroy();

  const salesTrendCtx = document.getElementById('salesTrendChart');
  if (salesTrendCtx) {
    salesTrendChart = new Chart(salesTrendCtx, {
      type: 'bar',
      data: salesData.value.salesTrend,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  const salesByTireTypeCtx = document.getElementById('salesByTireTypeChart');
  if (salesByTireTypeCtx) {
    salesByTireTypeChart = new Chart(salesByTireTypeCtx, {
      type: 'pie',
      data: salesData.value.salesByTireType,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};

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
  toggleSidebar();
};

const toggleSidebar = () => {
  sidebarToggled.value = !sidebarToggled.value;
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
    document.body.style.overflow = '';
  }
};

const handleLogout = () => {
  if (logoutModal) {
    logoutModal.show();
  }
};

const confirmLogout = () => {
  if (logoutModal) {
    logoutModal.hide();
  }
  document.body.style.overflow = '';
  // Find and remove the modal backdrop element
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.remove();
  }
  emit('logout');
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-success';
    case 'Pending':
      return 'bg-warning text-dark';
    case 'Shipped':
      return 'bg-primary';
    default:
      return 'bg-secondary';
  }
};

const getCardBorder = (status) => {
  switch (status) {
    case 'Completed':
      return 'border-completed';
    case 'Shipped':
      return 'border-shipped';
    case 'Pending':
      return 'border-pending';
    default:
      return '';
  }
};

const filterOrders = (status) => {
  selectedStatus.value = status;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  nextTick(() => {
    // This is the correct way to access the Bootstrap Modal class since it's globally available
    const modalElement = document.getElementById('logoutConfirmationModal');
    if (modalElement && window.bootstrap && window.bootstrap.Modal) {
      logoutModal = new window.bootstrap.Modal(modalElement);
    }
    if (activeFeature.value === 'sales-report') {
      createCharts();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (salesTrendChart) salesTrendChart.destroy();
  if (salesByTireTypeChart) salesByTireTypeChart.destroy();
});

watch(activeFeature, (newFeature) => {
  if (newFeature === 'sales-report') {
    nextTick(() => {
      createCharts();
    });
  }
});
</script>