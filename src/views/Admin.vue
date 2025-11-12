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
            <li class="nav-item dropdown">
              <a
                class="nav-link"
                href="#"
                @click.prevent="toggleNotificationsDropdown"
                :class="{ 'active': notificationsDropdownOpen }"
                ref="notificationDropdownToggle"
              >
                <i class="fas fa-bell me-1"></i>
                Notifications
                <span v-if="unreadNotificationsCount > 0" class="badge bg-danger rounded-pill">{{ unreadNotificationsCount }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" v-show="notificationsDropdownOpen" style="min-width: 300px;">
                <li><h6 class="dropdown-header">Realtime Updates ({{ notifications.length }})</h6></li>
                <li v-if="notifications.length === 0">
                  <span class="dropdown-item text-muted small">No recent activity.</span>
                </li>
                <li v-for="(notif, index) in notifications.slice(0, 5)" :key="index">
                  <a
                    class="dropdown-item d-flex align-items-start"
                    href="#"
                    @click.prevent="markAsRead(index, notif.view)"
                    :class="{ 'fw-bold': !notif.read }"
                  >
                    <i :class="[notif.icon, 'me-2 mt-1', notif.iconColor]"></i>
                    <div style="white-space: normal; line-height: 1.2;">
                      {{ notif.message }}
                      <small class="d-block text-muted">{{ notif.timeAgo }}</small>
                    </div>
                  </a>
                </li>
                <li v-if="notifications.length > 0"><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item text-center small" href="#" @click.prevent="clearAllNotifications">Clear All</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                ref="adminDropdownToggle"
                @click.prevent="toggleDesktopAdminMenu"
              >
                <i class="fas fa-user-circle me-1"></i> {{ currentUser.username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" v-show="desktopAdminDropdownOpen">
                <li><a class="dropdown-item" href="#" @click.prevent="showProfileModal = true">Profile</a></li>
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
            <li v-if="isMobile" class="nav-item mt-2">
              <div class="nav-link text-white py-2 px-3 d-flex align-items-center justify-content-between" @click="toggleAdminMenu" style="cursor: pointer;">
                <div>
                  <i class="fas fa-user-circle me-2"></i>
                  <span>{{ currentUser.username }}</span>
                </div>
                <i :class="adminMenuOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </div>
              <ul v-if="adminMenuOpen" class="ps-4 mt-2">
                <li><a class="text-white d-block py-1" href="#" @click.prevent="showProfileModal = true; closeSidebar();">Profile</a></li>
                <li><a class="text-white d-block py-1" href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>
            <li v-if="isMobile" class="nav-item mt-2">
              <a class="nav-link text-white py-2 px-3 d-flex align-items-center justify-content-between" href="#" @click.prevent="toggleNotificationsDropdown">
                <div class="d-flex align-items-center">
                  <i class="fas fa-bell me-2"></i>
                  <span>Notifications</span>
                </div>
                <span v-if="unreadNotificationsCount > 0" class="badge bg-danger rounded-pill">{{ unreadNotificationsCount }}</span>
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
                  <p class="card-text fs-4 fw-bold">{{ totalProductsCount }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm border-0 rounded-lg">
                <div class="card-body text-center">
                  <i class="fas fa-arrow-alt-circle-down fa-3x text-success mb-3"></i>
                  <h5 class="card-title">Stock In Today</h5>
                  <p class="card-text fs-4 fw-bold">{{ stockInTodayCount }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card shadow-sm border-0 rounded-lg">
                <div class="card-body text-center">
                  <i class="fas fa-arrow-alt-circle-up fa-3x text-danger mb-3"></i>
                  <h5 class="card-title">Stock Out Today</h5>
                  <p class="card-text fs-4 fw-bold">{{ stockOutTodayCount }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card shadow-sm border-0 rounded-lg mt-4">
            <div class="card-header bg-white text-dark fw-bold">Recent Activities</div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="item in recentActivities" :key="item.barcode_id">
                  <i class="fas fa-arrow-alt-circle-down text-success me-2"></i> {{ item.product_name }} (Qty: {{ item.quantity }}) received.
                </li>
                <li v-if="!recentActivities.length" class="list-group-item text-muted">No recent stock-in activities.</li>
              </ul>
            </div>
          </div>
        </div>

        <div v-if="currentView === 'Stock In'">
          <div class="card shadow-sm border-0 rounded-lg mb-4">
            <div class="card-header bg-white text-dark fw-bold">Record New Stock In</div>
            <div class="card-body">
              <form @submit.prevent="prepareStockIn">
                <div class="mb-3">
                  <label for="productNameIn" class="form-label">Product (Brand)</label>
                  <select class="form-select" id="productNameIn" v-model="stockIn.productName" required>
                    <option disabled value="">Please select a product</option>
                    <option v-for="product in availableProducts" :key="product.id" :value="product.brand">
                      {{ product.brand }} (Current Size: {{ product.size }})
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="sizeIn" class="form-label">New Size</label>
                  <input type="text" class="form-control" id="sizeIn" v-model="stockIn.size" required>
                </div>
                <div class="mb-3">
                  <label for="quantityIn" class="form-label">Quantity to Add</label>
                  <input type="number" class="form-control" id="quantityIn" v-model="stockIn.quantity" min="1" required>
                </div>
                <div class="mb-3">
                    <label for="supplierIn" class="form-label">Supplier</label>
                    <input type="text" class="form-control" id="supplierIn" v-model="stockIn.supplier" pattern="[A-Za-z\s]+" title="Only letters and spaces are allowed">
                </div>
                <div class="mb-3">
                  <label for="dateTimeIn" class="form-label">Date and Time</label>
                  <input type="datetime-local" class="form-control" id="dateTimeIn" v-model="stockIn.dateTime" required>
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
                      <th>Size</th>
                      <th>Quantity</th>
                      <th>Supplier</th>
                      <th>Date and Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in stockInHistory" :key="item.barcode_id">
                      <td>{{ item.product_name }}</td>
                      <td>{{ item.size }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.supplier }}</td>
                      <td>{{ new Date(item.date_and_time).toLocaleString() }}</td>
                    </tr>
                    <tr v-if="!stockInHistory.length"><td colspan="5" class="text-center text-muted">No records yet.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentView === 'Stock Out'">
          <div class="alert alert-info" role="alert">
            Fulfill orders by scanning the product's barcode to confirm shipment.
          </div>
          <div v-if="activeOrders.length === 0 && !isStockOutLoading" class="card text-center p-5 bg-light">
            <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h4 class="fw-bold">No Processed Orders Awaiting Shipment</h4>
            <p class="text-muted">Orders with 'Order Processed' or 'Shipped' status will appear here.</p>
          </div>

          <div v-if="isStockOutLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
          </div>

          <div v-else class="row">
            <div class="col-md-6 col-lg-4 mb-4" v-for="order in activeOrders" :key="order.order_id">
              <div
                class="card h-100 shadow-sm"
                :class="{
                  // BORDER COLOR
                  'border-warning': order.status === 'Order Processed', // ORANGE
                  'border-info': order.status === 'Shipped',           // YELLOW/BLUE
                  'border-success': order.status === 'Delivered'       // GREEN
                }"
              >
                <div
                  class="card-header fw-bold"
                  :class="{
                    // HEADER COLOR
                    'bg-warning text-dark': order.status === 'Order Processed', // ORANGE
                    'bg-info text-white': order.status === 'Shipped',           // YELLOW/BLUE
                    'bg-success text-white': order.status === 'Delivered'       // GREEN
                  }"
                >
                  Order #{{ order.order_id.slice(0, 8) }}
                </div>
                <div class="card-body">
                  <h5 class="card-title fw-bold text-primary mb-3">
                    <i class="fas fa-box me-2"></i>
                    {{ getOrderProductDetails(order.order_items) }}
                  </h5>
                  <p class="card-text mb-1">
                    <i class="fas fa-phone me-2 text-muted"></i>
                    {{ order.contact || 'Phone Missing' }}
                  </p>
                  <p class="card-text mb-2">
                    <i class="fas fa-credit-card me-2 text-primary"></i>
                    <strong class="text-dark">{{ order.payment_method || 'N/A' }}</strong>
                  </p>
                  <p class="card-text mb-2 small text-muted">
                    <i class="fas fa-map-marker-alt me-2"></i>
                    {{ order.shipping_address ? order.shipping_address.substring(0, 40) : 'Address Missing' }}
                    <span v-if="order.shipping_address && order.shipping_address.length > 40">...</span>
                  </p>

                  <button
                      class="btn w-100 mt-2"
                      :class="{
                          // BUTTON COLOR
                          'btn-warning text-dark': order.status === 'Order Processed', // ORANGE
                          'btn-info': order.status === 'Shipped',                     // YELLOW/BLUE
                          'btn-success': order.status === 'Delivered'                 // GREEN
                      }"
                      @click="
                          order.status === 'Delivered' ? openConfirmDeliveryModal(order) :
                          order.status === 'Order Processed' ? startScanForOrder(order) : openConfirmDeliveryModal(order)
                      "
                      :disabled="order.status === 'Delivered' || isDelivering === order.order_id"
                  >
                    <i
                        :class="{
                            'fas fa-barcode me-2': order.status === 'Order Processed',
                            'fas fa-truck me-2': order.status === 'Shipped',
                            'fas fa-check-circle me-2': order.status === 'Delivered'
                        }"
                    ></i>
                    {{
                        order.status === 'Delivered' ? 'Delivery Confirmed' :
                        order.status === 'Shipped' ? 'Confirm Delivery' :
                        'Take Order & Scan'
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showProfileModal" class="custom-modal-overlay">
      <div class="custom-modal-card card shadow-lg">
        <div class="card-header bg-primary text-white text-center">
          <h5 class="mb-0"><i class="fas fa-user-circle me-2"></i> User Profile</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="saveProfile">
            <div class="mb-3">
              <label for="profileUsername" class="form-label fw-bold">Username</label>
              <input type="text" class="form-control" id="profileUsername" v-model="editableUser.username" required>
            </div>
            <div class="mb-4">
              <label for="profileEmail" class="form-label fw-bold">Email</label>
              <input type="email" class="form-control" id="profileEmail" :value="currentUser.email" disabled>
              <div class="form-text">Email cannot be changed here.</div>
            </div>
            <div class="d-flex justify-content-end gap-3">
              <button type="button" class="btn btn-secondary" @click="cancelProfileEdit">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="showLogoutModal" class="custom-modal-overlay">
      <div class="custom-modal-card card shadow-lg">
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

    <div v-if="showBarcodeModal" class="custom-modal-overlay">
      <div class="custom-modal-card card shadow-lg" style="max-width: 400px;">
        <div class="card-header bg-primary text-white text-center">
          <h5 class="mb-0"><i class="fas fa-barcode me-2"></i> Confirm Stock In & Print Labels</h5>
          <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-2" @click="closeBarcodePrintModal" aria-label="Close"></button>
        </div>
        <div class="card-body text-center" v-if="itemToPrint">
          <p class="lead">You are about to validate and commit this entry:</p>

          <ul class="list-group list-group-flush text-start mb-3">
              <li class="list-group-item"><strong>Product:</strong> {{ itemToPrint.productName }} ({{ itemToPrint.size }})</li>
              <li class="list-group-item"><strong>Quantity:</strong> {{ itemToPrint.quantity }} units</li>
              <li class="list-group-item"><strong>Batch ID:</strong> {{ itemToPrint.barcodeBase.slice(0, 15) }}...</li>
          </ul>

          <div class="d-flex justify-content-center gap-3 mt-4">
            <button class="btn btn-secondary" @click="closeBarcodePrintModal">Cancel Stock In</button>

            <button class="btn btn-primary" @click="validateAndLogStockIn">
              <i class="fas fa-print me-2"></i> Print All Labels
            </button>
          </div>
        </div>
        <div class="card-body text-center text-danger" v-else>
            <p>Error: Stock data not found. Please try recording the stock in again.</p>
        </div>
      </div>
    </div>

    <div v-if="showScanModal" class="custom-modal-overlay">
      <div class="custom-modal-card card shadow-lg" style="max-width: 600px;">
        <div class="card-header bg-primary text-white text-center">
          <h5 class="mb-0"><i class="fas fa-qrcode me-2"></i> Scan Product Barcode</h5>
        </div>
        <div class="card-body">
          <p class="text-center text-muted">Scan **{{ getOrderProductDetails(orderToFulfill.order_items) }}** for Order #{{ orderToFulfill.order_id.slice(0, 8) }}.</p>

          <div id="scanner-container" class="mb-3">
            <video id="scanner-video" style="width: 100%; height: 100%; object-fit: cover;"></video>
          </div>
          <div class="alert alert-warning" v-if="scanStatusMessage">{{ scanStatusMessage }}</div>

          <div class="d-flex justify-content-center gap-3 mt-4">
            <button class="btn btn-secondary" @click="closeScanModal">
              <i class="fas fa-times me-2"></i> Cancel Scan
            </button>
            <button class="btn btn-warning" @click="captureBarcode" :disabled="isProductScanned">
              <i class="fas fa-camera me-2"></i> Capture Barcode
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isProductScanned && orderToFulfill && !showScanModal" class="custom-modal-overlay">
      <div class="custom-modal-card card shadow-lg" style="max-width: 450px;">
        <div class="card-header bg-success text-white text-center">
          <h5 class="mb-0"><i class="fas fa-check-circle me-2"></i> Confirm Order Details</h5>
        </div>
        <div class="card-body text-center">
          <p class="lead">All required items are ready for shipment!</p>
          <p>Confirm shipment for Order #{{ orderToFulfill.order_id.slice(0, 8) }}.</p>
          <div class="d-flex justify-content-center gap-3 mt-4">
            <button class="btn btn-secondary" @click="closeScanModal">Cancel</button>
            <button class="btn btn-success" @click="updateStockOut">
              <i class="fas fa-shipping-fast me-2"></i> Ship & Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeliveryConfirmationModal" class="custom-modal-overlay" style="z-index: 1060;"></div>
    <div class="modal fade" :class="{ 'show': showDeliveryConfirmationModal }" style="display: block; z-index: 1070;" v-if="showDeliveryConfirmationModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold">Confirm Order Delivery</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeConfirmDeliveryModal"></button>
          </div>
          <div class="modal-body text-center">
            <i class="fas fa-truck-loading fa-3x text-success mb-3"></i>
            <p class="lead fw-semibold">Confirm final delivery for Order #{{ orderToFulfill ? orderToFulfill.order_id.slice(0, 8) : 'N/A' }}?</p>
            <p class="text-muted small">
              This action will mark the order as **DELIVERED**.
            </p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" @click="closeConfirmDeliveryModal">Cancel</button>
            <button
              type="button"
              class="btn btn-success"
              @click="confirmDeliverySuccessAdmin"
              :disabled="isDelivering === orderToFulfill?.order_id"
            >
              <span v-if="isDelivering === orderToFulfill?.order_id" class="spinner-border spinner-border-sm me-2"></span>
              Order Delivered
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isMobile && notificationsDropdownOpen" class="custom-modal-overlay" style="z-index: 9999;">
        <div class="custom-modal-card card shadow-lg" style="max-width: 450px;">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="fas fa-bell me-2"></i> Realtime Updates</h5>
                <button type="button" class="btn-close btn-close-white" @click="notificationsDropdownOpen = false"></button>
            </div>
            <div class="card-body p-0">
                <ul class="list-group list-group-flush">
                    <li v-if="notifications.length === 0" class="list-group-item text-center text-muted py-3">
                        No recent activity.
                    </li>
                    <li v-for="(notif, index) in notifications.slice(0, 10)" :key="index" :class="{ 'bg-light': !notif.read }">
                        <a
                            class="list-group-item list-group-item-action d-flex align-items-start"
                            href="#"
                            @click.prevent="markAsRead(index, notif.view)"
                        >
                            <i :class="[notif.icon, 'me-3 mt-1', notif.iconColor]" style="font-size: 1.2em;"></i>
                            <div style="flex-grow: 1;">
                                <p class="mb-0" :class="{ 'fw-bold': !notif.read }">{{ notif.message }}</p>
                                <small class="text-muted">{{ notif.timeAgo }}</small>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="card-footer text-center">
                <button class="btn btn-sm btn-outline-secondary w-100" @click="clearAllNotifications">Clear All Notifications</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
/* ============================================================
    Admin Dashboard Vue Component - Realtime Edition (with Notifications)
============================================================ */

import { supabase } from '../server/supabase';
import { nextTick } from 'vue';
import JsBarcode from 'jsbarcode';
import Quagga from '@ericblade/quagga2';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

// NOTE: Since this is outside a setup() function, we keep the router variable initialization here.
const router = useRouter();

export default {
    name: 'AdminDashboard',

    /* ============================================================
      ROUTE GUARD
    ============================================================ */
    beforeRouteLeave(to, from, next) {
        const allowedExitRoutes = ['login', 'signup'];

        if (allowedExitRoutes.includes(to.name)) {
            next();
            return;
        }

        const answer = window.confirm(
            'Are you sure you want to leave? This will end your session for security.'
        );

        if (answer) {
            supabase.auth.signOut().then(() => {
                next(false);
                window.location.href = '/login';
            });
        } else {
            next(false); // Cancel navigation
        }
    },

    /* ============================================================
      DATA PROPERTIES (UPDATED)
    ============================================================ */
    data() {
        return {
            // ** 🚀 REALTIME CHANNELS **
            orderChannel: null,
            stockInChannel: null,
            timeAgoInterval: null,

            // 🔔 NOTIFICATION STATE (NEW)
            notifications: [],
            notificationsDropdownOpen: false,

            // --- UI State ---
            isCollapsed: false,
            isSidebarVisible: false,
            isMobile: false,
            adminMenuOpen: false,
            desktopAdminDropdownOpen: false,
            lastDetectedCode: null,
            autoDetect: true,
            showLogoutModal: false,
            showProfileModal: false,
            showBarcodeModal: false, // Print Modal
            showScanModal: false,
            showDeliveryConfirmationModal: false,
            isDelivering: null,

            // --- Loading / Scan State ---
            isStockOutLoading: false,
            isProductScanned: false,
            scanStatusMessage: 'Awaiting camera initialization...',
            isProcessingScan: false,
            orderItemsScanned: {},

            // ** NEW: Draft state for Stock In before validation **
            stockInDraft: null,
            itemToPrint: null, // Used for print modal, populated from stockInDraft

            // --- Dashboard / Views ---
            currentView: 'Dashboard',
            totalProductsCount: 0,
            stockInTodayCount: 0,
            stockOutTodayCount: 0,
            recentActivities: [],
            availableProducts: [],
            activeOrders: [],
            menuItems: [
                { icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
                { icon: 'fas fa-boxes', label: 'Stock In' },
                { icon: 'fas fa-truck-loading', label: 'Stock Out' }
            ],

            // --- User Info ---
            currentUser: { username: 'Loading...', email: 'loading@app.com', id: null },
            editableUser: { username: 'Loading...' },

            // --- Stock In Form ---
            stockIn: {
                productName: '',
                size: '',
                quantity: 1,
                supplier: '',
                dateTime: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000))
                    .toISOString()
                    .slice(0, 16)
            },
            stockInHistory: [],
            orderToFulfill: null
        };
    },

    /* ============================================================
      COMPUTED PROPERTIES
    ============================================================ */
    computed: {
        // 🔔 NEW: Counts unread notifications
        unreadNotificationsCount() {
            return this.notifications.filter(n => !n.read).length;
        },
        totalItemsToScan() {
            if (!this.orderToFulfill || !this.orderToFulfill.order_items) return 0;
            return this.orderToFulfill.order_items.reduce((total, item) => total + item.quantity, 0);
        },
        totalItemsScanned() {
            return Object.values(this.orderItemsScanned).reduce((total, count) => total + count, 0);
        },
        scannedItemsList() {
            if (!this.orderToFulfill || !this.orderToFulfill.order_items) return [];

            return this.orderToFulfill.order_items.map(item => {
                const productName = item.products ? item.products.brand : 'Unknown Product';
                const required = item.quantity;
                const scanned = this.orderItemsScanned[item.products.id] || 0;

                return {
                    name: productName,
                    required: required,
                    scanned: scanned,
                    isComplete: scanned >= required
                };
            });
        },
        getOrderProductDetails() {
            return (items) => {
                if (!items || items.length === 0) return 'No items found.';
                return items.map(item => {
                    const brand = item.products ? item.products.brand : 'Unknown Product';
                    const size = item.products ? item.products.size : 'N/A';
                    return `${brand} (${size}) x${item.quantity}`;
                }).join(', ');
            };
        }
    },

    /* ============================================================
      METHODS
    ============================================================ */
    methods: {

        // ** 🚀 REAL-TIME SUBSCRIPTION MANAGEMENT (UPDATED) **
        setupRealtimeSubscriptions() {
            console.log('Setting up Supabase real-time subscriptions...');

            // 1. Subscribe to 'orders' for Stock Out/Shipping view updates AND Notifications
            this.orderChannel = supabase
                .channel('admin_orders')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'orders' },
                    (payload) => {
                        console.log('Realtime Order Change:', payload.eventType);
                        this.fetchProcessedOrders();
                        this.handleOrderNotification(payload); // 🔔 Notification handler
                    }
                )
                .subscribe();

            // 2. Subscribe to 'stock_in' for Dashboard and Stock In History updates AND Notifications
            this.stockInChannel = supabase
                    .channel('admin_stock_in')
                    .on(
                        'postgres_changes',
                        { event: 'INSERT', schema: 'public', table: 'stock_in' }, // Only INSIDE for Stock In
                        (payload) => {
                            console.log('Realtime Stock In Change:', payload.eventType);
                            this.fetchDashboardData();
                            this.fetchStockInHistory();
                            this.handleStockInNotification(payload); // 🔔 Notification handler
                        }
                    )
                    .subscribe();
        },

        removeRealtimeSubscriptions() {
            console.log('Removing Supabase real-time subscriptions...');
            if (this.orderChannel) {
                supabase.removeChannel(this.orderChannel);
                this.orderChannel = null;
            }
            if (this.stockInChannel) {
                supabase.removeChannel(this.stockInChannel);
                this.stockInChannel = null;
            }
        },

        /* ============================
          🔔 NOTIFICATION METHODS (UNCHANGED)
          ============================ */
        timeSince(date) {
            const seconds = Math.floor((new Date() - date) / 1000);
            let interval = seconds / 31536000;
            if (interval > 1) return Math.floor(interval) + " years ago";
            interval = seconds / 2592000;
            if (interval > 1) return Math.floor(interval) + " months ago";
            interval = seconds / 86400;
            if (interval > 1) return Math.floor(interval) + " days ago";
            interval = seconds / 3600;
            if (interval > 1) return Math.floor(interval) + " hours ago";
            interval = seconds / 60;
            if (interval > 1) return Math.floor(interval) + " minutes ago";
            return Math.floor(seconds) + " seconds ago";
        },

        addNotification(message, icon, iconColor, view) {
            this.notifications.unshift({
                message,
                icon,
                iconColor,
                view,
                read: false,
                timestamp: new Date(),
                timeAgo: this.timeSince(new Date())
            });
            // Keep the list manageable (e.g., max 10 temporary notifications)
            if (this.notifications.length > 10) {
                this.notifications.pop();
            }
        },

        handleOrderNotification(payload) {
            const newOrder = payload.new;
            const oldOrder = payload.old;
            const event = payload.eventType;

            if (event === 'INSERT' && newOrder.status === 'Order Processed') {
                this.addNotification(
                    `New Order #${String(newOrder.order_id).slice(0, 8)} needs processing.`,
                    'fas fa-plus-circle',
                    'text-success',
                    'Stock Out'
                );
            } else if (event === 'UPDATE') {
                if (newOrder.status === 'Shipped' && oldOrder.status === 'Order Processed') {
                    this.addNotification(
                        `Order #${String(newOrder.order_id).slice(0, 8)} is Shipped and out for delivery.`,
                        'fas fa-truck',
                        'text-info',
                        'Stock Out'
                    );
                } else if (newOrder.status === 'Delivered' && oldOrder.status === 'Shipped') {
                    this.addNotification(
                        `Order #${String(newOrder.order_id).slice(0, 8)} delivery confirmed.`,
                        'fas fa-check-double',
                        'text-success',
                        'Stock Out'
                    );
                }
            }
        },

        handleStockInNotification(payload) {
            const newStockIn = payload.new;
            if (payload.eventType === 'INSERT') {
                this.addNotification(
                    `Stock In: ${newStockIn.product_name} (${newStockIn.size}) +${newStockIn.quantity} units.`,
                    'fas fa-box',
                    'text-primary',
                    'Stock In'
                );
            }
        },

        toggleNotificationsDropdown() {
            this.notificationsDropdownOpen = !this.notificationsDropdownOpen;
            if (this.notificationsDropdownOpen) {
                // Update timeAgo on open
                this.notifications = this.notifications.map(n => ({
                    ...n,
                    timeAgo: this.timeSince(n.timestamp)
                }));
            }
        },

        markAsRead(index, view) {
            if (this.notifications[index]) {
                this.notifications[index].read = true;
            }
            if (this.notificationsDropdownOpen) {
                this.notificationsDropdownOpen = false;
            }
            if (view && this.currentView !== view) {
                this.selectView(view);
            }
        },

        clearAllNotifications() {
            this.notifications = [];
            this.notificationsDropdownOpen = false;
        },

        /* ============================
          --- QUAGGA BARCODE SCANNER --- (UNCHANGED)
          ============================ */
        initQuagga() {
            if (typeof Quagga === 'undefined' || !Quagga.init) {
                this.scanStatusMessage = 'Error: Barcode scanner library not loaded.';
                return;
            }

            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#scanner-container'),
                    constraints: {
                        facingMode: "environment"
                    }
                },
                decoder: { readers: ['code_128_reader'] },
                locator: {
                    halfSample: false,
                    patchSize: "medium"
                },
                locate: true
            }, (err) => {
                if (err) {
                    console.error("Quagga init failed:", err);
                    this.scanStatusMessage = `Camera failed to start. Check permissions/HTTPS. Details: ${err.message || err}`;
                    return;
                }

                Quagga.start();
                this.scanStatusMessage = "Camera ready. Align barcode clearly in view.";

                Quagga.onDetected((result) => {
                    const code = result.codeResult.code;
                    // Only update if the code is new to prevent flickering status
                    if (this.lastDetectedCode !== code) {
                        this.lastDetectedCode = code;
                        this.scanStatusMessage = `✅ Barcode detected: ${code}. Click CAPTURE to confirm shipment.`;
                    }
                });
            });
        },


        stopQuagga() {
            try {
                if (Quagga && Quagga.stop) {
                    Quagga.stop();
                    Quagga.offDetected && Quagga.offDetected();
                }
            } catch (err) {
                console.warn('Error stopping Quagga:', err);
            }
        },


        startScanForOrder(order) {
            if (order.status !== 'Order Processed') return;

            this.orderToFulfill = order;
            this.isProductScanned = false;
            this.scanStatusMessage = 'Awaiting camera initialization...';
            this.showScanModal = true;

            nextTick(() => {
                setTimeout(() => {
                    this.initQuagga();
                }, 100);
            });
        },


        async handleBarcodeScanned(scannedCode) {
            if (!scannedCode) return;

            try {
                this.stopQuagga();
                this.isProductScanned = true;
                this.scanStatusMessage = `✅ Barcode validated: ${scannedCode}. Ready for shipment confirmation.`;
                this.showScanModal = false;

            } catch (err) {
                console.error('Scan error:', err);
                alert('⚠️ Failed to process scan: ' + (err.message || err));
            }
        },


        closeScanModal() {
            this.stopQuagga();
            this.showScanModal = false;
            this.isProductScanned = false;
            this.orderToFulfill = null;
        },

        captureBarcode() {
            const codeToProcess = this.lastDetectedCode;

            if (!codeToProcess) {
                this.scanStatusMessage = "⚠️ Capture failed: Please align a valid barcode and wait for detection.";
                console.warn('Capture attempt failed: No valid barcode was recently detected.');
                return;
            }

            this.lastDetectedCode = null;
            this.handleBarcodeScanned(codeToProcess);
        },

        /* ============================
          --- USER PROFILE METHODS --- (UNCHANGED)
          ============================ */
        async fetchCurrentUserProfile() {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError) throw authError;

                if (user) {
                    const { data: profileData, error: profileError } = await supabase
                        .from('profiles')
                        .select('username')
                        .eq('id', user.id)
                        .single();

                    if (profileError) throw profileError;

                    this.currentUser.id = user.id;
                    this.currentUser.email = user.email || 'N/A';
                    this.currentUser.username = profileData.username || 'Admin User';
                    this.editableUser.username = this.currentUser.username;
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
                this.currentUser.username = 'Admin User';
                this.currentUser.email = 'admin@ryttire.com';
                this.editableUser.username = 'Admin User';
            }
        },

        async saveProfile() {
            try {
                const { error: updateProfileError } = await supabase
                    .from('profiles')
                    .update({ username: this.editableUser.username })
                    .eq('id', this.currentUser.id);

                if (updateProfileError) throw updateProfileError;

                this.currentUser.username = this.editableUser.username;
                this.showProfileModal = false;
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error saving profile:', error.message);
                alert('Failed to save profile changes. Error: ' + error.message);
            }
        },

        cancelProfileEdit() {
            this.editableUser.username = this.currentUser.username;
            this.showProfileModal = false;
        },

        /* ============================
          --- DASHBOARD & DATA FETCHING --- (UNCHANGED)
          ============================ */
        async fetchInitialData() {
            this.fetchCurrentUserProfile();
            const { data: products, error: productsError } = await supabase.from('products').select('id, brand, size, price, barcode');
            if (productsError) console.error('Error fetching products:', productsError);
            else this.availableProducts = products;

            this.fetchDashboardData();
            this.fetchStockInHistory();
            this.fetchProcessedOrders();
        },

        async fetchDashboardData() {
            const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
            this.totalProductsCount = productsCount;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const { count: stockInCount } = await supabase
                .from('stock_in')
                .select('*', { count: 'exact', head: true })
                .gte('date_and_time', today.toISOString())
                .lt('date_and_time', tomorrow.toISOString());
            this.stockInTodayCount = stockInCount;

            const { data: activities } = await supabase.from('stock_in')
                .select('*')
                .order('date_and_time', { ascending: false })
                .limit(4);
            this.recentActivities = activities;
        },

        async fetchStockInHistory() {
            const { data, error } = await supabase.from('stock_in').select('*').order('date_and_time', { ascending: false });
            if (error) console.error('Error fetching stock in history:', error);
            else this.stockInHistory = data;
        },

        async fetchProcessedOrders() {
            this.isStockOutLoading = true;
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        payment_method,
                        order_items (
                            product_id,
                            quantity,
                            price_at_purchase,
                            products!inner(id, brand, size)
                        )
                    `)
                    .in('status', ['Order Processed', 'Shipped', 'Delivered'])
                    .order('created_at', { ascending: true });

                if (error) throw error;
                this.activeOrders = data;
            } catch (error) {
                console.error('Error fetching processed orders:', error.message);
                this.activeOrders = [];
            } finally {
                this.isStockOutLoading = false;
            }
        },

        /* ============================
          --- STOCK OUT METHODS (SHIPPING) --- (UNCHANGED)
          ============================ */
        async updateStockOut() {
            if (!this.orderToFulfill) return;

            const orderId = this.orderToFulfill.order_id;
            const items = this.orderToFulfill.order_items;
            let totalSalesAmount = 0;
            let totalOrdersCount = 1;

            const productTrendMap = new Map();

            try {
                // 1. Calculate sales and log individual stock-out transactions
                for (const item of items) {
                    const { product_id, quantity, price_at_purchase } = item;
                    totalSalesAmount += (quantity * price_at_purchase);

                    const product = this.availableProducts.find(p => p.id === product_id);
                    const productName = product ? product.brand : `Product ID: ${product_id}`;

                    const currentTrend = productTrendMap.get(productName) || { sales: 0, count: 0 };
                    currentTrend.sales += (quantity * price_at_purchase);
                    currentTrend.count += quantity;
                    productTrendMap.set(productName, currentTrend);

                    const { error: logError } = await supabase.from('stock_out').insert({
                        order_id: orderId,
                        product_id: product_id,
                        product_name: productName,
                        quantity: quantity,
                        date_and_time: new Date().toISOString()
                    });
                    if (logError) console.warn('Failed to log stock-out for item:', logError);
                }

                const dailyProductTrend = Object.fromEntries(productTrendMap);

                // 2. Update Order Status to Shipped
                const { error: updateOrderError } = await supabase
                    .from('orders')
                    .update({ status: 'Shipped' })
                    .eq('order_id', orderId);
                if (updateOrderError) throw updateOrderError;

                // 3. Import Sales Data via RPC
                const { error: salesReportError } = await supabase.rpc('upsert_daily_sales_report', {
                    p_sales_amount: totalSalesAmount,
                    p_orders_count: totalOrdersCount,
                    p_product_trend: dailyProductTrend
                });

                if (salesReportError) {
                    console.error('Failed to update sales report:', salesReportError);
                }

                // --- TRANSACTION SUCCESS ---
                alert(`✅ Order #${orderId.slice(0, 8)} confirmed and ready for delivery! Sales report updated.`);

                // Clear state
                this.isProductScanned = false;
                this.showScanModal = false;
                this.orderToFulfill = null;

                // Realtime subscriptions will handle the UI updates.
            } catch (error) {
                console.error('Stock Out/Shipping Error:', error);
                alert('⚠️ Failed to confirm shipment: ' + (error.message || error));
            }
        },

        /* ============================
          --- ADMIN DELIVERY CONFIRMATION --- (UNCHANGED)
          ============================ */
        openConfirmDeliveryModal(order) {
            // Can confirm delivery only if status is Shipped
            if (order.status !== 'Shipped') return;

            this.orderToFulfill = order;
            this.showDeliveryConfirmationModal = true;
        },

        closeConfirmDeliveryModal() {
            this.showDeliveryConfirmationModal = false;
            this.orderToFulfill = null;
            this.isDelivering = null;
        },

        async confirmDeliverySuccessAdmin() {
            const orderId = this.orderToFulfill.order_id;
            this.isDelivering = orderId;

            try {
                const { error } = await supabase
                    .from('orders')
                    .update({ status: 'Delivered' })
                    .eq('order_id', orderId);

                if (error) throw error;

                alert(`Order #${orderId.slice(0, 8)} successfully marked as DELIVERED.`);

            } catch (error) {
                console.error("Error confirming delivery:", error.message);
                alert(`Failed to mark order as delivered. Details: ${error.message}`);
            } finally {
                this.closeConfirmDeliveryModal();
                // Realtime subscriptions will handle the UI updates.
            }
        },


        /* ============================
          --- STOCK IN METHODS (REFACTORED) ---
          ============================ */
        // NEW: This method prepares the stock-in data but DOES NOT save it.
        async prepareStockIn() {
            if (!this.stockIn.productName) {
                alert('Please select a product from the dropdown.');
                return;
            }

            const product = this.availableProducts.find(p => p.brand === this.stockIn.productName);
            if (!product) { alert('Could not find selected product.'); return; }

            // Temporary variables to hold the current data and new calculations
            const barcodeBase = `${this.stockIn.productName.slice(0, 4).toUpperCase()}-${Date.now()}`;

            // Store all the necessary data in a draft object
            this.stockInDraft = {
                product: product, // Full product object
                stockInForm: { ...this.stockIn }, // Copy of the form data
                barcodeBase: barcodeBase
            };

            // Set up the print modal data
            this.itemToPrint = {
                barcodeBase,
                productName: this.stockIn.productName,
                size: this.stockIn.size,
                quantity: this.stockIn.quantity
            };

            // Open the print modal for confirmation
            this.openBarcodePrintModal();
        },

        // NEW: This method is called ONLY when the user clicks 'Print All Labels'
        async validateAndLogStockIn() {
            if (!this.stockInDraft || !this.itemToPrint) {
                alert('Stock In data is missing. Please re-enter the stock.');
                this.closeBarcodePrintModal();
                return;
            }

            const { product, stockInForm, barcodeBase } = this.stockInDraft;

            // 1. Get current stock quantity
            const { data: currentProduct, error: findError } = await supabase.from('products')
                .select('quantity').eq('id', product.id).single();
            if (findError) {
                alert('Could not retrieve current stock. Transaction aborted.');
                this.closeBarcodePrintModal();
                return;
            }

            // 2. Calculate new quantity and status
            const newQuantity = currentProduct.quantity + stockInForm.quantity;
            let newStatus = '';
            if (newQuantity >= 12) newStatus = 'In Stock';
            else if (newQuantity >= 1) newStatus = 'Low Stock';
            else newStatus = 'Out of Stock';

            // 3. Update the main products table (VALIDATE)
            const { error: updateError } = await supabase.from('products')
                .update({ size: stockInForm.size, quantity: newQuantity, status: newStatus })
                .eq('id', product.id);
            if (updateError) {
                alert('Error updating product stock. Transaction aborted: ' + updateError.message);
                this.closeBarcodePrintModal();
                return;
            }

            // 4. Log the stock-in transaction
            const { data: insertedStock, error: logError } = await supabase.from('stock_in').insert({
                barcode_id: barcodeBase,
                product_name: stockInForm.productName,
                size: stockInForm.size,
                quantity: stockInForm.quantity,
                supplier: stockInForm.supplier,
                date_and_time: stockInForm.dateTime
            }).select().single();

            if (logError) {
                alert('Warning: Stock updated, but failed to log transaction. ' + logError.message);
            } else {
                console.log('✅ Stock-In Logged and validated:', insertedStock);
                this.scanStatusMessage = `Stock In added and validated for ${stockInForm.productName}`;
            }

            // 5. Execute printing (this is the actual print action)
            this.printLabel();

            // 6. Final cleanup (only after successful logging)
            this.stockInDraft = null;
            this.itemToPrint = null;
            this.stockIn = {
                productName: '', size: '', quantity: 1, supplier: '',
                dateTime: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
            };

            // Realtime subscriptions will handle the UI updates.
        },

        // This method executes the actual print job and closes the modal afterwards
        printLabel() {
            const { productName, size, quantity, barcodeBase } = this.itemToPrint;
            if (!quantity || quantity < 1) return;

            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print Labels</title>');
            printWindow.document.write('<style>@media print{@page{size:auto;margin:0.1in}body{margin:0}.label{page-break-after:always;text-align:center;font-family:sans-serif}.product-name{font-size:1.1em;font-weight:700;margin-bottom:5px}svg{margin:0 auto}.size,.barcode-id{margin-top:5px}}</style>');
            printWindow.document.write('</head><body>');

            for (let i = 1; i <= quantity; i++) {
                const uniqueBarcodeId = `${barcodeBase}-${String(i).padStart(3, '0')}`;
                const svgId = `barcode-${i}`;
                printWindow.document.body.innerHTML += `<div class="label"><p class="product-name">${productName}</p><svg id="${svgId}"></svg><p class="size">SIZE: ${size}</p><p class="barcode-id">ID: ${uniqueBarcodeId}</p></div>`;
            }

            printWindow.document.write('</body></html>');
            printWindow.document.close();

            printWindow.onload = function () {
                for (let i = 1; i <= quantity; i++) {
                    const uniqueBarcodeId = `${barcodeBase}-${String(i).padStart(3, '0')}`;
                    const svgId = `barcode-${i}`;
                    const svgElement = printWindow.document.getElementById(svgId);
                    if (svgElement) {
                        JsBarcode(svgElement, uniqueBarcodeId, {
                            format: "CODE128",
                            displayValue: true,
                            textMargin: 2,
                            fontSize: 12,
                            height: 60,
                            margin: 8,
                            width: 2.5,
                            lineColor: '#000'
                        });

                    }
                }
                printWindow.focus();
                printWindow.print();
            };

            // Don't close the modal here, let closeBarcodePrintModal handle it
            // after the print window opens.
            this.closeBarcodePrintModal();
        },

        openBarcodePrintModal() { this.showBarcodeModal = true; },

        // UPDATED: Close now resets the draft state if the user cancels
        closeBarcodePrintModal() {
            this.showBarcodeModal = false;
            // If the modal is closed without validation, clear the draft state
            this.stockInDraft = null;
            this.itemToPrint = null;
        },

        /* ============================
          --- UI & NAVIGATION METHODS --- (UNCHANGED)
          ============================ */
        selectView(label) {
            this.currentView = label;
            if (label === 'Stock Out') this.fetchProcessedOrders();
            if (this.isMobile) this.closeSidebar();
        },

        checkMobile() { this.isMobile = window.innerWidth < 992; },
        toggleSidebar() {
            if (this.isMobile) this.isSidebarVisible = !this.isSidebarVisible;
            else this.isCollapsed = !this.isCollapsed;
        },
        closeSidebar() { this.isSidebarVisible = false; this.adminMenuOpen = false; },
        toggleAdminMenu() { this.adminMenuOpen = !this.adminMenuOpen; },
        toggleDesktopAdminMenu() { this.desktopAdminDropdownOpen = !this.desktopAdminDropdownOpen; },

        logout() { this.showLogoutModal = true; },

        async confirmLogout() {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) { alert(`Logout failed: ${error.message}`); return; }

                // Use native JS redirect since router push can be blocked by beforeRouteLeave guard
                window.location.href = '/login';
            } catch (e) {
                console.error('Unexpected logout error:', e);
                alert('An unexpected error occurred. Check console.');
            }
        },

        cancelLogout() { this.showLogoutModal = false; }
    },

    /* ============================================================
      LIFECYCLE HOOKS (UNCHANGED)
    ============================================================ */
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);

        // 1. Initial data fetch (runs once)
        this.fetchInitialData();

        // 2. Start listening for real-time changes
        this.setupRealtimeSubscriptions();

        // 🔔 NEW: Set interval to update 'time ago' for notifications every 30 seconds
        this.timeAgoInterval = setInterval(() => {
            this.notifications = this.notifications.map(n => ({
                ...n,
                timeAgo: this.timeSince(n.timestamp)
            }));
        }, 30000);
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        this.stopQuagga();

        // 3. Stop and remove real-time channels for cleanup
        this.removeRealtimeSubscriptions();

        // 🔔 NEW: Clear time ago interval
        clearInterval(this.timeAgoInterval);
    }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

/* UPDATED Styles for Scanner (Crucial for video feed) */
#scanner-container {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background-color: #000; /* Add a black background */
}
#scanner-video {
  /* Let the video determine its own size to maintain aspect ratio */
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the video */
}
#scanner-container::after {
  content: '';
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  border: 2px solid white;
  border-radius: 8px;
}

/* Custom Modal Styles (for Logout and Profile) */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.custom-modal-card {
  max-width: 450px;
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

.custom-modal-card .card-header {
  border-bottom: none;
  font-weight: bold;
  padding: 1.5rem;
}

.custom-modal-card .card-body {
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

/* Updated dropdown z-index for better layering */
.nav-item.dropdown {
    position: relative;
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

/* FIX for Barcode Overlapping */
.barcode-label-area svg {
  /* Ensure SVG takes up vertical space */
  height: 60px; /* Give it a definite height */
  width: 100%; /* Ensure it spans the container */
  display: block;
  margin: 0 auto;
}

.barcode-label-area {
  /* Increase padding/margin to separate text blocks */
  padding: 10px 5px !important;
}

.barcode-label-area p {
    /* Set explicit margins for separation */
    margin: 5px 0 !important;
    line-height: 1.2;
}
</style>