<template>
  <div class="signup-page min-vh-100">
    <div class="background-overlay"></div>

    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary-gradient text-white position-relative">
          <div class="text-center z-index-2">
            <div class="mb-4">
              <i class="fas fa-user-shield fa-5x mb-3 text-white-50"></i>
            </div>
            <h1 class="display-4 fw-bold mb-3">RYT-Tyre</h1>
            <h2 class="h3 fw-light mb-4">Super Admin Portal</h2>
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

        <div class="col-lg-6 d-flex flex-column justify-content-center">
          <div class="login-form-container mx-auto">

            <div class="card shadow-lg border-0 rounded-4">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <div class="d-inline-flex align-items-center justify-content-center avatar-lg bg-primary-subtle rounded-circle mb-3">
                    <i class="fas fa-user-plus fa-2x text-primary"></i>
                  </div>
                  <h3 class="card-title fw-bold text-dark mb-2">Sign Up</h3>
                  <p class="text-muted mb-0">Create a Super Admin account</p>
                </div>

                <form @submit.prevent="handleSignUp" >
                  <div class="mb-3">
                    <label for="username-input" class="form-label fw-semibold">
                      <i class="fas fa-user me-2 text-muted"></i>Enter Username
                    </label>
                    <input 
                      type="username" 
                      class="form-control form-control-lg rounded-3" 
                      id="username-input" 
                      v-model="username"
                      placeholder="Enter username"
                      required
                      :class="{ 'is-invalid': errors.username }"
                    >
                    <div v-if="errors.username" class="invalid-feedback">
                      <i class="fas fa-exclamation-circle me-1"></i>{{ errors.username }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="email-input" class="form-label fw-semibold">
                      <i class="fas fa-envelope me-2 text-muted"></i>Enter Email
                    </label>
                    <input 
                      type="email" 
                      class="form-control form-control-lg rounded-3" 
                      id="email-input" 
                      v-model="email"
                      placeholder="Enter email"
                      required
                      :class="{ 'is-invalid': errors.email }"
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      <i class="fas fa-exclamation-circle me-1"></i>{{ errors.email }}
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="password-input" class="form-label fw-semibold">
                      <i class="fas fa-lock me-2 text-muted"></i>Create Password
                    </label>
                    <input 
                      type="password" 
                      class="form-control form-control-lg rounded-3" 
                      id="password-input" 
                      v-model="password"
                      placeholder="Create password"
                      required
                      :class="{ 'is-invalid': errors.password }"
                    >
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
                      <i v-else class="fas fa-user-check me-2"></i>
                      {{ isLoading ? 'Creating account...' : 'Sign Up' }}
                    </button>
                  </div>

                  <div class="text-center">
                    <p class="text-muted mb-3">Already have an account?</p>
                    <div class="d-flex justify-content-center gap-2">
                        <RouterLink to="/super-login"  class="btn btn-outline-secondary rounded-3">
                           <i class="fas fa-sign-in-alt me-2"></i>Login
                        </RouterLink>
                        <RouterLink to="/" class="btn btn-outline-info rounded-3">
                           <i class="fas fa-user-circle me-2"></i>Return to Selection
                        </RouterLink>
                    </div>
                  </div>
                </form>
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { supabase } from '../server/supabase';
import router from '../router/index';

const isLoading = ref(false);
const errors = reactive({ username: '', email: '', password: ''});
const successMessage = ref(""); // Note: This will now be largely unused as we redirect

const username = ref("");
const email = ref("");
const password = ref("");
const isSigningUp = ref(false);

const handleSignUp = async () => {
    isLoading.value = true;
    errors.username = '';
    errors.email = '';
    errors.password = '';
    successMessage.value = '';

    // Basic validation before request
    if (!username.value) { errors.username = "Username is required."; isLoading.value = false; return; }
    if (!email.value) { errors.email = "Email is required."; isLoading.value = false; return; }
    if (!password.value) { errors.password = "Password is required."; isLoading.value = false; return; }

    try {
        isSigningUp.value = true;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });

        if (signUpError) {
            console.error('Sign up error:', signUpError.message);
            if (signUpError.message.toLowerCase().includes("password")) {
                errors.password = signUpError.message;
            } else {
                errors.email = signUpError.message;
            }
            isSigningUp.value = false;
            isLoading.value = false;
            return;
        }

        // 🎯 CRITICAL CHANGE: Redirect to Success.vue immediately after a successful sign-up email is sent.
        // This confirms the action to the user and tells them to check their email.
        router.push("/success");
        isSigningUp.value = false;

        // The following block is now redundant, but kept for context/fallback if session exists
        const user = signUpData.user;
        if (user) {
            await insertProfile(user.id);
        }

    } catch (err) {
        console.error('An unexpected error occurred:', err.message);
        errors.email = "An unexpected error occurred. Please try again.";
    } finally {
        isLoading.value = false;
    }
};

// Extracted function for inserting the profile
const insertProfile = async (userId) => {
    const { error: insertError } = await supabase
        .from('superaccount')
        .insert([
            { user_id: userId, username: username.value, email: email.value }
        ]);

    if (insertError) {
        console.error('Profile insertion error:', insertError.message);
        return;
    }

    console.log('User signed up and profile created:', userId);
    
    // ⚠️ IMPORTANT: Removed the router.push("/super-login") from here.
    // In a real application, after profile insertion on confirmation, you'd typically redirect to the main app dashboard.
};

onMounted(() => {
    // This listener is for handling post-email confirmation flow (when the user clicks the link in the email).
    supabase.auth.onAuthStateChange(async (event, session) => {
        // Run this logic when a user confirms their email and is signed in.
        if (event === 'SIGNED_IN' && !isSigningUp.value) {
            const user = session?.user;
            if (user) {
                // Now it's safe to insert the profile.
                await insertProfile(user.id);
                
                // After email verification and profile insertion, redirect to the dashboard or main app area.
                // NOTE: '/admin' is used here as an example dashboard route from your router configuration.
                router.push("/success"); // Redirect to success page after email confirmation
            }
        }
    });
});
</script>

<style scoped>
.signup-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  /* Ensure this background property is removed to fix the white layer */
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

/* RE-WRITTEN CARD DESIGN CODE - CSS STARTS HERE */

/* Removed .avatar-wrapper and .avatar specific rules */
/* Combined into a single utility-like class for direct use on the div */
.avatar-lg {
  width: 80px;
  height: 80px;
  display: flex; /* Ensure flex properties if not already there from d-inline-flex */
  align-items: center;
  justify-content: center;
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

/* Password toggle button and icon styles (not directly part of the card structure but related to inputs) */
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

.password-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.password-toggle-btn:hover .password-icon {
  opacity: 0.8;
}

/* RE-WRITTEN CARD DESIGN CODE - CSS ENDS HERE */

/* Floating shapes animation - NO CHANGES HERE */
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

/* Responsive adjustments - NO CHANGES HERE */
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

/* Icon styling - NO CHANGES HERE */
.fas {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}
</style>