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
              <form @submit.prevent="addStockIn">
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
                  <input type="text" class="form-control" id="supplierIn" v-model="stockIn.supplier">
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
                class="card h-100 shadow-sm border-warning"
                :class="{'border-success': order.status === 'Shipped', 'border-danger': order.status === 'Delivered', 'border-info': order.b2b_permit_url}"
              >
                <div
                  class="card-header fw-bold"
                  :class="{
                    'bg-info text-white': order.b2b_permit_url,
                    'bg-warning text-dark': order.status === 'Order Processed' && !order.b2b_permit_url,
                    'bg-success text-white': order.status === 'Shipped',
                    'bg-danger text-white': order.status === 'Delivered'
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
                    <i class="fas fa-user me-2 text-muted"></i>
                    <strong>{{ order.username || 'Name Missing' }}</strong>
                  </p>
                  <p class="card-text mb-1">
                    <i class="fas fa-phone me-2 text-muted"></i>
                    {{ order.contact || 'Phone Missing' }}
                  </p>
                  <p class="card-text mb-2 small text-muted">
                    <i class="fas fa-map-marker-alt me-2"></i>
                    {{ order.shipping_address ? order.shipping_address.substring(0, 40) : 'Address Missing' }}
                    <span v-if="order.shipping_address && order.shipping_address.length > 40">...</span>
                  </p>

                  <button
                    class="btn w-100 mt-2"
                    :class="{
                      'btn-info': order.b2b_permit_url,
                      'btn-primary': order.status === 'Order Processed' && !order.b2b_permit_url,
                      'btn-success': order.status === 'Shipped',
                      'btn-danger': order.status === 'Delivered'
                    }"
                    @click="
                      order.status === 'Delivered' ? openConfirmDeliveryModal(order) :
                      (order.status === 'Order Processed' || order.status === 'Pre-Ordered') ? startScanForOrder(order) : null
                    "
                    :disabled="order.status === 'Shipped' || order.status === 'Delivered' || isDelivering === order.order_id"
                  >
                    <i
                        :class="{
                          'fas fa-file-invoice me-2': order.b2b_permit_url,
                          'fas fa-barcode me-2': order.status === 'Order Processed' && !order.b2b_permit_url,
                          'fas fa-truck me-2': order.status === 'Shipped',
                          'fas fa-check-circle me-2': order.status === 'Delivered'
                        }"
                    ></i>
                    {{
                        order.status === 'Delivered' ? 'Delivery Complete' :
                        order.status === 'Shipped' ? 'Ready to Deliver (Tap to confirm)' :
                        order.b2b_permit_url ? 'Take Pre-Ordered' :
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
                <h5 class="mb-0"><i class="fas fa-barcode me-2"></i> Print Labels</h5>
            </div>
            <div class="card-body text-center">
              <p>Ready to print <strong>{{ itemToPrint.quantity }}</strong> labels for <strong>{{ itemToPrint.productName }}</strong>.</p>
              <div class="d-flex justify-content-center gap-3 mt-4">
                  <button class="btn btn-secondary" @click="closeBarcodePrintModal">Cancel</button>
                  <button class="btn btn-primary" @click="printLabel">
                      <i class="fas fa-print me-2"></i> Print All Labels
                  </button>
              </div>
            </div>
        </div>
    </div>

    <div v-if="showScanModal" class="custom-modal-overlay">
        <div class="custom-modal-card card shadow-lg" style="max-width: 600px;">
            <div class="card-header bg-primary text-white text-center">
                <h5 class="mb-0"><i class="fas fa-qrcode me-2"></i> Scan Product Barcode</h5>
            </div>
            <div class="card-body">
              <p class="text-center fw-bold">Order #{{ orderToFulfill.order_id.slice(0, 8) }} | Total Items: {{ totalItemsScanned }} / {{ totalItemsToScan }}</p>

              <ul class="list-group list-group-flush mb-3">
                  <li
                      class="list-group-item d-flex justify-content-between align-items-center"
                      v-for="item in scannedItemsList"
                      :key="item.id"
                  >
                      <div>
                          <strong>{{ item.name }}</strong> (Required: {{ item.required }})
                      </div>
                      <span class="badge" :class="item.isComplete ? 'bg-success' : 'bg-warning text-dark'">
                          Scanned: {{ item.scanned }}
                          <i v-if="item.isComplete" class="fas fa-check ms-1"></i>
                      </span>
                  </li>
              </ul>
              <hr />

              <div id="scanner-container" class="mb-3">
                <video id="scanner-video" style="width: 100%; height: 100%; object-fit: cover;"></video>
              </div>
              <div class="alert" :class="{'alert-warning': scanStatusMessage.includes('⚠️'), 'alert-success': scanStatusMessage.includes('✅'), 'alert-info': !scanStatusMessage.includes('⚠️') && !scanStatusMessage.includes('✅')}" v-if="scanStatusMessage">{{ scanStatusMessage }}</div>

              <div class="d-flex justify-content-center gap-3 mt-4">
                <button class="btn btn-secondary" @click="closeScanModal">
                    <i class="fas fa-times me-2"></i> Cancel Scan
                </button>
                <button class="btn btn-warning" @click="captureBarcode" :disabled="isScanProgressComplete || isProcessingScan">
                    <span v-if="isProcessingScan" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-camera me-2"></i> Manual Capture Last Barcode
                </button>
              </div>
            </div>
        </div>
    </div>

    <div v-if="isOrderScanComplete && orderToFulfill && !showScanModal" class="custom-modal-overlay">
        <div class="custom-modal-card card shadow-lg" style="max-width: 450px;">
            <div class="card-header bg-success text-white text-center">
                <h5 class="mb-0"><i class="fas fa-check-circle me-2"></i> Confirm Order Shipment</h5>
            </div>
            <div class="card-body text-center">
                <p class="lead">All {{ totalItemsToScan }} items successfully matched!</p>
                <p>Confirm shipment for Order #{{ orderToFulfill.order_id.slice(0, 8) }}.</p>
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button class="btn btn-secondary" @click="closeScanModal">Cancel</button>
                    <button class="btn btn-success" @click="updateStockOut" :disabled="isDelivering === orderToFulfill.order_id">
                        <span v-if="isDelivering === orderToFulfill.order_id" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="fas fa-shipping-fast me-2"></i> Ship & Complete Order
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
    </div>
</template>

<script>
/* ============================================================
    Admin Dashboard Vue Component - REVISED
    - Implements Multi-Scan Order Fulfillment.
    - Adds Barcode Validation Heuristics (via Quagga's quality checks).
    - Updates button text for b2b_permit_url.
============================================================ */

import { supabase } from '../server/supabase';
import { nextTick } from 'vue';
import JsBarcode from 'jsbarcode';
import Quagga from '@ericblade/quagga2'; // Barcode scanning library
import { useRouter, onBeforeRouteLeave } from 'vue-router';

// Utility function to determine if a detection is a 'good' barcode read
// OBJECTIVE 3: Barcode-Only Validation
function isBarcode(result) {
    // Check if a code was actually decoded (not just a picture of an object/text)
    if (!result.codeResult || !result.codeResult.code) {
        return false;
    }

    // Heuristic: Check if the confidence level is above a threshold.
    // Quagga provides an "error" property which is essentially (1 - confidence).
    // A lower error means higher confidence. 0.85 is a good threshold for confidence.
    // This rejects blurry/unclear scans or non-barcode objects that might coincidentally match a pattern.
    const confidence = 1 - (result.codeResult.err || 1);
    if (confidence < 0.85) {
        console.warn(`Low confidence scan: ${confidence.toFixed(2)} - Likely not a clear barcode.`);
        return false;
    }

    // If it passes the confidence check, assume it's a valid barcode read.
    return true;
}


export default {
    name: 'AdminDashboard',

    // The router is not available via "this" inside the module scope,
    // so we get it outside if needed, but for a standard Vue component
    // we should rely on this.$router inside the methods.
    // Note: The original provided code had the router instantiation outside
    // the component export, which is generally incorrect for Vue 2/3 Composition API context
    // but often exists in boilerplate. We'll keep it as a comment for context.
    // const router = useRouter();

    /* ============================================================
      ROUTE GUARD (No changes)
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
                // Use a proper router push if available, otherwise fallback
                // this.$router.push('/login'); // Assuming this.$router is available
                // As a fallback to the original code's style:
                next(false);
                window.location.href = '/login';
            });
        } else {
            next(false);
        }
    },

    /* ============================================================
      DATA PROPERTIES (UPDATED for Multi-Scan)
    ============================================================ */
    data() {
        return {
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
            showBarcodeModal: false,
            showScanModal: false,
            showDeliveryConfirmationModal: false,
            isDelivering: null,

            // --- Loading / Scan State ---
            isStockOutLoading: false,
            scanStatusMessage: 'Awaiting camera initialization...',
            isProcessingScan: false,

            // OBJECTIVE 2: New state for multi-scan tracking
            orderItemsScanned: {},
            isOrderScanComplete: false,

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
      COMPUTED PROPERTIES (UPDATED for Multi-Scan Logic)
    ============================================================ */
    computed: {
        totalItemsToScan() {
            if (!this.orderToFulfill || !this.orderToFulfill.order_items) return 0;
            // Sum of all quantities in all items for the order
            return this.orderToFulfill.order_items.reduce((total, item) => total + item.quantity, 0);
        },
        totalItemsScanned() {
            // Calculates the total number of items scanned across all product IDs
            return Object.values(this.orderItemsScanned).reduce((total, count) => total + count, 0);
        },
        // Detailed list of items required vs. scanned for the modal UI
        scannedItemsList() {
            if (!this.orderToFulfill || !this.orderToFulfill.order_items) return [];

            return this.orderToFulfill.order_items.map(item => {
                const productId = item.product_id;
                const productName = item.products ? item.products.brand : 'Unknown Product';
                const required = item.quantity;
                const scanned = this.orderItemsScanned[productId] || 0;

                return {
                    id: productId,
                    name: productName,
                    required: required,
                    scanned: scanned,
                    isComplete: scanned >= required
                };
            });
        },
        // OBJECTIVE 2: Checks if every item's required quantity has been met
        isScanProgressComplete() {
            if (!this.orderToFulfill) return false;
            return this.scannedItemsList.every(item => item.isComplete);
        },
        // Keeping this helper function for template compatibility (no change)
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
      METHODS (UPDATED for all 3 objectives)
    ============================================================ */
    methods: {

        /* ============================
          --- QUAGGA BARCODE SCANNER (MULTI-SCAN & VALIDATION) ---
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
                decoder: { readers: ['code_128_reader', 'ean_reader', 'upc_reader'] },
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

                // Attach the onDetected handler
                Quagga.onDetected(this.onQuaggaDetected);
            });
        },

        stopQuagga() {
            try {
                if (Quagga && Quagga.stop) {
                    Quagga.stop();
                    Quagga.offDetected && Quagga.offDetected(this.onQuaggaDetected);
                }
            } catch (err) {
                console.warn('Error stopping Quagga:', err);
            }
        },

        // New Quagga detection handler for multi-scan and barcode-only validation
        onQuaggaDetected(result) {
            if (this.isProcessingScan || this.isScanProgressComplete) {
                return;
            }

            const scannedCode = result.codeResult.code;

            // OBJECTIVE 3: Barcode-Only Validation
            if (!isBarcode(result)) {
                this.scanStatusMessage = "⚠️ Not a clear barcode. Please align better.";
                // Do not return here, allow the system to keep trying on the next frame
                return;
            }

            // Simple debounce: If the same code is detected very quickly, ignore it.
            if (scannedCode === this.lastDetectedCode) {
                return;
            }

            this.lastDetectedCode = scannedCode;
            this.handleBarcodeScanned(scannedCode);
        },


        startScanForOrder(order) {
            // Allow scanning for both 'Pre-Ordered' and 'Order Processed'
            if (order.status !== 'Pre-Ordered' && order.status !== 'Order Processed') return;

            this.orderToFulfill = order;
            this.isOrderScanComplete = false;
            this.orderItemsScanned = {}; // Reset scanned items for the new order
            this.lastDetectedCode = null;
            this.scanStatusMessage = 'Awaiting camera initialization...';
            this.showScanModal = true;

            // Optional: Auto-update status from Pre-Ordered → Order Processed
            if (order.status === 'Pre-Ordered' && order.b2b_permit_url) {
                supabase.from('orders')
                   .update({ status: 'Order Processed' })
                   .eq('order_id', order.order_id)
                   .then(({ error }) => {
                     if (error) console.warn('Failed to update status:', error);
                     else {
                         this.orderToFulfill.status = 'Order Processed'; // Optimistic UI update
                         this.fetchProcessedOrders();
                     }
                   });
            }

            // Wait for DOM to be ready before initializing Quagga
            nextTick(() => {
                // Short delay to ensure video element is fully rendered
                setTimeout(() => {
                    this.initQuagga();
                }, 100);
            });
        },


        // OBJECTIVE 2: Multi-Scan Logic Implementation
        async handleBarcodeScanned(scannedCode) {
            // isScanProgressComplete check is handled by the overall flow
            if (!scannedCode || this.isProcessingScan || this.isScanProgressComplete) return;

            this.isProcessingScan = true;

            try {
                // 1. Find the product ID based on the scanned barcode
                const { data: product, error: productError } = await supabase
                    .from('products')
                    .select('id, brand')
                    .eq('barcode', scannedCode)
                    .single();

                if (productError || !product) throw new Error(`Product not found for barcode: ${scannedCode}`);

                // 2. Check if this product is part of the current order
                const requiredItem = this.orderToFulfill.order_items.find(
                    item => item.product_id === product.id
                );

                if (!requiredItem) {
                    this.scanStatusMessage = `❌ Barcode **${product.brand}** is not in this order!`;
                    this.lastDetectedCode = null; // Allow re-scan immediately
                    return;
                }

                // 3. Check if the required quantity has been met for this product
                const currentScanned = this.orderItemsScanned[product.id] || 0;
                if (currentScanned < requiredItem.quantity) {
                    // Increment the scanned count for this product (ensuring reactivity)
                    this.orderItemsScanned = {
                        ...this.orderItemsScanned,
                        [product.id]: currentScanned + 1
                    };
                    this.scanStatusMessage = `✅ Scanned **${product.brand}**. Progress: ${currentScanned + 1}/${requiredItem.quantity}`;
                } else {
                    this.scanStatusMessage = `⚠️ All **${product.brand}** (${requiredItem.quantity}) have already been scanned.`;
                    return;
                }

                // 4. Check if the entire order is complete
                if (this.isScanProgressComplete) {
                    this.isOrderScanComplete = true;
                    this.stopQuagga();
                    this.scanStatusMessage = `🎉 All items scanned! Ready for shipment confirmation.`;
                    // Immediately show the confirmation modal
                    this.showScanModal = false;
                    this.isDelivering = this.orderToFulfill.order_id;
                } else {
                    // Automatically re-enable scanning to catch the next item (manual capture is also available)
                    this.lastDetectedCode = null;
                }

            } catch (err) {
                console.error('Scan processing error:', err);
                this.scanStatusMessage = '🛑 Error processing scan: ' + (err.message || 'Product or Barcode not found.');
            } finally {
                this.isProcessingScan = false;
            }
        },


        closeScanModal() {
            this.stopQuagga();
            this.showScanModal = false;
            this.isOrderScanComplete = false;
            this.orderToFulfill = null;
            this.orderItemsScanned = {};
            this.lastDetectedCode = null;
        },

        captureBarcode() {
            // Allows manual processing of the *last successfully validated* barcode
            if (!this.lastDetectedCode) {
                this.scanStatusMessage = 'Please ensure a barcode is in view.';
                return;
            }
            this.handleBarcodeScanned(this.lastDetectedCode);
        },

        /* ============================
          --- USER PROFILE METHODS (No changes) ---
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
          --- DASHBOARD & DATA FETCHING (No major changes) ---
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

            // NOTE: stockOutTodayCount is not implemented in the provided fetchDashboardData, keeping it at 0.
            this.stockOutTodayCount = 0;

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
                // Include all necessary states: Pre-Ordered, Order Processed, Shipped, Delivered
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            product_id,
                            quantity,
                            price_at_purchase,
                            products!inner(id, brand, size, barcode)
                        )
                    `)
                    .in('status', ['Pre-Ordered','Order Processed', 'Shipped', 'Delivered'])
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

        getOrderProductDetails(items) {
            if (!items || items.length === 0) return 'No items found.';

            return items.map(item => {
                const brand = item.products ? item.products.brand : 'Unknown Product';
                const size = item.products ? item.products.size : 'N/A';

                return `${brand} (${size}) x${item.quantity}`;
            }).join(', ');
        },

        /* ============================
          --- STOCK OUT METHODS (SHIPPING) ---
          ============================ */
        // Renamed and streamlined updateStockOut to only focus on the final confirmation after a successful scan
        async updateStockOut() {
            if (!this.orderToFulfill || !this.isScanProgressComplete) {
                alert('Cannot confirm shipment: Scan is incomplete or order is missing.');
                return;
            }

            const orderId = this.orderToFulfill.order_id;
            const items = this.orderToFulfill.order_items;
            let totalSalesAmount = 0;
            let totalOrdersCount = 1;

            const productTrendMap = new Map();
            this.isDelivering = orderId;

            try {
                // 1. Log stock-out transactions and calculate sales
                for (const item of items) {
                    const { product_id, quantity, price_at_purchase } = item;
                    totalSalesAmount += (quantity * price_at_purchase);

                    const product = this.availableProducts.find(p => p.id === product_id);
                    const productName = product ? product.brand : `Product ID: ${product_id}`;

                    // Aggregate product trend data
                    const currentTrend = productTrendMap.get(productName) || { sales: 0, count: 0 };
                    currentTrend.sales += (quantity * price_at_purchase);
                    currentTrend.count += quantity;
                    productTrendMap.set(productName, currentTrend);

                    // Log individual stock-out transaction
                    const { error: logError } = await supabase.from('stock_out').insert({
                        order_id: orderId,
                        product_id: product_id,
                        product_name: productName,
                        quantity: quantity,
                        date_and_time: new Date().toISOString()
                    });
                    if (logError) console.warn('Failed to log stock-out for item:', logError);

                    // 💥 CRITICAL STEP: Stock Quantity Reduction (Ensure rpc is correct or use standard update)
                    const { error: stockUpdateError } = await supabase.from('products')
                        .rpc('decrement_product_stock', { p_product_id: product_id, p_decrement_qty: quantity });
                    if (stockUpdateError) console.error(`Failed to decrement stock for product ${product_id}:`, stockUpdateError);
                }

                const dailyProductTrend = Object.fromEntries(productTrendMap);

                // 2. Update Order Status to Shipped
                const { error: updateOrderError } = await supabase
                    .from('orders')
                    .update({ status: 'Shipped' })
                    .eq('order_id', orderId);
                if (updateOrderError) throw updateOrderError;

                // 3. Update Sales Data
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
                this.closeScanModal(); // This clears all scan-related state
                this.closeConfirmDeliveryModal();

                this.fetchProcessedOrders();
                this.fetchDashboardData();

            } catch (error) {
                console.error('Stock Out/Shipping Error:', error);
                alert('⚠️ Failed to confirm shipment: ' + (error.message || error));
            } finally {
                this.isDelivering = null;
            }
        },

        /* ============================
          --- ADMIN DELIVERY CONFIRMATION (No changes) ---
          ============================ */
        openConfirmDeliveryModal(order) {
            // Only allow if the order is Shipped
            if (order.status !== 'Shipped') return;

            this.orderToFulfill = order;
            this.showDeliveryConfirmationModal = true;
        },

        closeConfirmDeliveryModal() {
            this.showDeliveryConfirmationModal = false;
            // Only clear orderToFulfill if it was set for delivery confirmation,
            // otherwise the value from the scan confirmation modal might still be needed
            // if we add a flow where the user goes back to the list.
            this.orderToFulfill = null;
            this.isDelivering = null; // Ensure loading state is cleared
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
                await this.fetchProcessedOrders();
            }
        },


        /* ============================
          --- STOCK IN METHODS (No major changes) ---
          ============================ */
        async addStockIn() {
            if (!this.stockIn.productName) {
                alert('Please select a product from the dropdown.');
                return;
            }

            const product = this.availableProducts.find(p => p.brand === this.stockIn.productName);
            if (!product) { alert('Could not find selected product.'); return; }

            const { data: currentProduct, error: findError } = await supabase.from('products')
                .select('quantity').eq('id', product.id).single();
            if (findError) { alert('Could not retrieve current stock.'); return; }

            const newQuantity = currentProduct.quantity + this.stockIn.quantity;
            let newStatus = '';
            if (newQuantity >= 12) newStatus = 'In Stock';
            else if (newQuantity >= 1) newStatus = 'Low Stock';
            else newStatus = 'Out of Stock';

            const { error: updateError } = await supabase.from('products')
                .update({ size: this.stockIn.size, quantity: newQuantity, status: newStatus })
                .eq('id', product.id);
            if (updateError) { alert('Error updating product: ' + updateError.message); return; }

            const barcodeBase = `${this.stockIn.productName.slice(0, 4).toUpperCase()}-${Date.now()}`;
            const { data: insertedStock, error: logError } = await supabase.from('stock_in').insert({
                barcode_id: barcodeBase,
                product_name: this.stockIn.productName,
                size: this.stockIn.size,
                quantity: this.stockIn.quantity,
                supplier: this.stockIn.supplier,
                date_and_time: this.stockIn.dateTime
            }).select().single();

            if (logError) {
                alert('Warning: Failed to log transaction. ' + logError.message);
            } else {
                console.log('✅ Stock-In Logged:', insertedStock);
                this.scanStatusMessage = `Stock In added for ${this.stockIn.productName}`;
            }


            this.itemToPrint = { barcodeBase, productName: this.stockIn.productName, size: this.stockIn.size, quantity: this.stockIn.quantity };
            this.openBarcodePrintModal();

            // Reset stockIn form
            this.stockIn = {
                productName: '', size: '', quantity: 1, supplier: '',
                dateTime: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
            };

            this.fetchInitialData();
        },

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

            this.closeBarcodePrintModal();
        },

        openBarcodePrintModal() { this.showBarcodeModal = true; },
        closeBarcodePrintModal() { this.showBarcodeModal = false; this.itemToPrint = null; },

        /* ============================
          --- UI & NAVIGATION METHODS (No changes) ---
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

                // The beforeRouteLeave hook should handle the redirect, but this is a fallback for direct action
                await this.$router.push('/login');
                window.location.reload();
            } catch (e) {
                console.error('Unexpected logout error:', e);
                alert('An unexpected error occurred. Check console.');
            }
        },

        cancelLogout() { this.showLogoutModal = false; }
    },

    /* ============================================================
      LIFECYCLE HOOKS (No changes)
    ============================================================ */
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        this.fetchInitialData();
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        this.stopQuagga();
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