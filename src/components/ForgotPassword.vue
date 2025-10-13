<template>
  <div class="login-page">
    <div class="background-overlay"></div>

    <div class="container-fluid">
      <div class="row min-vh-100 align-items-center">
        <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary-gradient text-white position-relative">
          <div class="text-center z-index-2 px-4">
            <div class="mb-4">
              <i class="fas fa-key fa-5x mb-3 text-white-50"></i>
            </div>
            <h1 class="display-4 fw-bold mb-3">RYT-Tyre</h1>
            <h2 class="h3 fw-light mb-4">Password Reset</h2>
            <p class="lead mb-0">Recover your account access in a few simple steps.</p>
          </div>
          <div class="position-absolute top-0 start-0 w-100 h-100 opacity-10">
            <div class="floating-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6 d-flex flex-column justify-content-center py-5">
          <div class="login-form-container mx-auto w-100 px-3 px-sm-4 px-md-5">
            <div class="card shadow-lg border-0 rounded-4">
              <div class="card-body p-4 p-sm-5">
                <div class="text-center mb-4">
                  <div class="avatar-wrapper mx-auto mb-3">
                    <div class="avatar bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                      <i class="fas fa-envelope-open-text fa-2x text-primary"></i>
                    </div>
                  </div>
                  <h3 class="card-title fw-bold text-dark mb-2">Forgot Your Password?</h3>
                  <p class="text-muted mb-0">No problem. Enter your email below to get a reset link.</p>
                </div>

                <div v-if="message" class="alert" :class="isSuccess ? 'alert-success' : 'alert-danger'" role="alert">
                    <i class="fas" :class="isSuccess ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                    {{ message }}
                </div>

                <form @submit.prevent="handlePasswordReset" novalidate v-if="!isSuccess">
                  <div class="mb-4">
                    <label for="email" class="form-label fw-semibold">
                      <i class="fas fa-envelope me-2 text-muted"></i>Email Address
                    </label>
                    <input
                      type="email"
                      class="form-control form-control-lg rounded-3"
                      id="email"
                      v-model="email"
                      placeholder="Enter your registered email"
                      required
                    />
                  </div>
                  <div class="d-grid mb-4">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg rounded-3 fw-semibold"
                      :disabled="isLoading"
                    >
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="fas fa-paper-plane me-2"></i>
                      {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
                    </button>
                  </div>
                </form>

                <div class="text-center">
                  <button
                    type="button"
                    class="btn btn-outline-secondary rounded-3"
                    @click="$router.push({ name: 'login' })"
                  >
                    <i class="fas fa-arrow-left me-2"></i>Back to Login
                  </button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../server/supabase'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const handlePasswordReset = async () => {
  if (!email.value) {
    isSuccess.value = false;
    message.value = 'Please enter your email address.';
    return;
  }

  isLoading.value = true;
  message.value = '';
  isSuccess.value = false;

  try {
    // FIX: Add the hash symbol (#) to the path to ensure Vue Router (in hash mode)
    // catches the redirect and the session token for the update page.
    const redirectTo = `${window.location.origin}/#/Update-Password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: redirectTo,
    });

    if (error) throw error;

    isSuccess.value = true;
    message.value = 'Success! If an account exists for this email, a password reset link has been sent to your inbox.';

  } catch (error) {
    isSuccess.value = false;
    // Show a generic message to prevent leaking information about which emails are registered
    message.value = 'If an account exists for this email, a password reset link has been sent. If you don\'t see it, please check your spam folder.';
    console.error('Password reset error:', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Using the same consistent styles from your Login/Sign Up pages */
.login-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}
.background-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: url('../assets/background.jpg') no-repeat center center;
  background-size: cover; opacity: 0.1; z-index: 1;
}
.bg-primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative; overflow: hidden;
}
.login-form-container { max-width: 520px; width: 100%; position: relative; z-index: 2; }
.avatar-wrapper, .avatar { width: 80px; height: 80px; }
.card { backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.95); }
.form-control:focus { border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25); }
.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; transition: all 0.3s ease; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }
.floating-shapes { position: relative; width: 100%; height: 100%; }
.shape { position: absolute; background: rgba(255, 255, 255, 0.1); border-radius: 50%; animation: float 6s ease-in-out infinite; }
.shape-1 { width: 100px; height: 100px; top: 20%; left: 10%; }
.shape-2 { width: 150px; height: 150px; top: 60%; right: 15%; animation-delay: 2s; }
.shape-3 { width: 80px; height: 80px; bottom: 20%; left: 60%; animation-delay: 4s; }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
</style>
