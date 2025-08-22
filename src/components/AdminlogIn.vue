<template>
  <div>
    <SuperSignUp v-if="showSignUp" @back-to-login="showSignUp = false" />
    <div v-else class="login-page min-vh-100">
      <div class="background-overlay"></div>

      <div class="container-fluid h-100">
        <div class="row h-100">
          <!-- Left side -->
          <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary-gradient text-white position-relative">
            <div class="text-center z-index-2">
              <div class="mb-4">
                <i class="fas fa-user-shield fa-5x mb-3 text-white-50"></i>
              </div>
              <h1 class="display-4 fw-bold mb-3">RYT-Tyre</h1>
              <h2 class="h3 fw-light mb-4">Admin Portal</h2>
              <p class="lead mb-0">
                Secure access to administrative controls and system management
              </p>
            </div>
            <div class="position-absolute top-0 start-0 w-100 h-100 opacity-10">
              <div class="floating-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
              </div>
            </div>
          </div>

          <!-- Right side -->
          <div class="col-lg-6 d-flex flex-column justify-content-center">
            <div class="login-form-container mx-auto">
              <!-- Login Form -->
              <div class="card shadow-lg border-0 rounded-4">
                <div class="card-body p-5">
                  <div class="text-center mb-4">
                    <div class="avatar-wrapper mx-auto mb-3">
                      <div class="avatar bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                        <i class="fas fa-user-tie fa-2x text-primary"></i>
                      </div>
                    </div>
                    <h3 class="card-title fw-bold text-dark mb-2">Welcome Back!</h3>
                    <p class="text-muted mb-0">Please log in to your admin account</p>
                  </div>

                  <form @submit.prevent="handleLogin" novalidate>
                    <div class="mb-3">
                      <label for="username" class="form-label fw-semibold">
                        <i class="fas fa-user me-2 text-muted"></i>Username
                      </label>
                      <input
                        type="text"
                        class="form-control form-control-lg rounded-3"
                        id="username"
                        v-model="loginForm.username"
                        placeholder="Enter your username"
                        required
                        :class="{ 'is-invalid': errors.username }"
                      />
                      <div v-if="errors.username" class="invalid-feedback">
                        <i class="fas fa-exclamation-circle me-1"></i>{{ errors.username }}
                      </div>
                    </div>

                    <div class="mb-4">
                      <label for="password" class="form-label fw-semibold">
                        <i class="fas fa-lock me-2 text-muted"></i>Password
                      </label>
                      <input
                        type="password"
                        class="form-control form-control-lg rounded-3"
                        id="password"
                        v-model="loginForm.password"
                        placeholder="Enter your password"
                        required
                        :class="{ 'is-invalid': errors.password }"
                      />
                      <div v-if="errors.password" class="invalid-feedback">
                        <i class="fas fa-exclamation-circle me-1"></i>{{ errors.password }}
                      </div>
                    </div>

                    <div class="d-grid mb-4">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg rounded-3 fw-semibold"
                        :disabled="isLoading"
                      >
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="fas fa-sign-in-alt me-2"></i>
                        {{ isLoading ? 'Logging in...' : 'Log In' }}
                      </button>
                    </div>
                  </form>

                  <div class="text-center mb-4">
                    <hr class="my-4">
                    <span class="text-muted bg-white px-3">or</span>
                  </div>

                  <div class="text-center">
                    <p class="text-muted mb-3">Don't have an account?</p>
                    <button
                      type="button"
                      class="btn btn-outline-primary rounded-3 me-2"
                      @click="goToSignUp"
                    >
                      <i class="fas fa-user-plus me-2"></i>Sign Up
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary rounded-3"
                      @click="goBack"
                    >
                      <i class="fas fa-arrow-left me-2"></i>Back to Account
                    </button>
                  </div>
                </div>
              </div>

              <div class="text-center mt-4">
                <p class="text-muted small mb-0">
                  © 2024 RYT-Tyre. All rights reserved.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SuperSignUp from './AdminSignUp.vue'

// Define the emits for this component. Added 'login-success'
const emit = defineEmits(['go-back', 'login-success'])

const showSignUp = ref(false)
const isLoading = ref(false)
const loginForm = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })

const goToSignUp = () => {
  showSignUp.value = true
}

const goBack = () => {
  emit('go-back')
}

const handleLogin = async () => {
  errors.username = ''
  errors.password = ''

  // Basic validation
  if (!loginForm.username.trim()) {
    errors.username = 'Username is required'
    return
  }
  if (!loginForm.password.trim()) {
    errors.password = 'Password is required'
    return
  }
  if (loginForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Hardcoded login for demonstration
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      // Emit login-success event with user data
      emit('login-success', { username: loginForm.username, role: 'admin' })
      // Removed the alert here, parent component will handle redirection/feedback
    } else {
      errors.username = 'Invalid username or password'
    }
  } catch (error) {
    console.error('Login error:', error);
    errors.username = 'An unexpected error occurred during login.';
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/background.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.1;
  z-index: 1;
}

.bg-primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.z-index-2 {
  z-index: 2;
}

.login-form-container {
  max-width: 480px;
  width: 100%;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
}

.avatar {
  width: 80px;
  height: 80px;
}

.card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  transform: none;
  opacity: 0.7;
}

/* Password toggle button styling */
.password-toggle-btn {
  border-color: #ced4da;
  color: #6c757d;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
}

.password-toggle-btn:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}

.password-toggle-btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
  outline: none;
}

/* Password icon styling */
.password-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.password-toggle-btn:hover .password-icon {
  opacity: 0.8;
}

/* Floating shapes animation */
.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .login-form-container {
    padding: 1rem;
  }
}

@media (max-width: 575.98px) {
  .card-body {
    padding: 2rem !important;
  }
  
  .login-form-container {
    padding: 0.5rem;
  }
}

/* Icon styling */
.fas {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}
</style>
