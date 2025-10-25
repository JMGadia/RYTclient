<template>
  <div class="success-page d-flex align-items-center justify-content-center vh-100 bg-light">
    <div class="card shadow-lg p-4 p-md-5 text-center" style="max-width: 450px;">
      
      <div class="icon-circle mx-auto mb-4 bg-success">
        <i class="fas fa-check text-white"></i>
      </div>

      <h3 class="card-title text-success mb-3">Password Reset Email Sent!</h3>
      <p class="card-text text-muted mb-4">
        Please check your email inbox to find the password reset link. It may take a few moments to arrive.
      </p>

      <RouterLink to="/login" class="btn btn-success btn-lg w-100">
        Back to Login
      </RouterLink>

      <p v-if="$route.query.message" class="mt-3 small text-secondary">
        {{ $route.query.message }}
      </p>

    </div>
  </div>
</template>

<script>
// This component should now ONLY be used for displaying the "Check Your Email" message
// after the user submits the Forgot Password form. The automatic redirecting logic 
// is no longer appropriate for this use case.

import { useRoute } from 'vue-router'

export default {
  // --- COMPONENT STATE (Data) ---
  data() {
    return {
      // The automatic redirect logic is removed to serve as a static confirmation screen.
      redirectRoute: '/Update-Password', 
      countdown: 3, 
      timer: null, 
      redirecting: false, 
      isFirstLogin: false, 
    };
  },
  
  // --- LIFECYCLE HOOKS ---
  mounted() {
    // Check if the component is being used as a simple email confirmation page
    const route = useRoute();
    if (route.query.message) {
      // Set the success message from the query parameter (handled in the template)
      this.redirecting = false; // Stop any existing redirecting logic
      clearTimeout(this.timer);
    } 
    // If there is no query message, it might be the old SuperAdmin redirect logic,
    // which is being ignored here in favor of the new password reset flow.
  },
  
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  
  // --- COMPONENT METHODS ---
  methods: {
    // Method implementations are kept but are no longer triggered in 'mounted'
    startCountdown() {
      // Logic removed to prevent automatic redirection.
    },
    
    redirectToDashboard() {
      // Logic removed to prevent automatic redirection.
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