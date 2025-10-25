<template>
  <div class="login-page">
    <div class="background-overlay"></div>
    <div class="container-fluid">
      <div class="row min-vh-100 align-items-center">
        <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary-gradient text-white position-relative">
          <div class="text-center z-index-2 px-4">
            <div class="mb-4">
              <i class="fas fa-shield-alt fa-5x mb-3 text-white-50"></i>
            </div>
            <h1 class="display-4 fw-bold mb-3">RYT-Tyre</h1>
            <h2 class="h3 fw-light mb-4">Secure Your Account</h2>
            <p class="lead mb-0">Create a new, strong password to regain access.</p>
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
                      <i class="fas fa-lock fa-2x text-primary"></i>
                    </div>
                  </div>
                  <h3 class="card-title fw-bold text-dark mb-2">Create New Password</h3>
                  <p class="text-muted mb-0">Your new password must be at least 6 characters long.</p>
                </div>

                <div v-if="message" class="alert" :class="isSuccess ? 'alert-success' : 'alert-danger'" role="alert">
                    <i class="fas" :class="isSuccess ? 'fa-check-circle' : 'fa-exclamation-triangle'"></i>
                    {{ message }}
                </div>

                <form @submit.prevent="handleUpdatePassword" novalidate v-if="!isSuccess">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-lock me-2 text-muted"></i>New Password
                    </label>
                    <div class="password-wrapper">
                      <input 
   :type="passwordFieldType" 
 class="form-control form-control-lg rounded-3" 
 v-model="form.password" 
 placeholder="Enter your new password" 
 required 
 />
                      <img
   :src="passwordIcon"
 @click="togglePasswordVisibility"
 alt="Toggle password visibility"
 class="password-toggle-icon" />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-lock me-2 text-muted"></i>Confirm New Password
                    </label>
                    <input 
   type="password" 
class="form-control form-control-lg rounded-3" 
 v-model="form.confirmPassword" 
 placeholder="Confirm your new password" 
required 
 />
                  </div>

                  <div class="d-grid mb-4">
                    <button
  type="submit"
class="btn btn-primary btn-lg rounded-3 fw-semibold"
:disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="fas fa-save me-2"></i>
                      {{ isLoading ? 'Updating...' : 'Update Password' }}
                    </button>
                  </div>
                </form>

                <div class="text-center" v-if="isSuccess">
                    <button type="button" class="btn btn-outline-primary rounded-3" @click="goToLogin">
                        <i class="fas fa-sign-in-alt me-2"></i>Go Back to Main Page
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
// --- IMPORTS & SETUP ---
import { ref, reactive, computed, onMounted } from 'vue' 
import { useRouter } from 'vue-router' 
import { supabase } from '../server/supabase' 

// Initialize the router
const router = useRouter()

// --- REACTIVE STATE ---
const form = reactive({
  password: '',
  confirmPassword: '',
})

const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(false)

// --- HELPER FUNCTIONS ---

/**
 * Extracts a parameter from the URL hash, e.g., 'access_token'
 */
const getHashParam = (key) => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get(key);
}

/**
 * 🛑 CRITICAL FIX: Attempts to set the Supabase session using the token from the URL hash.
 */
const setSupabaseSessionFromHash = async () => {
    const accessToken = getHashParam('access_token');
    
    if (accessToken) {
        console.warn('Access Token found in URL. Attempting to manually set session.');
        
        // Use the access_token to explicitly establish a temporary session.
        const { error } = await supabase.auth.setSession({ access_token: accessToken });
        
        if (error) {
            console.error('Error manually setting session:', error.message);
            // If setting session fails here, it confirms the token is invalid/expired/used.
            message.value = 'Failed to process the password reset token. It may be expired or invalid.';
        } else {
            console.log('Temporary session successfully set for password update.');
        }
    }
}


// --- LIFECYCLE HOOKS ---
/**
 * Executes when the component is mounted. Attempts to set the temporary session
 * from the URL hash.
 */
onMounted(async () => {
    // 1. Manually set the session first to ensure the token is active for the update.
    await setSupabaseSessionFromHash();

    // 2. Clear the browser's view of a persistent session if one exists (safe guard).
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            console.log('Persistent user session detected. Forcing sign out.');
            await supabase.auth.signOut();
        }
    } catch (error) {
        // Ignore errors if no user is found.
    }
});

// --- PASSWORD VISIBILITY LOGIC ---
const isPasswordVisible = ref(false)
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password')
const passwordIcon = computed(() => isPasswordVisible.value ? '/images/passHide.png' : '/images/passShow.png')
const togglePasswordVisibility = () => { isPasswordVisible.value = !isPasswordVisible.value }

// --- NAVIGATION FUNCTION ---
const goToLogin = () => router.push({ name: 'login' });

// --- MAIN UPDATE FUNCTION ---
const handleUpdatePassword = async () => {
  // Reset message and status
  message.value = '';
  isSuccess.value = false;

  // --- Input Validation ---
  if (!form.password || !form.confirmPassword) {
    message.value = 'Please fill in both password fields.';
    return;
  }
  if (form.password.length < 6) {
    message.value = 'Password must be at least 6 characters long.';
    return;
  }
  if (form.password !== form.confirmPassword) {
    message.value = 'Passwords do not match.';
    return;
  }
  
  // Set loading state before API call
  isLoading.value = true;

  try {
    // The previous call to setSessionFromHash ensures the temporary session is active here.
    const { error } = await supabase.auth.updateUser({
      password: form.password,
    });
    
    if (error) throw error;
    
    // 🛑 CRITICAL FINAL STEP: Sign the user out to clear the temporary token and force a new login.
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
        console.warn('Warning: Could not clear session after password update.', signOutError);
    }
    
    // 3. Success state (with updated button text)
    isSuccess.value = true;
    message.value = 'Your password has been updated successfully! Please Go Back to the Main Page with your new password.';

  } catch (error) {
    // Error state
    isSuccess.value = false;
    message.value = `Failed to update password. This usually means the reset link has expired, or the token is invalid. Error: ${error.message}`;
    console.error('Password update error:', error);
  } finally {
    // Always reset loading state
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Using the same consistent styles from your other pages */
.login-page { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; }
.background-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('/images/background.jpg') no-repeat center center; background-size: cover; opacity: 0.1; z-index: 1; }
.bg-primary-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position: relative; overflow: hidden; }
.login-form-container { max-width: 520px; width: 100%; position: relative; z-index: 2; }
.avatar-wrapper, .avatar { width: 80px; height: 80px; }
.card { backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.95); }
.form-control:focus { border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25); }
.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; transition: all 0.3s ease; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }
.password-wrapper { position: relative; }
.password-wrapper .form-control { padding-right: 45px; }
.password-toggle-icon { position: absolute; top: 50%; right: 15px; transform: translateY(-50%); width: 18px; height: auto; cursor: pointer; z-index: 3; }
.floating-shapes { position: relative; width: 100%; height: 100%; }
.shape { position: absolute; background: rgba(255, 255, 255, 0.1); border-radius: 50%; animation: float 6s ease-in-out infinite; }
.shape-1 { width: 100px; height: 100px; top: 20%; left: 10%; }
.shape-2 { width: 150px; height: 150px; top: 60%; right: 15%; animation-delay: 2s; }
.shape-3 { width: 80px; height: 80px; bottom: 20%; left: 60%; animation-delay: 4s; }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
</style>