<template>
  <div class="success-page d-flex align-items-center justify-content-center vh-100 bg-light">
    <div class="card shadow-lg p-4 p-md-5 text-center" style="max-width: 450px;">
      
      <div class="icon-circle mx-auto mb-4 bg-success">
        <i class="fas fa-check text-white"></i>
      </div>

      <h3 class="card-title text-success mb-3">Authentication Successful!</h3>
      <p class="card-text text-muted mb-4">
        You have successfully logged in to your account. You will now be redirected to the dashboard.
      </p>

      <RouterLink to="/super-admin" class="btn btn-success btn-lg w-100">
        Go to Dashboard
      </RouterLink>

      <p v-if="redirecting" class="mt-3 small text-secondary">
        Redirecting in {{ countdown }} seconds...
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessPage',
  data() {
    return {
      redirecting: true,
      countdown: 5,
      // Already correct for Super Admin flow
      redirectRoute: '/super-admin', 
      countdownTimer: null,
    };
  },
  mounted() {
    this.startCountdown();
  },
  beforeUnmount() {
    clearInterval(this.countdownTimer);
  },
  methods: {
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.redirectToDashboard();
        }
      }, 1000);
    },
    redirectToDashboard() {
      if (this.$router) {
        this.$router.push(this.redirectRoute);
      } else {
        console.log(`Redirecting to ${this.redirectRoute}`);
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