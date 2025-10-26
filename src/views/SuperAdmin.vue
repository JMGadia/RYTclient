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
              <div class="col-lg-12">
                <div class="card shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="mb-0 text-primary fw-bold">Sales Trend (Last 7 Days)</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="salesTrendChart"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <div class="row g-4 mt-4">
                <div class="col-lg-6 offset-lg-3">
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
                            <h3 class="card-text display-6 fw-bolder">{{ totalOrders }}</h3>
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
                            <h3 class="card-text display-6 fw-bolder">{{ pendingOrdersCount }}</h3>
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
                            <h3 class="card-text display-6 fw-bolder">{{ completedOrdersCount }}</h3>
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
            <h5 class="mb-0 text-primary fw-bold">Order List ({{ selectedStatus }})</h5>
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
            <div v-if="ordersLoading" class="text-center py-5">
                <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
                <p class="mt-2 text-muted">Loading orders...</p>
            </div>
            <div v-else-if="filteredOrders.length === 0" class="alert alert-info text-center">
                No orders found matching your criteria.
            </div>
            <div class="row g-4" v-else>
                <div class="col-lg-4 col-md-6" v-for="order in filteredOrders" :key="order.order_id">
                    <div class="card h-100 shadow-sm border-2" :class="getCardBorder(order.cardStatus)">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="card-subtitle text-muted fw-bold">Order ID: #{{ order.order_id.slice(0, 8) }}</h6>
                                <span class="badge" :class="getStatusBadge(order.cardStatus)">{{ order.cardStatus }}</span>
                            </div>
                            <h5 class="card-title">{{ order.username }}</h5>
                            <p class="card-text mb-1">
                                <i class="fas fa-calendar-alt text-muted me-2"></i>
                                <span class="fw-bold">Date:</span> {{ new Date(order.created_at).toLocaleDateString() }}
                            </p>
                            <p class="card-text">
                                <i class="fas fa-peso-sign text-muted me-2"></i>
                                <span class="fw-bold">Total:</span> ₱{{ order.total_price.toLocaleString() }}
                            </p>
                        </div>
                        <div class="card-footer bg-light border-top-0 d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-primary me-2" @click="viewOrderDetails(order)">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-sm btn-outline-danger" v-if="order.cardStatus === 'Pending'">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </div>
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
<div v-if="showOrderModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Order Details: #{{ selectedOrderDetails.order_id.slice(0, 8) }}</h5>
                <button type="button" class="btn-close" @click="showOrderModal = false"></button>
            </div>
            <div class="modal-body" v-if="selectedOrderDetails">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Order Summary</h6>
                        <ul class="list-group list-group-flush mb-3">
                            <li class="list-group-item d-flex justify-content-between">
                                Status: <span :class="getStatusBadge(selectedOrderDetails.cardStatus)" class="badge">{{ selectedOrderDetails.cardStatus }}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                Customer: <span>{{ selectedOrderDetails.username }}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                Contact: <span>{{ selectedOrderDetails.contact }}</span>
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                Total Price: <span class="text-success fw-bold">₱{{ selectedOrderDetails.total_price.toFixed(2) }}</span>
                            </li>
                            <li class="list-group-item">
                                Shipping Address: <br> <span>{{ selectedOrderDetails.shipping_addr }}</span>
                            </li>
                        </ul>

                        <h6>Items Ordered</h6>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between" v-for="item in selectedOrderDetails.order_items" :key="item.product_id">
                                <span>{{ item.products.brand }} ({{ item.products.size }}) x{{ item.quantity }}</span>
                                <span class="text-muted">₱{{ (item.price_at_purchase * item.quantity).toFixed(2) }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="col-md-6">
                        <h6>Payment Confirmation</h6>
                        <div v-if="selectedOrderDetails.paymentProofUrl">
                            <p class="text-muted small">Proof Path: {{ selectedOrderDetails.payment_proof_path }}</p>
                            <a :href="selectedOrderDetails.paymentProofUrl" target="_blank" class="d-block text-center">
                                <img :src="selectedOrderDetails.paymentProofUrl" alt="Payment Proof" class="img-fluid border rounded shadow-sm" style="max-height: 300px; object-fit: contain;" />
                                <p class="small mt-2 text-primary">Click to view full image in new tab</p>
                            </a>
                        </div>
                        <div v-else class="alert alert-warning">
                            No payment proof screenshot found for this order.
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showOrderModal = false">Close</button>
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
    const allowedExitRoutes = ['login', 'signup', 'ImportProduct'];
    if (allowedExitRoutes.includes(to.name)) {
        next();
        return;
    }

    const answer = window.confirm('Are you sure you want to leave? This will end your session for security.');
    if (answer) {
        supabase.auth.signOut();
        next({ name: 'login' });
    } else {
        next(false);
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

// --- NEW STATE FOR PURCHASE ORDERS ---
const purchaseOrders = ref([]);
const ordersLoading = ref(false);
const showOrderModal = ref(false);
const selectedOrderDetails = ref(null);


// --- NEW FUNCTION: FETCH PURCHASE ORDERS (LIVE DATA ONLY) ---
const fetchPurchaseOrders = async () => {
    ordersLoading.value = true;
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    product_id,
                    quantity,
                    price_at_purchase,
                    products!inner(id, brand, size)
                )
            `)
            // NOTE: Including 'Pre-Ordered' to show payments waiting for processing
            .in('status', ['Pre-Ordered', 'Order Processed', 'Shipped', 'Delivered'])
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map database status to front-end card status (Pending, Shipped, Completed)
        purchaseOrders.value = data.map(order => {
            let cardStatus;
            if (order.status === 'Pre-Ordered' || order.status === 'Order Processed') {
                cardStatus = 'Pending';
            } else if (order.status === 'Shipped') {
                cardStatus = 'Shipped';
            } else if (order.status === 'Delivered') {
                cardStatus = 'Completed';
            } else {
                cardStatus = 'Unknown';
            }

            return {
                ...order,
                cardStatus: cardStatus,
            };
        });

    } catch (err) {
        console.error('Error fetching purchase orders:', err);
        purchaseOrders.value = []; // Ensure state is cleared on error
    } finally {
        ordersLoading.value = false;
    }
};

// --- UPDATED FUNCTION: Update Order Status (SIMPLIFIED SALES AGGREGATION) ---
const updateOrderStatus = async (orderId, newStatus) => {
    if (!confirm(`Are you sure you want to change order ${orderId} status to "${newStatus}"?`)) return;

    let totalSalePrice = 0;

    try {
        // 1. If 'Delivered', get price before status update
        if (newStatus === 'Delivered') {
            const { data: orderData, error: fetchError } = await supabase
                .from('orders')
                .select('total_price')
                .eq('order_id', orderId)
                .single();

            if (fetchError) throw fetchError;
            totalSalePrice = orderData.total_price;
        }

        // 2. Update the order status
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('order_id', orderId);

        if (updateError) throw updateError;

        // 3. ONLY run the simplified sales aggregation if the order is marked Delivered
        if (newStatus === 'Delivered') {
            // Call the simple RPC to update ONLY daily_sales, weekly_sales, and monthly_sales
            const { error: salesError } = await supabase.rpc('record_sale_amount', {
                p_sales_amount: totalSalePrice
            });

            if (salesError) {
                console.error('Failed to update sales data after delivery:', salesError.message);
            }
        }

        // Refresh the list of orders and sales data
        fetchPurchaseOrders();
        fetchSalesReport();
        alert(`Order ${orderId} successfully updated to ${newStatus}.`);
    } catch (err) {
        alert(`Failed to complete action: ${err.message}`);
        console.error('Error in updateOrderStatus:', err);
    }
};


// --- NEW FUNCTION: VIEW ORDER DETAILS (Shows payment proof) ---
const viewOrderDetails = (order) => {
    let paymentProofUrl = null;

    if (order.payment_proof_path) {
        const { data } = supabase.storage
            .from('partialpay_proof')
            .getPublicUrl(order.payment_proof_path);

        paymentProofUrl = data.publicUrl;
    }

    selectedOrderDetails.value = {
        ...order,
        paymentProofUrl: paymentProofUrl,
    };
    showOrderModal.value = true;
};


const fetchStockItems = async () => {
    stockLoading.value = true;
    stockError.value = null;
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('brand', { ascending: true });

        if (error) throw error;

        stockItems.value = data.map(item => {
            let status;
            if (item.quantity === 0) {
                // 🌟 NEW LOGIC: If quantity is exactly 0, it's 'Out of Stock'
                status = 'Out of Stock';
            } else if (item.quantity <= item.reorder_point) {
                status = 'Low Stock';
            } else {
                status = 'In Stock';
            }
            return {
                ...item,
                status: status
            };
        });

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

// Functions for editing the username (omitted for brevity, assume they are correct)
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

// --- Sales Report Data (No dummy data, initializing empty for live data) ---
const salesLoading = ref(true);
const salesError = ref(null);

const salesData = ref({
    totalSalesToday: 0,
    totalOrdersToday: 0,
    totalWeeklySales: 0,
    totalMonthlySales: 0,
    // Chart data is initialized empty
    salesTrend: { labels: [], datasets: [{ label: 'Daily Sales (₱)', data: [], backgroundColor: '#0d6efd', borderColor: '#0d6efd', borderWidth: 1, borderRadius: 5, }], },
    salesTrendMonthly: { labels: [], datasets: [{ label: 'Monthly Sales (₱)', data: [], backgroundColor: '#198754', borderColor: '#198754', borderWidth: 1, borderRadius: 5, }], },
    salesByTireType: { labels: [], datasets: [{ label: 'Sales by Product Type', data: [], backgroundColor: ['#0d6efd', '#6610f2', '#6f42c1', '#dc3545', '#fd7e14', '#ffc107',], hoverOffset: 4, }], },
});

// --- CORE FUNCTION: UPDATED FETCH SALES REPORT DATA WITH DUMMY DATA FALLBACK ---
const fetchSalesReport = async () => {
    salesLoading.value = true;
    salesError.value = null;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        // 1. Fetch sales_data (Cumulative Totals)
        const { data: cumulativeData, error: cumulativeError } = await supabase
            .from('sales_data')
            .select('daily_sales, weekly_sales, monthly_sales')
            .limit(1)
            .single();

        if (cumulativeError && cumulativeError.code !== 'PGRST116') { // PGRST116 is "Did not find row"
            throw cumulativeError;
        }

        // Initialize sales data variables
        let liveDailySales = 0;
        let liveWeeklySales = 0;
        let liveMonthlySales = 0;

        if (cumulativeData) {
            liveDailySales = cumulativeData.daily_sales || 0;
            liveWeeklySales = cumulativeData.weekly_sales || 0;
            liveMonthlySales = cumulativeData.monthly_sales || 0;
        }

        // Update live summary cards
        salesData.value.totalSalesToday = liveDailySales;
        salesData.value.totalWeeklySales = liveWeeklySales;
        salesData.value.totalMonthlySales = liveMonthlySales;

        // 2. Calculate Total Orders for Today and Product Trend
        const { data: orderItemsData, error: ordersError } = await supabase
            .from('orders')
            .select(`
                status,
                created_at,
                order_items (
                    quantity,
                    price_at_purchase,
                    products (brand)
                )
            `)
            .eq('status', 'Delivered')
            .gte('created_at', today) // Orders created today or later
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        let totalOrdersTodayCount = 0;
        const productTrendMap = {};

        if (orderItemsData) {
            orderItemsData.forEach(order => {
                totalOrdersTodayCount++;

                // Aggregate Product Trend (Sales by Tire Type)
                order.order_items.forEach(item => {
                    const brand = item.products.brand;
                    // Fallback safety for missing price_at_purchase
                    const revenue = item.quantity * (item.price_at_purchase || 0);

                    if (!productTrendMap[brand]) {
                        productTrendMap[brand] = 0;
                    }
                    productTrendMap[brand] += revenue;
                });
            });
        }

        // Update live total orders card
        salesData.value.totalOrdersToday = totalOrdersTodayCount;

        // 3. Update Product Trend Chart (SALES BY TIRE TYPE - Live Data)
        salesData.value.salesByTireType.labels = Object.keys(productTrendMap);
        salesData.value.salesByTireType.datasets[0].data = Object.values(productTrendMap);

        // -----------------------------------------------------------
        // 4. ADD DUMMY DATA for Daily Trend Chart (Last 7 Days)
        // -----------------------------------------------------------
        // Helper function to get the last N day names
        const getLastNDays = (n) => {
            const days = [];
            for (let i = n - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                if (i === 0) {
                    days.push('Today'); // Set the last day as 'Today'
                } else {
                    days.push(d.toLocaleString('en-US', { weekday: 'short' }));
                }
            }
            return days;
        };

        const dailyLabels = getLastNDays(7);
        salesData.value.salesTrend.labels = dailyLabels;

        // Dummy values for the past 6 days (simulating a slight upward trend)
        const dailyDummySales = [
            Math.floor(liveDailySales * 0.5 + 1000),
            Math.floor(liveDailySales * 0.7 + 1500),
            Math.floor(liveDailySales * 0.6 + 800),
            Math.floor(liveDailySales * 0.8 + 2000),
            Math.floor(liveDailySales * 0.9 + 1000),
            Math.floor(liveDailySales * 0.7 + 2500)
        ];

        // Use the 6 dummy values and the live daily sales for the final bar
        const dailyData = [...dailyDummySales, liveDailySales];
        salesData.value.salesTrend.datasets[0].data = dailyData;

        // -----------------------------------------------------------
        // 5. ADD DUMMY DATA for Monthly Trend Chart (Full Year: Jan to Dec)
        // -----------------------------------------------------------
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthIndex = new Date().getMonth(); // 0 to 11

        // Generate more realistic dummy data for a full year (adjusting for the current month)
        const monthlyDataFullYear = [
            250000, 300000, 450000, 400000, 550000, 600000,
            750000, 700000, 850000, 900000, 1000000, 1100000
        ];

        // Create an array that uses liveMonthlySales for the current month and future months are 0
        const finalMonthlyData = monthlyDataFullYear.map((dummyValue, index) => {
            if (index === currentMonthIndex) {
                return liveMonthlySales;
            } else if (index > currentMonthIndex) {
                return 0; // Future months show 0
            }
            return dummyValue; // Past months show dummy data
        });

        salesData.value.salesTrendMonthly.labels = monthNames;
        salesData.value.salesTrendMonthly.datasets[0].data = finalMonthlyData;
        // -----------------------------------------------------------

    } catch (err) {
        salesError.value = 'Failed to load sales report data.';
        console.error(err);
    } finally {
        salesLoading.value = false;
        if (activeFeature.value === 'sales-report' || activeFeature.value === 'dashboard') {
            nextTick(createCharts);
        }
    }
};

const searchQuery = ref('');
const selectedStatus = ref('All');

// --- COMPUTED PROPERTIES ---

// These now read directly from the fetched sales_data
const totalSalesToday = computed(() => salesData.value.totalSalesToday);
const totalOrdersToday = computed(() => salesData.value.totalOrdersToday);
const totalSalesLast7Days = computed(() => salesData.value.totalWeeklySales);
const totalSalesLast30Days = computed(() => salesData.value.totalMonthlySales);

const newUsersCount = computed(() => users.value.length);
const totalStock = computed(() => stockItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0));
const lowStockCount = computed(() => stockItems.value.filter(item => item.status === 'Low Stock').length);
const productTypes = computed(() => stockItems.value.length);


// --- UPDATED ORDER COUNTS ---
const totalOrders = computed(() => purchaseOrders.value.length);
// Pending: Includes 'Pre-Ordered' and 'Order Processed'
const pendingOrdersCount = computed(() => purchaseOrders.value.filter(o => o.cardStatus === 'Pending' || o.cardStatus === 'Shipped').length);
const completedOrdersCount = computed(() => purchaseOrders.value.filter(o => o.cardStatus === 'Completed').length);

const filteredOrders = computed(() => {
    let filtered = purchaseOrders.value;
    if (selectedStatus.value !== 'All') {
        if (selectedStatus.value === 'Pending') {
            filtered = filtered.filter(order => order.cardStatus === 'Pending' || order.cardStatus === 'Shipped');
        } else {
            filtered = filtered.filter(order => order.cardStatus === selectedStatus.value);
        }
    }
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(order =>
            order.order_id.toString().includes(query) ||
            order.username.toLowerCase().includes(query) ||
            order.cardStatus.toLowerCase().includes(query)
        );
    }
    return filtered;
});

const sortedUsers = computed(() => {
    return [...users.value].sort((a, b) => {
        if (a.role === 'Admin' && b.role !== 'Admin') return -1;
        if (a.role !== 'Admin' && b.role === 'Admin') return 1;
        return (a.username || '').localeCompare(b.username || '');
    });
});

let salesTrendChart = null;
let salesByTireTypeChart = null;
let salesTrendMonthlyChart = null;

const createCharts = () => {
    // Destroy existing charts to prevent memory leaks and chart stacking
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
    if (salesByTireTypeCtx && salesData.value.salesByTireType.labels.length > 0) {
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
        case 'Completed': return 'border-success';
        case 'Shipped': return 'border-primary';
        case 'Pending': return 'border-warning';
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
    fetchSalesReport();
    fetchPurchaseOrders();
    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchSuperAdminProfile();
    fetchUsers();

    // Real-time subscriptions remain unchanged as they are still useful
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

    // Real-time updates for orders
    supabase
        .channel('orders_updates')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            () => {
                fetchPurchaseOrders();
                fetchSalesReport();
            }
        )
        .subscribe();

    // Removed the 'sales_report_updates' channel since 'sales_report' is no longer the source
    // Sales data will be refreshed when orders change status

    nextTick(() => {
        if (activeFeature.value === 'sales-report' || activeFeature.value === 'dashboard') {
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
    if (newFeature === 'sales-report' || newFeature === 'dashboard') {
        nextTick(() => {
            createCharts();
        });
    }
});
</script>