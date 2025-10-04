<template>
  <div class="signup-page min-vh-100">
    <div class="background-overlay"></div>

    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary-gradient text-white position-relative">
          <div class="text-center z-index-2">
            <div class="mb-4">
              <i class="fas fa-box-open fa-5x mb-3 text-white-50"></i>
            </div>
            <h1 class="display-4 fw-bold mb-3">RYT-Tyre</h1>
            <h2 class="h3 fw-light mb-4">Customer Portal</h2>
            <p class="lead mb-0">
              Manage your orders and services seamlessly.
            </p>
          </div>
          <div class="position-absolute top-0 start-0 w-100 h-100 opacity-10"></div>
        </div>

        <div class="col-lg-6 d-flex flex-column justify-content-center">
          <div class="login-form-container mx-auto">
            <div class="card shadow-lg border-0 rounded-4">
              <div class="card-body p-5">
                <div class="text-center mb-4">
                  <div class="d-inline-flex align-items-center justify-content-center avatar-lg bg-primary-subtle rounded-circle mb-3">
                    <i class="fas fa-user-plus fa-2x text-primary"></i>
                  </div>
                  <h3 class="card-title fw-bold text-dark mb-2">Create Your Account</h3>
                  <p class="text-muted mb-0">A quick liveness check is required</p>
                </div>

                <div v-if="errors.form" class="alert alert-danger mb-3">
                  {{ errors.form }}
                </div>
                 <div v-if="livenessStatus" class="alert alert-info mb-3">
                  {{ livenessStatus }}
                </div>

                <form @submit.prevent="handleSignUp">
                  <div class="mb-3">
                    <label for="username-input" class="form-label fw-semibold">Username</label>
                    <input type="text" class="form-control form-control-lg rounded-3" id="username-input" v-model="username" required>
                  </div>
                  <div class="mb-3">
                    <label for="email-input" class="form-label fw-semibold">Email</label>
                    <input type="email" class="form-control form-control-lg rounded-3" id="email-input" v-model="email" required>
                  </div>
                  <div class="mb-4">
                    <label for="password-input" class="form-label fw-semibold">Password</label>
                    <input type="password" class="form-control form-control-lg rounded-3" id="password-input" v-model="password" required>
                  </div>
                  
                  <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg rounded-3 fw-semibold" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="fas fa-user-check me-2"></i>
                      {{ isLoading ? 'Verifying...' : 'Start Verification' }}
                    </button>
                  </div>
                  
                  <div class="text-center">
                    <p class="text-muted mb-3">Already have an account?</p>
                    <RouterLink to="/" class="btn btn-outline-secondary rounded-3">
                       <i class="fas fa-sign-in-alt me-2"></i>Login
                    </RouterLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { supabase } from '../server/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const errors = reactive({ form: '' });
const livenessStatus = ref('');

const username = ref("");
const email = ref("");
const password = ref("");

const handleSignUp = async () => {
  isLoading.value = true;
  errors.form = '';
  livenessStatus.value = 'Starting liveness check...';

  if (!username.value || !email.value || !password.value) {
    errors.form = 'All fields are required.';
    isLoading.value = false;
    return;
  }

  try {
    // 1. Call your backend to get a liveness SessionId
    const response = await fetch('/api/create-liveness-session', { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not start liveness session.');

    const { SessionId } = data;

    // 2. Open the liveness check UI in a new window
    const livenessUrl = `https://us-east-1.face.rekognition.aws/start-liveness-session?sessionId=${SessionId}`;
    const livenessWindow = window.open(livenessUrl, '_blank', 'width=500,height=700');
    
    // 3. Start polling for the result
    pollForResults(SessionId, livenessWindow);

  } catch (error) {
    console.error(error);
    errors.form = error.message;
    isLoading.value = false;
    livenessStatus.value = '';
  }
};

const pollForResults = (sessionId, livenessWindow) => {
  livenessStatus.value = 'Liveness check in progress... Please complete the steps in the pop-up window.';
  
  const intervalId = setInterval(async () => {
    // Stop polling if the window is closed by the user
    if (livenessWindow.closed) {
      clearInterval(intervalId);
      errors.form = 'Liveness check cancelled.';
      isLoading.value = false;
      livenessStatus.value = '';
      return;
    }

    try {
      const response = await fetch('/api/get-liveness-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ SessionId: sessionId }),
      });
      const result = await response.json();

      // We only care if the check has succeeded
      if (result.status === 'SUCCEEDED') {
        clearInterval(intervalId);
        livenessWindow.close();

        if (result.isLive) {
          livenessStatus.value = 'Liveness check passed! Creating your account...';
          await createSupabaseUser();
        } else {
          throw new Error('Liveness check failed. Please try again.');
        }
      }
    } catch (error) {
      clearInterval(intervalId);
      errors.form = error.message;
      isLoading.value = false;
      livenessStatus.value = '';
    }
  }, 2000); // Check for the result every 2 seconds
};

const createSupabaseUser = async () => {
  const { error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { 
        username: username.value,
        role: 'Client'
      }
    }
  });

  if (signUpError) {
      errors.form = signUpError.message;
  } else {
    alert("Sign up successful! Please check your email for verification.");
    router.push({ name: 'Login' }); // Or your login route
  }
  
  isLoading.value = false;
  livenessStatus.value = '';
};
</script>

<style scoped>

/* Include the rest of the original CSS from SuperSignUp.vue */
.signup-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

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