<template>
  <div>
    <div class="login-page min-vh-100">
      <div class="background-overlay"></div>
      <div class="container-fluid h-100">
        <div class="row h-100">
          <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary-gradient text-white position-relative">
            <div class="text-center z-index-2">
              <div class="mb-4">
                <i class="fas fa-warehouse fa-5x mb-3 text-white-50"></i>
              </div>
              <h1 class="display-4 fw-bold mb-3">RYT-Tyre</h1>
              <h2 class="h3 fw-light mb-4">Inventory & Ordering Portal</h2>
              <p class="lead mb-0">
                Secure access for customers and administrators.
              </p>
            </div>
            </div>

          <div class="col-lg-6 d-flex flex-column justify-content-center">
            <div class="login-form-container mx-auto">
              <div class="card shadow-lg border-0 rounded-4">
                <div class="card-body p-5">
                  <div class="text-center mb-4">
                    <div class="avatar-wrapper mx-auto mb-3">
                      <div class="avatar bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                        <i class="fas fa-user-tie fa-2x text-primary"></i>
                      </div>
                    </div>
                    <h3 class="card-title fw-bold text-dark mb-2">Welcome Back!</h3>
                    <p class="text-muted mb-0">Please log in to your account</p>
                  </div>

                  <form @submit.prevent="handleLogin" novalidate>
                    <div class="mb-3">
                      <label for="email" class="form-label fw-semibold">
                        <i class="fas fa-user me-2 text-muted"></i>Email
                      </label>
                      <input
                        type="email"
                        class="form-control form-control-lg rounded-3"
                        id="email"
                        v-model="email"
                        placeholder="Enter your email"
                        required
                        :class="{ 'is-invalid': errors.email }"
                      />
                      <div v-if="errors.email" class="invalid-feedback">
                        <i class="fas fa-exclamation-circle me-1"></i>{{ errors.email }}
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
                        v-model="password"
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

                  <div class="text-center">
                    <p class="text-muted mb-3">Don't have an account?</p>
                    <RouterLink to="/signup" class="btn btn-outline-primary rounded-3">
                      <i class="fas fa-user-plus me-2"></i>Sign Up
                    </RouterLink>
                  </div>
                </div>
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
import { supabase } from '../server/supabase'
import { useRouter } from 'vue-router'

const router = useRouter() 

const email = ref("")
const password = ref("")
const isLoading = ref(false)
const errors = reactive({ email: '', password: '' })

const handleLogin = async () => {
  isLoading.value = true
  errors.email = ''
  errors.password = ''

  try {
    // 1. Sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (signInError) throw signInError;

    // 2. Get the user data to check their role
    const { data: { user } } = await supabase.auth.getUser();

    if (user && user.user_metadata) {
      const userRole = user.user_metadata.role;

      // 3. Redirect based on the role
      if (userRole === 'Super Admin') {
        // IMPORTANT: Make sure you have a route named 'SuperAdminDashboard'
        router.push({ name: 'SuperAdminDashboard' }); 
      } else if (userRole === 'Admin') {
        // IMPORTANT: Make sure you have a route named 'AdminDashboard'
        router.push({ name: 'AdminDashboard' });
      } else {
        // Default for 'Client' role
        router.push({ name: 'OrderingSystem' });
      }
    } else {
      throw new Error("Could not retrieve user details after login.");
    }

  } catch (err) {
    console.error('Login error:', err.message);
    if (err.message.includes('Invalid login credentials')) {
        errors.email = "Invalid email or password. Please try again.";
        errors.password = "Invalid email or password. Please try again.";
    } else if (err.message.includes('Email not confirmed')) {
        errors.email = "Please check your inbox and confirm your email address before logging in.";
    } else {
        errors.email = err.message;
    }
  } finally {
    isLoading.value = false;
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