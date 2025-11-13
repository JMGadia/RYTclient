<template>
  <div class="d-flex" id="wrapper" :class="{ toggled: sidebarToggled }">

    <div class="bg-dark border-right" id="sidebar-wrapper">
      <div class="sidebar-heading text-white text-center py-4 fs-4 fw-bold">i-Tyre Super Admin</div>
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
            <li class="nav-item active d-lg-block d-none d-sm-block dropdown" id="notifications-top-nav">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="notificationsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fas fa-bell me-1"></i>
                <span class="d-sm-inline">Notifications</span>
                <span v-if="newNotificationCount > 0" class="badge rounded-pill bg-danger ms-1">{{ newNotificationCount }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="notificationsDropdown" style="max-height: 500px; overflow-y: auto; width: 350px;">
                <li><h6 class="dropdown-header text-primary fw-bold">Recent Activities (Last 20)</h6></li>
                <li v-for="activity in recentActivities" :key="activity.id">
                    <a class="dropdown-item d-flex align-items-start py-2" href="#">
                        <i :class="getNotificationIcon(activity.event)" class="me-3 mt-1"></i>
                        <div class="flex-grow-1">
                            <div class="fw-bold small text-wrap" v-html="activity.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"></div>
                            <div class="text-xs text-muted">{{ activity.source }} · {{ activity.timestamp.split(', ')[1] }}</div>
                        </div>
                    </a>
                </li>
                <li v-if="recentActivities.length === 0"><span class="dropdown-item text-muted">No recent activity.</span></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item text-center text-primary" href="#" @click.prevent="setActiveFeature('dashboard')">View Full Activity Log</a></li>
              </ul>
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

            <div v-if="activeFeature === 'dashboard'" class="col-lg-12">
              <div class="card shadow mb-4">
                  <div class="card-header py-3">
                      <h6 class="m-0 font-weight-bold text-primary">Recent Activities</h6>
                  </div>
                  <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                      <div v-if="recentActivities.length === 0" class="text-center text-muted py-3">
                          No recent activities found.
                      </div>
                      <div v-for="activity in recentActivities" :key="activity.id" class="mb-3 border-left-primary p-2 small">
                          <div class="text-xs font-weight-bold text-primary text-uppercase">{{ activity.source }} ({{ activity.event }})</div>
                          <div class="text-wrap" v-html="activity.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')"></div>
                          <div class="text-muted small mt-1">{{ activity.timestamp }}</div>
                      </div>
                  </div>
              </div>
            </div>

          </div>

          <div v-else-if="activeFeature === 'sales-report'">

            <div id="salesReportContent">
              <h2 class="h4">Sales Report Overview</h2>
              <p>View key sales metrics and performance over time.</p>

              <div class="d-flex justify-content-end mb-3">
                  <button class="btn btn-danger" @click="exportSalesToCSV">
                      <i class="fas fa-file-excel me-2"></i>Export to Excel
                  </button>
              </div>

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

               <div class="row g-4 mt-4">
                  <div class="col-lg-6 offset-lg-3">
                    <div class="card shadow-sm h-100">
                      <div class="card-header bg-white">
                        <h5 class="mb-0 text-primary fw-bold">Product Trend <span v-if="selectedYear"> ({{ selectedYear }})</span></h5>
                      </div>
                      <div class="card-body d-flex justify-content-center align-items-center">
                        <canvas id="salesByTireTypeChart"></canvas>
                      </div>
                    </div>
                  </div>
              </div>
              <div class="mt-4"></div>
              <div class="row g-4">
                <div class="col-lg-12">
                  <div class="card shadow-sm h-100">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 class="mb-0 text-primary fw-bold">
                        Sales Trend ({{ selectedMonth || 'Last 7 Days' }})
                    </h5>
                    <button v-if="selectedMonth" class="btn btn-sm btn-outline-secondary" @click="resetMonthlyDrilldown">
                        <i class="fas fa-angle-left me-1"></i> Back to {{ selectedYear }} Months
                    </button>
                    </div>
                    <div class="card-body">
                      <canvas id="salesTrendChart" @click="drillDownMonthlySales"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-4 mt-4">
                <div class="col-lg-12">
                  <div class="card shadow-sm h-100">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 class="mb-0 text-primary fw-bold">
                        Sales Trend ({{ selectedYear || 'Past Months' }})
                    </h5>
                    <button v-if="selectedYear" class="btn btn-sm btn-outline-secondary" @click="resetYearlyDrilldown">
                        <i class="fas fa-angle-left me-1"></i> Back to Past Years
                    </button>
                    </div>
                    <div class="card-body">
                        <canvas id="salesTrendMonthlyChart" style="height: 300px;" @click="drillDownMonthlySales"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-4 mt-4">
                <div class="col-lg-12">
                    <div class="card shadow-sm h-100">
                        <div class="card-header bg-white">
                            <h5 class="mb-0 text-primary fw-bold"><i class="fas me-2"></i>Sales Trend (Past Years)</h5>
                        </div>
                        <div class="card-body">
                            <div style="max-height: 400px;">
                                <canvas id="yearlySalesChart" @click="drillDownYearlySales"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div> </div>
          <div v-else-if="activeFeature === 'stock-monitoring'">
            <h2 class="h4">Tire Stock Monitoring </h2>
            <p>
              View and manage current stock levels, low stock alerts, and details for different tire
              types.
            </p>

            <div class="row g-4 mb-4">
              <div class="col-lg-3 col-md-6">
                <div
                    class="card bg-primary text-white h-100 shadow-sm border-0 cursor-pointer"
                    :class="{ 'border-3 border-light': stockFilter === 'All' }"
                    @click="setStockFilter('All')"
                >
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title fw-bold">Total Stock (All)</h5>
                      <h3 class="card-text display-6 fw-bolder">{{ totalStock }}</h3>
                    </div>
                    <i class="fas fa-boxes fa-3x opacity-50"></i>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div
                    class="card bg-warning text-dark h-100 shadow-sm border-0 cursor-pointer"
                    :class="{ 'border-3 border-danger': stockFilter === 'Low Stock' }"
                    @click="setStockFilter('Low Stock')"
                >
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title fw-bold">Low Stock Alerts</h5>
                      <h3 class="card-text display-6 fw-bolder">{{ lowStockCount }}</h3>
                    </div>
                    <i class="fas fa-exclamation-triangle fa-3x opacity-50"></i>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div
                    class="card bg-danger text-white h-100 shadow-sm border-0 cursor-pointer"
                    :class="{ 'border-3 border-light': stockFilter === 'Out of Stock' }"
                    @click="setStockFilter('Out of Stock')"
                >
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title fw-bold">Out of Stock</h5>
                      <h3 class="card-text display-6 fw-bolder">{{ outOfStockCount }}</h3>
                    </div>
                    <i class="fas fa-minus-circle fa-3x opacity-50"></i>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
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
                <h5 class="mb-0 text-primary fw-bold">Current Tire Stock (Showing {{ stockFilter }})</h5>
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
                        <th class="py-3 px-4">Last Updated</th>
                        <th class="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="stockLoading">
                        <td colspan="6" class="text-center py-4">Loading stock...</td>
                      </tr>
                      <tr v-else-if="filteredAndSortedStockItems.length === 0">
                        <td colspan="6" class="text-center py-4">No products found for the **{{ stockFilter }}** filter.</td>
                      </tr>
                      <tr v-for="item in filteredAndSortedStockItems" :key="item.id">
                        <td class="py-3 px-4">{{ item.product_type }}</td>
                        <td class="py-3 px-4">{{ item.brand }}</td>
                        <td class="py-3 px-4">{{ item.size }}</td>
                        <td class="py-3 px-4">{{ item.quantity }}</td>
                        <td class="py-3 px-4 small text-muted">{{ item.last_updated }}</td>
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
                                    <button class="btn btn-sm btn-outline-danger" v-if="order.cardStatus === 'Pending'"
                                        @click="cancelOrder(order)"  >
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
                                    Payment Method: <span>{{ selectedOrderDetails.payment_method }}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    Contact: <span>{{ selectedOrderDetails.contact }}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    Total Price: <span class="text-success fw-bold">₱{{ selectedOrderDetails.total_price.toFixed(2) }}</span>
                                </li>
                                    <li class="list-group-item">
                                    Shipping Address: <span>{{ selectedOrderDetails.shipping_address }}</span>
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
                            <h6>Proof of Payment</h6>
                            <div v-if="selectedOrderDetails.paymentProofUrl">

                                <div class="d-block text-center">
                                    <img
                                        :src="selectedOrderDetails.paymentProofUrl"
                                        alt="Proof of Payment"
                                        class="img-fluid border rounded shadow-sm"
                                        style="max-height: 300px; object-fit: contain;"
                                    />

                                    <p class="small mt-2 text-primary">
                                        <a :href="selectedOrderDetails.paymentProofUrl" target="_blank" style="text-decoration: underline;">
                                            Click here for full resolution view
                                        </a>
                                    </p>
                                </div>

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


    <div v-if="showDeleteConfirmationModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">⚠️ **Confirm User Deletion**</h5>
            <button type="button" class="btn-close btn-close-white" @click="cancelDeleteProcedure"></button>
          </div>
          <div class="modal-body">
            <p>You are about to permanently delete the user: **{{ userToDelete?.username }}**.</p>
            <p class="fw-bold">To proceed, enter the **Super Admin account password**:</p>

            <div class="mb-3">
              <label for="superAdminPass" class="form-label">Super Admin Password:</label>
              <input
                type="password"
                class="form-control"
                id="superAdminPass"
                v-model="superAdminPassword"
                @keyup.enter="confirmDeleteUser"
                placeholder="Enter Super Admin Password"
              >
            </div>

            <div v-if="deleteError" class="alert alert-danger" role="alert">
              {{ deleteError }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelDeleteProcedure">
              Cancel
            </button>

            <button type="button" class="btn btn-danger" @click="confirmDeleteUser">

              Confirm Delete

            </button>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>

<style scoped>

/* Add a style for the click interaction and highlight */
.cursor-pointer {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.cursor-pointer:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

/* Optional: Highlight the active filter card */
/* Add styles to highlight the active card */
.card.border-3 {
    border: 3px solid !important;
}

.card.border-3.border-light {
    box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.5) !important;
}
.card.border-3.border-danger {
    border-color: #dc3545 !important; /* Danger color for low stock */
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.5) !important;
}
.card-active { /* Used for order status filter */
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.5) !important;
}

/* 🔔 NEW: Notification Styles (Add this to your CSS) */
.notification-container {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 1050;
    width: 100%;
    max-width: 350px;
}

/* Optional Fade Transition for Vue's transition-group */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

@keyframes slide-in {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
/* 🔔 END Notification Styles */

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
// 1. 💡 NEW IMPORTS: Add ChartDataLabels for displaying values directly on bars
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // 👈 NEW: DataLabels Plugin
import { supabase } from '../server/supabase';
import { useRouter, onBeforeRouteLeave } from 'vue-router'

// --- 🛑 NEW CORE LOGIC: CANCEL ORDER FUNCTION ---
const cancelOrder = async (order) => {
    // 1. Confirmation & Status Check
    if (order.cardStatus === 'Cancelled' || order.cardStatus === 'Completed') {
        alert(`Order #${order.order_id.slice(0, 8)} cannot be cancelled because its current status is ${order.cardStatus}.`);
        return;
    }

    if (!confirm(`⚠️ Are you sure you want to PERMANENTLY CANCEL AND DELETE order #${order.order_id.slice(0, 8)}? This will restore stock and delete the order records.`)) {
        return;
    }

    try {
        ordersLoading.value = true;
        const orderId = order.order_id;

        // 🛑 CRITICAL FIX: Use a single RPC to handle all deletion, stock, and sales reversal in one atomic transaction.
        const { data, error } = await supabase.rpc('cancel_order_and_revert_stock', {
            p_order_id: orderId
        });

        if (error) {
            console.error('RPC Error:', error);
            throw new Error(error.message);
        }

        // 2. Final Refresh and Log
        alert(`✅ Order #${order.order_id.slice(0, 8)} successfully CANCELLED and deleted. Stock restored.`);
        createActivityLogEntry('Purchased Orders', 'DELETE', `Order **#${order.order_id.slice(0, 8)}** has been **PERMANENTLY DELETED**. Stock restored.`);

    } catch (err) {
        alert(`Failed to cancel order: ${err.message}. Please verify the RPC function is correctly set up.`);
        console.error('Error in cancelOrder:', err);
    } finally {
        // Refresh all relevant data on the UI (Orders, Sales, Stock)
        fetchPurchaseOrders();
        fetchSalesReport();
        fetchStockItems();
        ordersLoading.value = false;
    }
};

const EMAIL_FUNCTION_URL = 'https://ivqefxeeiuyjcsrlqjxr.supabase.co/functions/v1/send-custom-email';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cWVmeGVlaXV5amNzcmxxanhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTkyOTgsImleHAiOjIwNzE5MzUyOTh9.GURdtsHejB6ROarVzuQctcSKNVRCaD5BWQ-uB-Vody0';
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

// --- 🔒 NEW SECURITY FEATURE REFS ---
const showDeleteConfirmationModal = ref(false);
const userToDelete = ref(null); // Stores { id, username } of the user being deleted
const superAdminPassword = ref('');
const deleteError = ref('');

// --- REFS FOR LIVE STOCK DATA ---
const unfilteredStockItems = ref([]); // RENAMED: Holds the raw data from the DB
const stockLoading = ref(false); // Changed to false for better initial UX if data loads fast
const stockError = ref(null);
const stockFilter = ref('All'); // 💡 NEW: Filter states: 'All', 'Low Stock', 'Out of Stock'

// --- NEW STATE FOR PURCHASE ORDERS ---
const purchaseOrders = ref([]);
const ordersLoading = ref(false);
const showOrderModal = ref(false);
const selectedOrderDetails = ref(null);

// 🌟 NEW: Realtime Channel References
let userManagementChannel = null; // Existing
let ordersChannel = null; // Renamed from anonymous channel
let stockChannel = null; // 👈 NEW: Channel for stock/product updates

// --- REFS FOR RAW ORDERS (New Ref for detailed CSV export) ---
const rawDeliveredOrders = ref([]);

// 🎯 NEW: Recent Activities Log State
const recentActivities = ref([]);

// 🔔 NEW: State for unread notifications
const newNotificationCount = ref(0);

// --- 🚀 NEW DRILL-DOWN STATE ---
const selectedYear = ref(null);
const selectedMonth = ref(null);
const monthlySalesDrilldown = ref(null); // Stores { labels: [], data: [] } for a selected year's months
const dailySalesDrilldown = ref(null); // Stores { labels: [], data: [] } for a selected month's days/weeks

// --- NEW FUNCTION: Get icon class based on event type ---
const getNotificationIcon = (eventType) => {
    switch (eventType) {
        case 'INSERT':
            return 'fas fa-plus-circle text-success';
        case 'UPDATE':
            return 'fas fa-edit text-info';
        case 'DELETE':
            return 'fas fa-trash-alt text-danger';
        case 'EXPORT':
            return 'fas fa-file-export text-warning';
        default:
            return 'fas fa-info-circle text-primary';
    }
};

// --- NEW FUNCTION: Reset notification count when dropdown is opened ---
const resetNotificationCount = () => {
    newNotificationCount.value = 0;
};

// 💡 NEW FIX: Manually toggle the dropdown using Bootstrap JS for mobile sidebar
const toggleMobileNotifications = () => {
    // 1. Get the DOM element of the actual dropdown (which is in the top nav bar)
    const notificationsDropdown = document.getElementById('notificationsDropdown');

    if (notificationsDropdown) {
        // 2. Use the official Bootstrap JS API to toggle the dropdown
        // This requires the Bootstrap JS library to be loaded (usually globally)
        const dropdown = new window.bootstrap.Dropdown(notificationsDropdown);
        dropdown.toggle();

        // 3. Close the sidebar after attempting to open the dropdown on mobile
        if (isMobile.value) {
            toggleSidebar();
        }
    }
};

// 🎯 NEW: Utility function to create and add log entry
const createActivityLogEntry = (source, eventType, message) => {
    const timestamp = new Date().toLocaleString();
    const newEntry = {
        id: Date.now() + Math.random(), // Unique ID for key
        timestamp: timestamp,
        source: source, // e.g., 'User Management', 'Stock Monitoring', 'Purchased Orders'
        event: eventType, // e.g., 'INSERT', 'UPDATE', 'DELETE'
        message: message,
    };
    // Add to the start of the array to show the latest activity first
    recentActivities.value.unshift(newEntry);

    // 🔔 NEW: Increment notification count for a fresh unread indicator
    newNotificationCount.value++;

    // Optional: Keep the log array size reasonable (e.g., last 20 activities)
    if (recentActivities.value.length > 20) {
        recentActivities.value.pop();
    }
};


// --- NEW FUNCTION: FETCH PURCHASE ORDERS (LIVE DATA ONLY) ---
const fetchPurchaseOrders = async () => {
    ordersLoading.value = true;
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                payment_method,
                shipping_address,
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
                // Shipping Address and Payment Method are now included here from the fetch
            };
        });

    } catch (err) {
        console.error('Error fetching purchase orders:', err);
        purchaseOrders.value = []; // Ensure state is cleared on error
    } finally {
        ordersLoading.value = false;
    }
};

// --- NEW FUNCTION: Fetch raw data for all delivered orders (for CSV) ---
const fetchRawDeliveredOrders = async () => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                order_id,
                username,
                created_at,
                total_amount,
                order_items (
                    quantity,
                    price_at_purchase,
                    products!inner(brand, size)
                )
            `)
            .eq('status', 'Delivered')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Flatten the data for easier CSV export (one row per order item)
        const flattenedData = data.flatMap(order =>
            order.order_items.map(item => ({
                'Order ID': order.order_id,
                'Order Date': new Date(order.created_at).toLocaleDateString(),
                'Customer Username': order.username,
                'Product Brand': item.products.brand,
                'Product Size': item.products.size,
                'Quantity Sold': item.quantity,
                'Price Per Unit (₱)': item.price_at_purchase,
                'Line Total (₱)': item.quantity * (item.price_at_purchase || 0),
            }))
        );

        rawDeliveredOrders.value = flattenedData;

    } catch (err) {
        console.error('Error fetching raw delivered orders:', err);
        rawDeliveredOrders.value = [];
    }
};


// --- UPDATED FUNCTION: Update Order Status (SIMPLIFIED SALES AGGREGATION) ---
const updateOrderStatus = async (orderId, newStatus) => {
    if (!confirm(`Are you sure you want to change order ${orderId} status to "${newStatus}"?`)) return;

    try {
        // 1. Update the order status
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('order_id', orderId);

        if (updateError) throw updateError;

        // 2. ONLY run the full sales aggregation if the order is marked Delivered
        if (newStatus === 'Delivered') {
            // CALL THE NEW, ROBUST RPC with the order ID
            const { error: salesError } = await supabase.rpc('update_sales_metrics_on_delivery', {
                p_order_id: orderId // Pass the order ID
            });

            if (salesError) {
                console.error('Failed to update sales data after delivery:', salesError.message);
            }
        }

        // 🌟 NOTE: The Realtime subscriptions will handle the UI refresh.
        alert(`Order ${orderId} successfully updated to ${newStatus}.`);
    } catch (err) {
        alert(`Failed to complete action: ${err.message}`);
        console.error('Error in updateOrderStatus:', err);
    }
};

// --- 🚀 MODIFIED FUNCTION: VIEW ORDER DETAILS (Extracts path from full URL) ---
const viewOrderDetails = (order) => {
    let paymentProofUrl = null;

    if (order.payment_proof_url) {
        let storagePath = order.payment_proof_url;

        // 🛑 NEW FIX: Check if the value is already a full URL (the bad data format)
        if (storagePath.startsWith('http')) {
            try {
                // Parse the URL and extract the path after the bucket name ('partialpay_proof/')
                const url = new URL(storagePath);
                // Example of expected pathname: /storage/v1/object/public/partialpay_proof/path/to/file.png
                const segments = url.pathname.split('/');

                // Find the index of the bucket name ('partialpay_proof')
                const bucketIndex = segments.indexOf('partialpay_proof');

                if (bucketIndex !== -1) {
                    // Rejoin the segments starting immediately after the bucket name
                    storagePath = segments.slice(bucketIndex + 1).join('/');
                } else {
                    // Fallback if URL is weird, just use the original to prevent crashes
                    storagePath = order.payment_proof_url;
                }
            } catch (e) {
                console.error("Failed to parse stored URL path:", e);
                storagePath = order.payment_proof_url;
            }
        }

        // Now, we use the cleaned/extracted path with getPublicUrl()
        const { data } = supabase.storage
            .from('partialpay_proof')
            .getPublicUrl(storagePath);

        paymentProofUrl = data.publicUrl;
    }

    selectedOrderDetails.value = {
        ...order,
        paymentProofUrl: paymentProofUrl,
    };
    showOrderModal.value = true;
};
// Use this version of viewOrderDetails in your script to handle the bad data format.

// 1. 🚀 MODIFIED: Fetch 'updated_at' column
const fetchStockItems = async () => {
    stockLoading.value = true;
    stockError.value = null;
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, updated_at') // 👈 ADDED: updated_at field
            .order('brand', { ascending: true });

        if (error) throw error;

        // Populate the unfiltered list and calculate status
        unfilteredStockItems.value = data.map(item => { // RENAMED TO unfilteredStockItems
            let status;
            // 2. ⚡ NEW LOGIC: Based on user request (quantity < 12 -> Low, quantity > 12 -> In Stock, quantity == 0 -> Out of Stock)
            if (item.quantity === 0) {
                status = 'Out of Stock';
            } else if (item.quantity <= 12) { // Quantity is 1 to 12 inclusive
                status = 'Low Stock';
            } else { // Quantity is > 12
                status = 'In Stock';
            }

            // 3. 📅 NEW: Format the date and time
            const formattedTimestamp = item.updated_at
                ? new Date(item.updated_at).toLocaleString() // Format as local date and time
                : 'N/A';

            return {
                ...item,
                status: status,
                last_updated: formattedTimestamp, // 👈 ADDED: The new field for the column
            };
        });

    } catch (err) {
        stockError.value = 'Failed to load stock items.';
        console.error(err);
    } finally {
        stockLoading.value = false;
    }
};

// ----------------------------------------------------------------------
// 🚀 MODIFIED FUNCTION: Set Stock Filter
// Only allows 'All', 'Low Stock', or 'Out of Stock'
// ----------------------------------------------------------------------
const setStockFilter = (filter) => {
    if (['All', 'Low Stock', 'Out of Stock'].includes(filter)) {
        stockFilter.value = filter;
    }
};
// ----------------------------------------------------------------------

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
        // 🎯 NEW: Log this update (Since this is a manual action, log it immediately)
        createActivityLogEntry('User Management', 'UPDATE', `Super Admin username changed to ${editableUsername.value}.`);
    } catch (error) {
        alert(`Error updating username: ${error.message}`);
    } finally {
        isEditingUsername.value = false;
    }
};

const activeFeature = ref('dashboard');
const sidebarToggled = ref(false);
const isMobile = ref(false);

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
    // 🚀 NEW: Yearly Sales Data Structure
    yearlySales: { labels: [], datasets: [{ label: 'Yearly Sales (₱)', data: [], backgroundColor: 'orange', borderColor: '#dc3545', borderWidth: 1, borderRadius: 5, }], },
});

// --- CORE FUNCTION: UPDATED FETCH SALES REPORT DATA ---
const fetchSalesReport = async () => {
    salesLoading.value = true;
    salesError.value = null;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 💡 NEW: Calculate the date 30 days ago for the monthly product trend
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
    const date30DaysAgoString = date30DaysAgo.toISOString().split('T')[0];

    // Helper value for calculating dummy yearly sales (current month index)
    const currentMonthIndex = new Date().getMonth(); // 10 for November (0-indexed)

    // 🚀 Reset selected states and drilldown data
    selectedYear.value = null;
    selectedMonth.value = null;
    monthlySalesDrilldown.value = null;
    dailySalesDrilldown.value = null;

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

        // 2. Calculate Total Orders (Today) and Product Trend (Last 30 Days)
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
            // 🚀 MODIFIED: Filter for orders 30 days ago or later for Product Trend
            .gte('created_at', date30DaysAgoString)
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        let totalOrdersTodayCount = 0;
        const productTrendMap = {};

        if (orderItemsData) {
            orderItemsData.forEach(order => {
                // Only count total orders for TODAY (to keep the daily card accurate)
                const orderDate = new Date(order.created_at).toISOString().split('T')[0];
                if (orderDate === today) {
                    totalOrdersTodayCount++;
                }

                // Aggregate Product Trend (Sales by Tire Type) for the last 30 days
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

        // 3. Update Product Trend Chart (SALES BY TIRE TYPE - Live Data for 30 Days)
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
        // 5. MODIFIED LOGIC: Monthly Trend Chart (Full Year: Jan to Dec)
        // -----------------------------------------------------------
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Dummy data for Jan - Dec (Totaling roughly 6.6M before November's live data)
        const monthlyDataFullYearBase = [
            250000, 300000, 450000, 400000, 550000, 600000,
            750000, 700000, 850000, 900000, // Jan to Oct dummy data
            1000000, // Dummy for Nov, will be replaced by liveMonthlySales
            1100000 // Dummy for Dec, will be replaced by 0
        ];

        // Create an array that uses liveMonthlySales for the current month and future months are 0
        const finalMonthlyData = monthlyDataFullYearBase.map((dummyValue, index) => {
            if (index < currentMonthIndex) {
                // Past months use the provided dummy data
                return dummyValue;
            } else if (index === currentMonthIndex) {
                // Current month (November) uses the live data
                return liveMonthlySales;
            } else {
                // Future months (December) show 0
                return 0;
            }
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

// 🚀 MODIFIED FUNCTION: Fetch and populate Yearly Sales Chart Data (Dummy + Real-time Current Year)
const fetchYearlySales = () => {
    // Generate dummy data for the last 5 years
    const currentYear = new Date().getFullYear(); // 2025
    const currentMonthIndex = new Date().getMonth(); // 10 for November (0-indexed)
    const yearlyLabels = [];
    const yearlyData = [];

    // Simulate average past monthly sales from the existing dummy data
    const pastMonthlySalesDummy = [
        250000, 300000, 450000, 400000, 550000, 600000,
        750000, 700000, 850000, 900000, // Jan (0) to Oct (9)
    ];
    // Sum of Jan to Oct dummy sales: 5.75M
    const pastMonthsTotal = pastMonthlySalesDummy.reduce((sum, val) => sum + val, 0);

    // Past years' base sales
    const baseSales = 2000000;

    for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;
        yearlyLabels.push(year.toString());

        let salesAmount;
        if (i === 0) {
            // Current year (2025) is the sum of past dummy months + the live data for November
            // totalMonthlySales holds the real-time November sales figure (liveMonthlySales from fetchSalesReport)
            salesAmount = pastMonthsTotal + salesData.value.totalMonthlySales;
        } else {
            // Past years have higher, simulated annual sales (for the "growth" look)
            salesAmount = baseSales + (4 - i) * 500000 + (Math.random() * 200000);
        }
        yearlyData.push(Math.floor(salesAmount));
    }

    salesData.value.yearlySales.labels = yearlyLabels;
    salesData.value.yearlySales.datasets[0].data = yearlyData;
};

// ----------------------------------------------------------------------
// 🚀 NEW LOGIC: Drill-Down Functions (UNCHANGED)
// ----------------------------------------------------------------------

// Helper function to generate dummy monthly data for any given year
const generateMonthlyDataForYear = (year, totalYearlySales) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();

    // Use the actual current monthly sales for the current month if the year is 2025
    const liveMonthlySales = salesData.value.totalMonthlySales;

    // Base monthly sales calculation for historical dummy months
    // We estimate the sum of *dummy* past months + the live current month, and divide that by the number of active months in that year
    const activeMonths = year === currentYear ? currentMonthIndex + 1 : 12;
    const baseMonthlySale = totalYearlySales / activeMonths;


    const monthlyData = monthNames.map((month, index) => {
        if (year > currentYear || (year === currentYear && index > currentMonthIndex)) {
            return 0; // Future months/years are 0
        }

        if (year === currentYear && index === currentMonthIndex) {
            // If the year is the current year and the month is the current month, use the live sales data.
            return liveMonthlySales;
        }

        // For all other months (past and past years), use a random variance on the calculated base.
        return Math.floor(baseMonthlySale * (0.8 + Math.random() * 0.4)); // +/- 20% variance
    });

    return { labels: monthNames, datasets: [{ label: `Monthly Sales ${year} (₱)`, data: monthlyData, backgroundColor: '#198754' }] };
};

// Helper function to generate dummy daily data for any given month/year
const generateDailyDataForMonth = (monthIndex, year, totalMonthlySales) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const dailyLabels = [];
    const dailyData = [];

    // For simplicity, we'll generate daily data for the whole month
    for (let i = 1; i <= daysInMonth; i++) {
        dailyLabels.push(`${monthIndex + 1}/${i}`);
        // Average daily sale is roughly totalMonthlySales / daysInMonth
        const avgDailySale = totalMonthlySales / daysInMonth;
        dailyData.push(Math.floor(avgDailySale * (0.5 + Math.random() * 1.0))); // +/- 50% variance
    }
    return { labels: dailyLabels, datasets: [{ label: `${monthNames[monthIndex]} Daily Sales (₱)`, data: dailyData, backgroundColor: '#0d6efd' }] };
};

// 1. Click on Yearly Sales Chart
const drillDownYearlySales = (event) => {
    if (!yearlySalesChart) return;

    const points = yearlySalesChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (points.length) {
        const firstPoint = points[0];
        const labelIndex = firstPoint.index;
        const year = yearlySalesChart.data.labels[labelIndex];
        const yearlyTotal = yearlySalesChart.data.datasets[0].data[labelIndex];

        selectedYear.value = year;
        selectedMonth.value = null; // Reset month selection
        dailySalesDrilldown.value = null; // Reset daily drilldown

        // Generate monthly data for the selected year
        monthlySalesDrilldown.value = generateMonthlyDataForYear(parseInt(year), yearlyTotal);

        // Re-render charts to show the new monthly drilldown
        nextTick(createCharts);
    }
};

// 2. Click on Monthly Sales Chart
const drillDownMonthlySales = (event) => {
    // Only allow drill-down if a year is already selected
    if (!selectedYear.value) {
        alert("Please click on a year in the 'Sales Trend (Past Years)' chart first.");
        return;
    }
    if (!salesTrendMonthlyChart) return;

    const points = salesTrendMonthlyChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    if (points.length) {
        const firstPoint = points[0];
        const labelIndex = firstPoint.index;
        const monthName = salesTrendMonthlyChart.data.labels[labelIndex];
        const monthlyTotal = salesTrendMonthlyChart.data.datasets[0].data[labelIndex];

        if (monthlyTotal === 0) {
            alert(`No sales data for ${monthName} ${selectedYear.value}.`);
            return;
        }

        selectedMonth.value = `${monthName} ${selectedYear.value}`;

        // Generate daily data for the selected month/year
        dailySalesDrilldown.value = generateDailyDataForMonth(labelIndex, parseInt(selectedYear.value), monthlyTotal);

        // Re-render charts to show the new daily drilldown
        nextTick(createCharts);
    }
};

// 3. Reset Monthly Drilldown to show the full monthly data for the selected year
const resetMonthlyDrilldown = () => {
    selectedMonth.value = null;
    dailySalesDrilldown.value = null;
    nextTick(createCharts);
}

// 4. Reset Yearly Drilldown to show the initial state (monthly trend for current year)
const resetYearlyDrilldown = () => {
    selectedYear.value = null;
    selectedMonth.value = null;
    monthlySalesDrilldown.value = null;
    dailySalesDrilldown.value = null;
    // Re-fetch or use existing data for the initial state
    fetchSalesReport();
};

// --- END OF NEW DRILL-DOWN LOGIC ---
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// 🚀 MODIFIED FUNCTION: Export Sales Report to CSV (Excel-Friendly)
// ----------------------------------------------------------------------
const exportSalesToCSV = async () => {
    if (!rawDeliveredOrders.value.length) {
        // Ensure we try to fetch the raw data if it wasn't loaded before
        await fetchRawDeliveredOrders();
    }

    // 1. Prepare Summary Data for CSV
    const summaryData = [
        { Metric: "Total Sales Today", Value: salesData.value.totalSalesToday },
        { Metric: "Total Orders Today", Value: salesData.value.totalOrdersToday },
        { Metric: "Total Sales Last 7 Days", Value: salesData.value.totalWeeklySales },
        { Metric: "Total Sales Last 30 Days", Value: salesData.value.totalMonthlySales },
    ];

    // 2. Prepare Product Trend Data for CSV
    const productTrendData = salesData.value.salesByTireType.labels.map((label, index) => ({
        'Product Brand': label,
        'Revenue Last 30 Days (₱)': salesData.value.salesByTireType.datasets[0].data[index],
    }));

    // 3. Helper function to convert JSON array to CSV format
    const convertToCSV = (data, title) => {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        let csv = `\n"${title}"\n`; // Add a title row
        csv += headers.map(header => `"${header}"`).join(',') + '\n'; // Add header row (quoted for safety)

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Quote values and escape internal double quotes for safety
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csv += values.join(',') + '\n';
        });
        return csv;
    };

    // 4. Combine All CSV Sections
    let finalCSV = "";
    finalCSV += convertToCSV(summaryData, 'Sales Summary');
    finalCSV += convertToCSV(productTrendData, 'Product Trend by Revenue (Last 30 Days)');
    finalCSV += convertToCSV(rawDeliveredOrders.value, 'Detailed Delivered Orders Report');

    if (finalCSV.trim() === "") {
        alert("No data available to export.");
        return;
    }

    // 5. Trigger Download
    // Use 'text/csv;charset=utf-8; for compatibility with Excel
    const blob = new Blob(["\ufeff", finalCSV], { type: 'text/csv;charset=utf-8;' }); // \ufeff is the BOM for Excel
    const dateString = new Date().toISOString().split('T')[0];
    const filename = `iTyre_Sales_Report_${dateString}.csv`;

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Your browser does not support automatic downloads.');
    }

    alert(`✅ Sales Report successfully exported as ${filename}.`);
    // 🎯 NEW: Log the export action (Since this is a manual action, log it immediately)
    createActivityLogEntry('Sales Report', 'EXPORT', `Sales report exported as ${filename}.`);
};

// --- END OF CSV EXPORT LOGIC ---
// ----------------------------------------------------------------------


const fetchInitialData = () => {
    fetchStockItems();
    fetchPurchaseOrders();
    fetchSalesReport();
    fetchRawDeliveredOrders(); // 👈 NEW: Fetch detailed data on load
    fetchYearlySales(); // 👈 NEW: Fetch yearly sales data
    fetchSuperAdminProfile();
    fetchUsers();
}

const searchQuery = ref('');
const selectedStatus = ref('All');

// --- COMPUTED PROPERTIES (UNCHANGED) ---

// These now read directly from the fetched sales_data
const totalSalesToday = computed(() => salesData.value.totalSalesToday);
const totalOrdersToday = computed(() => salesData.value.totalOrdersToday);
const totalSalesLast7Days = computed(() => salesData.value.totalWeeklySales);
const totalSalesLast30Days = computed(() => salesData.value.totalMonthlySales);

const newUsersCount = computed(() => users.value.length);
// 🚀 MODIFIED: totalStock now uses the unfiltered data
const totalStock = computed(() => unfilteredStockItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0));
// 🚀 MODIFIED: lowStockCount now uses the unfiltered data
const lowStockCount = computed(() => unfilteredStockItems.value.filter(item => item.status === 'Low Stock').length);
// 🚀 REVERTED: productTypes counts all unique products
const productTypes = computed(() => unfilteredStockItems.value.length);
// 💡 NEW: Out of Stock Count
const outOfStockCount = computed(() => unfilteredStockItems.value.filter(item => item.status === 'Out of Stock').length);

// ----------------------------------------------------------------------
// 🚀 NEW COMPUTED PROPERTY: filteredAndSortedStockItems
// This handles both the filter and the custom sort order.
// ----------------------------------------------------------------------
const filteredAndSortedStockItems = computed(() => {
    let filtered = unfilteredStockItems.value;

    // 1. Apply Filtering based on stockFilter.value (Exclude 'In Stock' if filter is active)
    if (stockFilter.value !== 'All') {
        filtered = filtered.filter(item => item.status === stockFilter.value);
    }

    // 2. Apply Custom Sorting
    // Priority: Out of Stock (1) > Low Stock (2) > In Stock (3)
    const sortOrder = { 'Out of Stock': 1, 'Low Stock': 2, 'In Stock': 3 };

    return filtered.sort((a, b) => {
        const orderA = sortOrder[a.status] || 99; // Get priority or a high number
        const orderB = sortOrder[b.status] || 99;

        if (orderA !== orderB) {
            return orderA - orderB; // Sort by Status (1, 2, 3...)
        }

        // Secondary sort: alphabetical by brand
        return (a.brand || '').localeCompare(b.brand || '');
    });
});
// ----------------------------------------------------------------------


// --- UPDATED ORDER COUNTS (UNCHANGED) ---
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
let yearlySalesChart = null; // 🚀 NEW Chart Ref

// 🚀 MODIFIED FUNCTION: createCharts - Incorporates drill-down logic
const createCharts = () => {
    // Destroy existing charts to prevent memory leaks and chart stacking
    if (salesTrendChart) salesTrendChart.destroy();
    if (salesByTireTypeChart) salesByTireTypeChart.destroy();
    if (salesTrendMonthlyChart) salesTrendMonthlyChart.destroy();
    if (yearlySalesChart) yearlySalesChart.destroy(); // 🚀 NEW: Destroy yearly chart

    // ----------------------------------------------------------------------
    // 💡 CHART CONFIGURATION: Common Options for Data Labels and Tooltips
    // ----------------------------------------------------------------------
    const datalabelsPluginOptions = {
        // 🚨 FIX: Increase top padding in the layout options to allow space for the data labels
        layout: {
            padding: {
                top: 25 // Add 20px padding above the chart data area
            }
        },
        // 1. Tooltips (Hover effect) are disabled globally for all these charts
        tooltip: {
            enabled: false // 🛑 CRITICAL CHANGE: Disables hover tooltips
        },
        plugins: {
            // 2. Data labels are configured
            datalabels: {
                align: 'end',
                anchor: 'end',
                offset: 5, // A slight offset above the bar/pie slice
                color: '#333', // Dark text color
                font: {
                    weight: 'bold',
                    size: 10,
                },
                formatter: (value) => {
                    // Format as a simplified currency for display (e.g., ₱1.2M, ₱50K)
                    if (value >= 1000000) {
                        return '₱' + (value / 1000000).toFixed(1) + 'M';
                    } else if (value >= 1000) {
                        return '₱' + (value / 1000).toFixed(0) + 'K';
                    }
                    return '₱' + value.toLocaleString();
                }
            },
            legend: { display: false }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
        }
    };

    // --- 3. Product Trend Chart (Pie) ---
    const salesByTireTypeCtx = document.getElementById('salesByTireTypeChart');
    if (salesByTireTypeCtx && salesData.value.salesByTireType.labels.length > 0) {
        // Pie chart needs a separate datalabels configuration
        salesByTireTypeChart = new Chart(salesByTireTypeCtx, {
            type: 'pie',
            data: salesData.value.salesByTireType,
            options: {
                layout: {
                    padding: {
                        top: 0
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltip: { enabled: false }, // 🛑 DISABLE HOVER
                plugins: {
                    datalabels: {
                        formatter: (value, context) => {
                            // Display label for pie chart
                            const label = context.chart.data.labels[context.dataIndex];
                            return label;
                        },
                        color: '#fff',
                        font: { weight: 'bold', size: 12 },
                        textShadowBlur: 4,
                        textShadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    legend: { position: 'right' }
                }
            },
            plugins: [ChartDataLabels], // 👈 ADDED PLUGIN
        });
    }

    // --- 1. Yearly Sales Chart (Bar) ---
    // Change color of selected year bar
    const yearlyChartData = {
        ...salesData.value.yearlySales,
        datasets: [{
            ...salesData.value.yearlySales.datasets[0],
            backgroundColor: salesData.value.yearlySales.datasets[0].data.map((_, index) => {
                const year = salesData.value.yearlySales.labels[index];
                return year === selectedYear.value ? '#dc3545' : 'orange';
            })
        }]
    };
    const yearlySalesCtx = document.getElementById('yearlySalesChart');
    if (yearlySalesCtx) {
        yearlySalesChart = new Chart(yearlySalesCtx, {
            type: 'bar',
            data: yearlyChartData,
            options: datalabelsPluginOptions, // 👈 APPLIED CONFIG
            plugins: [ChartDataLabels], // 👈 ADDED PLUGIN
        });
    }

    // --- 2. Monthly Sales Trend Chart (Bar) ---
    const monthlyData = monthlySalesDrilldown.value || salesData.value.salesTrendMonthly;
    let monthlyChartData = { ...monthlyData };

    if (monthlyData.datasets && monthlyData.datasets.length > 0) {
        monthlyChartData.datasets = [{
            ...monthlyData.datasets[0],
            backgroundColor: monthlyData.labels.map((monthName, index) => {
                const currentMonthIndex = new Date().getMonth();
                const currentMonthName = monthlyData.labels[currentMonthIndex];

                // Highlight the selected month in drill-down mode, or highlight the current month in default view.
                if (selectedMonth.value) {
                    const selectedMonthName = selectedMonth.value.split(' ')[0];
                    return monthName === selectedMonthName ? '#0d6efd' : '#198754';
                }

                // If it's the current year and the default view, highlight the current month (November)
                const isCurrentYear = !selectedYear.value || parseInt(selectedYear.value) === new Date().getFullYear();
                if (isCurrentYear && monthName === currentMonthName && monthlyData.datasets[0].data[index] > 0) {
                    return '#0d6efd'; // Highlight current month (November) blue
                }

                return '#198754'; // Default green for other months
            })
        }];
    } else {
        // Fallback data structure if datasets is empty/missing
        monthlyChartData.datasets = [{ data: [], backgroundColor: [] }];
    }

    const salesTrendMonthlyCtx = document.getElementById('salesTrendMonthlyChart');
    if (salesTrendMonthlyCtx) {
        salesTrendMonthlyChart = new Chart(salesTrendMonthlyCtx, {
            type: 'bar',
            data: monthlyChartData,
            options: datalabelsPluginOptions, // 👈 APPLIED CONFIG
            plugins: [ChartDataLabels], // 👈 ADDED PLUGIN
        });
    }

    // --- 4. Daily Sales Trend Chart (Bar) ---
    const dailyData = dailySalesDrilldown.value || salesData.value.salesTrend;
    let dailyChartData = { ...dailyData };

    if (dailyData.datasets && dailyData.datasets.length > 0) {
        dailyChartData.datasets = [{
            ...dailyData.datasets[0],
            backgroundColor: dailyData.datasets[0].backgroundColor, // Use existing colors
        }];
    } else {
        // Fallback data structure if datasets is empty/missing
        dailyChartData.datasets = [{ data: [], backgroundColor: [] }];
    }

    const salesTrendCtx = document.getElementById('salesTrendChart');
    if (salesTrendCtx) {
        salesTrendChart = new Chart(salesTrendCtx, {
            type: 'bar',
            data: dailyChartData,
            options: datalabelsPluginOptions, // 👈 APPLIED CONFIG
            plugins: [ChartDataLabels], // 👈 ADDED PLUGIN
        });
    }
};

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

// 1. MODIFIED: Open the confirmation modal instead of an immediate confirm()
const deleteUser = async (userId, username) => {
    deleteError.value = '';
    superAdminPassword.value = '';
    userToDelete.value = { id: userId, username: username || 'N/A' };
    showDeleteConfirmationModal.value = true;
};

// 2. NEW FUNCTION: Handle the password confirmation and actual deletion
const confirmDeleteUser = async () => {
    deleteError.value = '';

    if (!superAdminPassword.value) {
        deleteError.value = 'Password is required.';
        return;
    }

    if (!userToDelete.value) {
        deleteError.value = 'No user selected for deletion.';
        return;
    }

    // 💡 Step 1: Get Super Admin's email (already fetched or retrieve it)
    const currentAdminEmail = superAdminProfile.value.email;

    if (!currentAdminEmail) {
        deleteError.value = 'Could not retrieve Super Admin email for verification.';
        return;
    }

    try {
        // ... (Supabase re-authentication logic is correct and remains here) ...
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: currentAdminEmail,
            password: superAdminPassword.value,
        });

        if (authError) {
            // ... (Authentication error handling remains here) ...
            if (authError.message.includes('Invalid login credentials') || authError.status === 400) {
                deleteError.value = '🚨 Incorrect Super Admin password. Try again.';
            } else {
                deleteError.value = `Verification failed: ${authError.message}`;
            }
            return;
        }

        // 💡 Step 3a: Password verified! Retrieve the target user's email before deletion.
        const userId = userToDelete.value.id;
        const username = userToDelete.value.username;

        const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', userId)
            .single();

        if (profileError || !userProfile || !userProfile.email) {
             // We can proceed with deletion even if email fails to fetch, but log the error.
             console.error('Warning: Failed to retrieve user email for notification.', profileError);
        }

        const userEmail = userProfile ? userProfile.email : null;


        // 💡 Step 3b: Proceed with deletion using the RPC
        const { error: deleteErrorResult } = await supabase.rpc('delete_user_by_id', { p_user_id: userId });

        if (deleteErrorResult) {
            alert(`Failed to delete user: ${deleteErrorResult.message}`);
        } else {
            alert(`✅ User "${username}" has been successfully deleted.`);

            // 🎯 NEW: Log user deletion
            createActivityLogEntry('User Management', 'DELETE', `User **${username}** has been deleted.`);

            // ----------------------------------------------------
            // 🚀 NEW LOGIC: Send Inactivity Email Notification
            // ----------------------------------------------------
            if (userEmail) {
                console.log(`Attempting to send deletion email to ${userEmail}...`);
                await sendAccountDeletionEmail(userEmail, username);
            }
        }

        // 💡 Step 4: Close modal and reset state
        cancelDeleteProcedure();

    } catch (err) {
        console.error('Error during re-authentication or deletion:', err);
        deleteError.value = `An unexpected error occurred: ${err.message}`;
    }
};

// 3. NEW FUNCTION: Close and reset the modal state
const cancelDeleteProcedure = () => {
    showDeleteConfirmationModal.value = false;
    userToDelete.value = null;
    superAdminPassword.value = '';
    deleteError.value = '';
};

const sendAccountDeletionEmail = async (toEmail, username) => {
    // 1. Construct the message payload (unchanged)
    const payload = {
        toEmail: toEmail,
        subject: `[iTyre] Account Deletion Notification`,
        htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h4>Your iTyre account has been deleted.</h4>
                <p>This is to confirm that the account associated with the username **${username}** and email **${toEmail}** has been permanently deleted by the Super Admin.</p>
                <p>If you believe this was an error, please contact support immediately.</p>
            </div>
        `,
    };

    try {
        const response = await fetch(EMAIL_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // --- 🚨 CRITICAL FIX: Add the Authorization header ---
                // Supabase requires the public anon key for direct public function calls.
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY, // Often needed for functions as well
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'No detailed error message from server.' }));
            throw new Error(`Server status ${response.status}: ${errorData.message}`);
        }

        console.log(`Email successfully queued for ${toEmail}.`);

    } catch (error) {
        console.error('🚨 Failed to send account deletion email: Missing authorization header', error.message);
    }
};

onMounted(() => {
    // 1. Initial Data Fetch
    fetchInitialData();
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 🔔 NEW: Add event listener to clear badge when the dropdown is shown
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    if (notificationsDropdown) {
        notificationsDropdown.addEventListener('shown.bs.dropdown', resetNotificationCount);
    }

    // 2. ❌ REMOVED: Start the auto-refresh cycle
    // startAutoRefresh();

    // 3. 🌟 Setup Real-time Subscriptions (from your existing code + Stock)

    // Real-time for Users/Profiles (triggers fetchUsers AND logs activity)
    userManagementChannel = supabase
        .channel('public:profiles')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            (payload) => {
                fetchUsers();
                // 🎯 NEW ACTIVITY LOGIC
                const record = payload.new || payload.old;
                if (record) {
                    let message = '';
                    const username = record.username || 'a user';
                    if (payload.eventType === 'INSERT') {
                        message = `New user **${username}** created with role **${record.role}**.`;
                    } else if (payload.eventType === 'UPDATE') {
                        // Log role change or other profile updates
                        const oldRecord = payload.old;
                        if (oldRecord && oldRecord.role !== record.role) {
                            message = `User **${username}** role changed from **${oldRecord.role}** to **${record.role}**.`;
                        } else {
                            message = `User **${username}** profile data was updated.`;
                        }
                    } else if (payload.eventType === 'DELETE') {
                        // NOTE: Manual delete via confirmDeleteUser already logs, but this covers other deletes.
                        message = `User **${username}** account was deleted.`;
                    }
                    if (message) {
                        createActivityLogEntry('User Management', payload.eventType, message);
                    }
                }
            }
        )
        .subscribe();

    // Real-time for Orders (triggers order & sales refresh AND logs activity)
    ordersChannel = supabase
        .channel('orders_updates')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            (payload) => {
                fetchPurchaseOrders();
                fetchSalesReport();
                fetchRawDeliveredOrders(); // 👈 NEW: Refresh raw data on sale

                // 🎯 NEW ACTIVITY LOGIC
                const record = payload.new || payload.old;
                if (record) {
                    let message = '';
                    const orderId = record.order_id || 'N/A';
                    const username = record.username || 'a customer';
                    if (payload.eventType === 'INSERT') {
                        message = `New Order #${orderId} placed by **${username}** (Status: **${record.status}**).`;
                    } else if (payload.eventType === 'UPDATE') {
                        // Log status change
                        const oldRecord = payload.old;
                        if (oldRecord && oldRecord.status !== record.status) {
                            message = `Order #${orderId} status updated from **${oldRecord.status}** to **${record.status}**.`;
                        } else {
                            message = `Order #${orderId} details were updated.`;
                        }
                    }
                    if (message) {
                        createActivityLogEntry('Purchased Orders', payload.eventType, message);
                    }
                }
            }
        )
        .subscribe();

    // 🌟 NEW: Real-time for Products/Stock (triggers stock refresh AND logs activity)
    stockChannel = supabase
        .channel('stock_updates')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            (payload) => {
                fetchStockItems();
                // 🎯 NEW ACTIVITY LOGIC
                const record = payload.new || payload.old;
                if (record) {
                    let message = '';
                    const productBrand = `${record.brand} - ${record.size || 'N/A'}`;
                    if (payload.eventType === 'INSERT') {
                        message = `New product **${productBrand}** added to stock.`;
                    } else if (payload.eventType === 'UPDATE') {
                        const oldRecord = payload.old;
                        let changeDetails = [];

                        if (oldRecord && oldRecord.quantity !== record.quantity) {
                            changeDetails.push(`Quantity changed from ${oldRecord.quantity} to ${record.quantity}`);
                        }
                        if (changeDetails.length > 0) {
                            message = `Stock for **${productBrand}** updated: ${changeDetails.join(', ')}.`;
                        } else {
                            message = `Product details for **${productBrand}** were updated.`;
                        }
                    } else if (payload.eventType === 'DELETE') {
                        message = `Product **${productBrand}** was removed from stock.`;
                    }
                    if (message) {
                        createActivityLogEntry('Stock Monitoring', payload.eventType, message);
                    }
                }
            }
        )
        .subscribe();


    nextTick(() => {
        if (activeFeature.value === 'sales-report' || activeFeature.value === 'dashboard') {
            createCharts();
        }
    });
});


onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);

    // 🔔 NEW: Remove event listener cleanup for notifications
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    if (notificationsDropdown) {
        notificationsDropdown.removeEventListener('shown.bs.dropdown', resetNotificationCount);
    }

    // ❌ REMOVED: stopAutoRefresh();

    if (salesTrendChart) salesTrendChart.destroy();
    if (salesByTireTypeChart) salesByTireTypeChart.destroy();
    if (salesTrendMonthlyChart) salesTrendMonthlyChart.destroy();
    if (yearlySalesChart) yearlySalesChart.destroy(); // 🚀 NEW: Cleanup yearly chart

    // 🌟 CLEANUP: Remove all channels
    if (userManagementChannel) { supabase.removeChannel(userManagementChannel); }
    if (ordersChannel) { supabase.removeChannel(ordersChannel); }
    if (stockChannel) { supabase.removeChannel(stockChannel); }
});

watch(activeFeature, (newFeature) => {
    if (newFeature === 'sales-report' || newFeature === 'dashboard') {
        nextTick(() => {
            createCharts();
        });
    }
});
</script>