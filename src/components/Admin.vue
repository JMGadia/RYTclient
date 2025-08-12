<template>
  <div id="admin-dashboard" class="d-flex flex-column min-vh-100 bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <button class="btn btn-primary" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
        <a class="navbar-brand fw-bold ms-3" href="#">Administrator</a>

        <!-- Desktop Notifications & Admin User -->
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
                <li><a class="dropdown-item" href="#">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Layout -->
    <div class="d-flex flex-grow-1">
      <!-- Sidebar -->
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
            <!-- Mobile-only: Admin User Accordion at Top -->
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
                <li><a class="text-white d-block py-1" href="#">Logout</a></li>
              </ul>
            </li>

            <!-- Mobile-only: Notifications -->
            <li class="nav-item mt-2" v-if="isMobile">
              <a class="nav-link text-white py-2 px-3 d-flex align-items-center" href="#">
                <i class="fas fa-bell me-2"></i>
                <span>Notifications</span>
              </a>
            </li>

            <!-- Sidebar Menu Items -->
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

      <!-- Overlay for mobile -->
      <div
        v-if="isMobile && isSidebarVisible"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>

      <!-- Main Content Area -->
      <main class="flex-grow-1 p-4">
        <h2 class="text-primary mb-4">{{ currentView }}</h2>
        <p>This is {{ currentView }} content section.</p>
      </main>
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
      currentView: 'Dashboard', // Default view
      menuItems: [
        { icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
        { icon: 'fas fa-boxes', label: 'Stock In' },
        { icon: 'fas fa-truck-loading', label: 'Stock Out' }
      ]
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
      if (toggleEl && !toggleEl.contains(event.target)) {
        this.desktopAdminDropdownOpen = false;
        document.removeEventListener('click', this.closeDesktopDropdownOnClickOutside);
      }
    },
    selectView(label) {
      this.currentView = label;
      if (this.isMobile) this.closeSidebar();
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
.sidebar {
  width: 250px;
  transition: all 0.3s ease-in-out;
  overflow-x: hidden;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 1050;
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

/* Mobile Sidebar Behavior */
@media (max-width: 991.98px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1050;
  }

  .sidebar.sidebar-visible {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 250px;
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
}
</style>