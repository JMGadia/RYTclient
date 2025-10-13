<template>
  <div class="success-page d-flex align-items-center justify-content-center vh-100 bg-light">
    <div class="card shadow-lg p-4 p-md-5 text-center" style="max-width: 450px;">
      
      <div class="icon-circle mx-auto mb-4 bg-success">
        <i class="fas fa-check text-white"></i>
      </div>

      <h3 class="card-title text-success mb-3">Authentication Confirm!</h3>
      <p class="card-text text-muted mb-4">
        Your email has been successfully confirmed. You will now be redirected to set a new password.
      </p>

      <RouterLink to="/Update-Password" class="btn btn-success btn-lg w-100">
        Update Password
      </RouterLink>

      <p v-if="redirecting" class="mt-3 small text-secondary">
        Redirecting in {{ countdown }} seconds...
      </p>

    </div>
  </div>
</template>

<script>
// This is a Vue 2/3 Options API component (not <script setup>) used as an intermediate
// success screen after a Super Admin successfully logs in for the *first time*.

export default {
  // --- COMPONENT STATE (Data) ---
  data() {
    return {
      // CHANGE: Target route for redirection is now Update-Password
      redirectRoute: '/Update-Password', 
      countdown: 3, 
      timer: null, 
      redirecting: true, 
      // isFirstLogin is no longer strictly necessary for this use case, but kept for context/original flow
      isFirstLogin: false, 
    };
  },
  
  // --- LIFECYCLE HOOKS ---

  /**
   * Executed when the component is first mounted to the DOM.
   * Checks for the 'first login' flag and either starts the countdown or redirects immediately.
   */
  mounted() {
    this.startCountdown();
  },
  
  /**
   * Executed just before the component is destroyed.
   * Clears the countdown timer to prevent memory leaks and unexpected behavior.
   */
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  
  // --- COMPONENT METHODS ---
  
  methods: {
    /**
     * Recursively calls itself every second to decrement the countdown timer.
     * Initiates redirection when the countdown reaches zero.
     */
    startCountdown() {
      if (this.countdown > 0) {
        // Set a timer for 1 second and call this method again
        this.timer = setTimeout(() => {
          this.countdown--;
          this.startCountdown();
        }, 1000);
      } else {
        // Countdown finished, initiate final redirect
        this.redirectToDashboard();
      }
    },
    
    /**
     * Pushes the user to the target dashboard route using Vue Router.
     */
    redirectToDashboard() {
      if (this.$router) {
        this.$router.push(this.redirectRoute); // Redirects to /super-admin
      }
    }
  }
};
</script>

<style scoped>
.success-page {
  min-height: 100vh;
}

.card {
  border-radius: 1.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  animation: scale-up 0.5s ease-out;
}

@keyframes scale-up {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>