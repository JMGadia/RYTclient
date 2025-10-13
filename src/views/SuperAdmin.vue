<template>
  <div class="d-flex" id="wrapper" :class="{ toggled: sidebarToggled }">
    <div class="bg-dark border-right" id="sidebar-wrapper">
      <div class="sidebar-heading text-white text-center py-4 fs-4 fw-bold">RYT-Tyre Super Admin</div>
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
          <a href="#" class="list-group-item list-group-item-action bg-dark text-white py-2 ps-5" data-bs-toggle="modal" data-bs-target="#superAdminProfileModal">
            Profile
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
          :class="{ 'active-link': activeFeature === 'user-management' }"
          @click.prevent="setActiveFeature('user-management')"
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
                  <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#superAdminProfileModal">Profile</a></li>
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

              <div calss="col-lg-4"></div>
              <div class="row g-4 mt-4">
                  <div class="col-lg-12">
                    <div class="card shadow-sm h-100">
                      <div class="card-header bg-white">
                        <h5 class="mb-0 text-primary fw-bold">Sales Trend (Past Months)</h5>
                      </div>
                      <div class="card-body">
                        <canvas id="salesTrendMonthlyChart" style="height: 300px;"></canvas>
                      </div>
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
              types.
            </p>

            <div class="row g-4 mb-4">
              <div class="col-lg-4 col-md-6">
                <div class="card bg-primary text-white h-100 shadow-sm border-0">
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title fw-bold">Total Stock</h5>
                      <h3 class="card-text display-6 fw-bolder">{{ totalStock }}</h3>
                    </div>
                    <i class="fas fa-boxes fa-3x opacity-50"></i>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="card bg-warning text-dark h-100 shadow-sm border-0">
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title fw-bold">Low Stock Alerts</h5>
                      <h3 class="card-text display-6 fw-bolder">{{ lowStockCount }}</h3>
                    </div>
                    <i class="fas fa-exclamation-triangle fa-3x opacity-50"></i>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 col-md-12">
                <div class="card bg-success text-white h-100 shadow-sm border-0">
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title fw-bold">Product Types</h5>
                      <h3 class="card-text display-6 fw-bolder">{{ productTypes }}</h3>
                    </div>
                    <i class="fas fa-list fa-3x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="card mt-4 shadow-sm">
              <div
                class="card-header bg-white d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0 text-primary fw-bold">Current Tire Stock</h5>
                <button class="btn btn-primary" @click="navigateToAddProduct">
                  <i class="fas fa-plus-circle me-2"></i>Add New Product
                </button>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th class="py-3 px-4">Product Type</th>
                        <th class="py-3 px-4">Brand</th>
                        <th class="py-3 px-4">Size</th>
                        <th class="py-3 px-4">Current Stock</th>
                        <th class="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="stockLoading">
                        <td colspan="5" class="text-center py-4">Loading stock...</td>
                      </tr>
                      <tr v-else-if="stockItems.length === 0">
                        <td colspan="5" class="text-center py-4">No products found. Add a new product to see it here.</td>
                      </tr>
                      <tr v-for="item in stockItems" :key="item.id">
                        <td class="py-3 px-4">{{ item.product_type }}</td>
                        <td class="py-3 px-4">{{ item.brand }}</td>
                        <td class="py-3 px-4">{{ item.size }}</td>
                        <td class="py-3 px-4">{{ item.quantity }}</td>
                        <td class="py-3 px-4">
                          <span :class="['badge',
                            item.status === 'In Stock' ? 'bg-success' :
                            item.status === 'Low Stock' ? 'bg-warning text-dark' : 'bg-danger']">
                            {{ item.status }}
                          </span>
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
          <div v-else-if="activeFeature === 'user-management'">
            <h2 class="mb-4">User Management</h2>
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <h5 class="card-title">All Users</h5>
                <p class="card-subtitle mb-3 text-muted">This table updates in real-time. 'Admin' roles are always listed first.</p>
                <div class="table-responsive">
                 <table class="table table-hover table-striped">
                    <thead class="bg-light">
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Date Created</th>
                        <th>Role</th>
                        <th class="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in sortedUsers" :key="user.id">
                        <td>{{ user.username || 'N/A' }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A' }}</td>
                        <td>
                          <span class="badge" :class="user.role === 'Admin' ? 'bg-info' : 'bg-primary'">
                            {{ user.role }}
                          </span>
                        </td>
                        <td class="text-center">
                          <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id, user.username)">
                            <i class="fas fa-trash-alt me-1"></i>Delete
                          </button>
                        </td>
                      </tr>
                      <tr v-if="users.length === 0">
                        <td colspan="5" class="text-center py-4">No users found.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="logoutConfirmationModal" tabindex="-1" aria-labelledby="logoutConfirmationModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="logoutConfirmationModalLabel">Confirm Logout</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" id="logoutButton"></button>
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
            <button type="button" class="btn btn-danger" @click="confirmLogout" data-bs-dismiss="modal">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="superAdminProfileModal" tabindex="-1" aria-labelledby="superAdminProfileModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content profile-modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="superAdminProfileModalLabel">Super Admin Profile</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body profile-modal-body">

        <div class="profile-info-box">
          <small class="text-muted">Username</small>
          <div v-if="isEditingUsername" class="d-flex align-items-center">
            <input type="text" v-model="editableUsername" class="form-control form-control-sm">
          </div>
          <p v-else class="mb-0 d-flex justify-content-between align-items-center">
            <span>{{ superAdminProfile.username || '...' }}</span>
            <button class="btn btn-sm btn-link edit-btn" @click="startUsernameEdit">
              <i class="fas fa-pencil-alt"></i>
            </button>
          </p>
        </div>

        <div v-if="isEditingUsername" class="d-flex justify-content-end w-100 mt-2">
          <button class="btn btn-sm btn-secondary me-2" @click="cancelUsernameEdit">Cancel</button>
          <button class="btn btn-sm btn-primary" @click="saveUsername">Save</button>
        </div>

        <div class="profile-info-box mt-2">
          <small class="text-muted">Email</small>
          <p class="mb-0">{{ superAdminProfile.email || '...' }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
/* REVISED STYLES for Profile Modal */
.profile-modal-content {
  border-radius: 0.75rem;
}

.profile-modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

/* NEW STYLES for the info boxes from your drawing */
.profile-info-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  width: 100%;
  text-align: left;
  margin-bottom: 1rem;
}

.profile-info-box p {
  font-weight: 500;
  word-wrap: break-word;
}

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
  z-index: 1030;
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
import { supabase } from '../server/supabase';
import { useRouter, onBeforeRouteLeave } from 'vue-router'


// --- 👇 THIS IS THE EXIT GUARD ---
onBeforeRouteLeave((to, from, next) => {
  // Define the routes the admin is ALLOWED to go to without a warning.
  // We get the names from your router/index.js file.
  const allowedExitRoutes = ['login', 'signup', 'ImportProduct'];

  // If the destination is one of our allowed pages, let the navigation happen.
  if (allowedExitRoutes.includes(to.name)) {
    next(); // Proceed without the pop-up
    return;
  }

  // If it's NOT an allowed route (like the browser back button), show the warning.
  const answer = window.confirm('Are you sure you want to leave? This will end your session for security.');
  if (answer) {
    // We don't need to call confirmLogout() here because the logout button
    // navigates to an allowed route. This handles accidental leaves.
    supabase.auth.signOut(); // Log the user out
    next({ name: 'login' });  // Proceed with navigation
  } else {
    next(false); // Cancel the navigation and stay on the page
  }
});
// --- 👆 END OF EXIT GUARD ---

const router = useRouter();

const navigateToAddProduct = () => {
  router.push('/import-product');
};

const superAdminProfile = ref({ username: '', email: '' });
const isEditingUsername = ref(false);
const editableUsername = ref('');

// --- REFS FOR LIVE STOCK DATA ---
const stockItems = ref([]);
const stockLoading = ref(true);
const stockError = ref(null);

// --- UPDATED FUNCTION TO FETCH LIVE DATA ---
const fetchStockItems = async () => {
  stockLoading.value = true;
  stockError.value = null;
  try {
    // UPDATED: Query the 'products' table directly
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('brand', { ascending: true });

    if (error) throw error;
    stockItems.value = data;
  } catch (err) {
    stockError.value = 'Failed to load stock items.';
    console.error(err);
  } finally {
    stockLoading.value = false;
  }
};

const fetchSuperAdminProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching super admin profile:', error);
    } else if (profile) {
      superAdminProfile.value = profile;
    }
  }
};

// Functions for editing the username
const startUsernameEdit = () => {
  isEditingUsername.value = true;
  editableUsername.value = superAdminProfile.value.username;
};

const cancelUsernameEdit = () => {
  isEditingUsername.value = false;
};

const saveUsername = async () => {
  if (editableUsername.value.trim() === '') {
    alert('Username cannot be empty.');
    return;
  }
  if (editableUsername.value === superAdminProfile.value.username) {
    isEditingUsername.value = false;
    return;
  }
  try {
    const { error } = await supabase.rpc('update_my_username', {
      new_username_text: editableUsername.value
    });
    if (error) throw error;

    superAdminProfile.value.username = editableUsername.value;
    alert('Username updated successfully!');
  } catch (error) {
    alert(`Error updating username: ${error.message}`);
  } finally {
    isEditingUsername.value = false;
  }
};

const activeFeature = ref('dashboard');
const sidebarToggled = ref(false);
const isMobile = ref(false);
let userManagementChannel = null;

const users = ref([]);

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

    salesTrendMonthly: {
    labels: ['June', 'July', 'August', 'September', 'October'],
    datasets: [
      {
        label: 'Total Sales (₱)',
        data: [150000, 190000, 175000, 220000, 280000],
        backgroundColor: '#198754', // A different color (Bootstrap success green)
        borderColor: '#198754',
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
},
);
const orders = ref([
  { id: 101, customer: 'John Doe', date: '2025-10-10', amount: 1250, status: 'Completed' },
  { id: 102, customer: 'Jane Smith', date: '2025-10-10', amount: 800, status: 'Pending' },
  { id: 103, customer: 'Bob Johnson', date: '2025-10-09', amount: 2100, status: 'Shipped' },
]);
const searchQuery = ref('');
const selectedStatus = ref('All');

const totalSalesLast30Days = computed(() => {
  return salesData.value.salesTrend.datasets[0].data.reduce((acc, val) => acc + val, 0) * 4;
});
const newUsersCount = computed(() => {
  return users.value.length;
});
// --- UPDATED COMPUTED PROPERTIES FOR SUMMARY CARDS ---
const totalStock = computed(() => {
  return stockItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0);
});
const lowStockCount = computed(() => {
  return stockItems.value.filter(item => item.status === 'Low Stock').length;
});
const productTypes = computed(() => {
  return stockItems.value.length;
});

const totalSalesToday = computed(() => salesData.value.totalSalesToday);
const totalOrdersToday = computed(() => salesData.value.totalOrdersToday);
const totalOrders = computed(() => orders.value.length);
const pendingOrdersCount = computed(() => orders.value.filter(o => o.status === 'Pending').length);
const completedOrdersCount = computed(() => orders.value.filter(o => o.status === 'Completed').length);
const filteredOrders = computed(() => {
  let filtered = orders.value;
  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(order => order.status === selectedStatus.value);
  }
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

const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => {
    if (a.role === 'Admin' && b.role !== 'Admin') {
      return -1;
    }
    if (a.role !== 'Admin' && b.role === 'Admin') {
      return 1;
    }
    return (a.username || '').localeCompare(b.username || '');
  });
});

let salesTrendChart = null;
let salesByTireTypeChart = null;
let salesTrendMonthlyChart = null; 

const createCharts = () => {
  if (salesTrendChart) salesTrendChart.destroy();
  if (salesByTireTypeChart) salesByTireTypeChart.destroy();
  if (salesTrendMonthlyChart) salesTrendMonthlyChart.destroy();
  const salesTrendCtx = document.getElementById('salesTrendChart');
  if (salesTrendCtx) {
    salesTrendChart = new Chart(salesTrendCtx, {
      type: 'bar',
      data: salesData.value.salesTrend,
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } },
    });
  }
  const salesByTireTypeCtx = document.getElementById('salesByTireTypeChart');
  if (salesByTireTypeCtx) {
    salesByTireTypeChart = new Chart(salesByTireTypeCtx, { type: 'pie', data: salesData.value.salesByTireType, options: { responsive: true, maintainAspectRatio: false } });
  }

  const salesTrendMonthlyCtx = document.getElementById('salesTrendMonthlyChart');
  if (salesTrendMonthlyCtx) {
    salesTrendMonthlyChart = new Chart(salesTrendMonthlyCtx, {
      type: 'bar',
      data: salesData.value.salesTrendMonthly,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } }
        }
      },
    });
  }
};
const pageTitle = computed(() => {
  switch (activeFeature.value) {
    case 'dashboard': return 'Dashboard';
    case 'sales-report': return 'Sales Report';
    case 'stock-monitoring': return 'Stock Monitoring';
    case 'orders': return 'Purchased Orders';
    case 'user-management': return 'User Management';
    case 'settings': return 'System Settings';
    default: return 'Super Admin Dashboard';
  }
});
const setActiveFeature = (feature) => {
  activeFeature.value = feature;
  if (isMobile.value) {
    toggleSidebar();
  }
};
const toggleSidebar = () => {
  sidebarToggled.value = !sidebarToggled.value;
};
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    sidebarToggled.value = false;
  }
};

const confirmLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout failed:", error.message);
  } else {
    // Redirect to the signup page on successful logout
    router.push('/');
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'bg-success';
    case 'Pending': return 'bg-warning text-dark';
    case 'Shipped': return 'bg-primary';
    default: return 'bg-secondary';
  }
};
const getCardBorder = (status) => {
  switch (status) {
    case 'Completed': return 'border-completed';
    case 'Shipped': return 'border-shipped';
    case 'Pending': return 'border-pending';
    default: return '';
  }
};
const filterOrders = (status) => {
  selectedStatus.value = status;
};

const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, role, created_at')
    .neq('role', 'Super Admin');

  if (error) {
    console.error('Error fetching users:', error);
  } else {
    users.value = data;
  }
};

const deleteUser = async (userId, username) => {
  if (confirm(`Are you sure you want to delete the user "${username || 'N/A'}"?`)) {
    const { error } = await supabase.rpc('delete_user_by_id', { user_id: userId });
    if (error) alert(`Failed to delete user: ${error.message}`);
    else alert(`User "${username || 'N/A'}" has been deleted.`);
  }
};

onMounted(() => {
  fetchStockItems();
  checkMobile();
  window.addEventListener('resize', checkMobile);
  fetchSuperAdminProfile();
  fetchUsers();

  userManagementChannel = supabase
    .channel('public:profiles')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'profiles' },
      (payload) => {
        fetchUsers();
      }
    )
    .subscribe();

  nextTick(() => {
    if (activeFeature.value === 'sales-report') {
      createCharts();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (salesTrendChart) salesTrendChart.destroy();
  if (salesByTireTypeChart) salesByTireTypeChart.destroy();
  if (salesTrendMonthlyChart) salesTrendMonthlyChart.destroy();

 if (userManagementChannel) {
    supabase.removeChannel(userManagementChannel);
  }
});

watch(activeFeature, (newFeature) => {
  if (newFeature === 'sales-report') {
    nextTick(() => {
      createCharts();
    });
  }
});
</script>