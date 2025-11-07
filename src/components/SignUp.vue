<template>
  <div class="login-page">
    <div class="background-overlay"></div>
    <div class="container-fluid">
      <div class="row min-vh-100 align-items-center">
        <div class="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center bg-primary-gradient text-white position-relative">
          <div class="text-center z-index-2 px-4">
            <div class="mb-4">
              <i class="fas fa-user-plus fa-5x mb-3 text-white-50"></i>
            </div>
            <h1 class="display-4 fw-bold mb-3">i-Tyre</h1>
            <h2 class="h3 fw-light mb-4">Welcome to Sign Up Page</h2>
            <p class="lead mb-0">
              Create your account to place orders and track your transactions.
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

        <div class="col-12 col-lg-6 d-flex flex-column justify-content-center py-5">
          <div class="login-form-container mx-auto w-100 px-3 px-sm-4 px-md-5">
            <div class="card shadow-lg border-0 rounded-4">
              <div class="card-body p-4 p-sm-5">
                <div class="text-center mb-4">
                  <div class="avatar-wrapper mx-auto mb-3">
                    <div class="avatar bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                      <i class="fas fa-user-plus fa-2x text-primary"></i>
                    </div>
                  </div>
                  <h3 class="card-title fw-bold text-dark mb-2">Create an Account</h3>
                  <p class="text-muted mb-0">Fill out the form to register</p>
                </div>

                <form @submit.prevent="handleSignUp" novalidate>
                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-user me-2 text-muted"></i>Create Username
                    </label>
                    <input type="text" class="form-control form-control-lg rounded-3" v-model="form.username" placeholder="Enter your username" required :class="{ 'is-invalid': errors.username }" />
                    <div v-if="errors.username" class="invalid-feedback">{{ errors.username }}</div>
                  </div>

                  <div class="mb-3">
                  <label class="form-label fw-semibold">
                    <i class="fas fa-envelope me-2 text-muted"></i>Email
                  </label>
                  <input
                    type="email"
                    class="form-control form-control-lg rounded-3"
                    v-model="form.email"
                    placeholder="Enter your Gmail address"
                    required
                    :class="{ 'is-invalid': errors.email }"
                  />
                  <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-lock me-2 text-muted"></i>Create Password
                    </label>
                    <div class="password-wrapper">
                      <input
                        :type="passwordFieldType"
                        class="form-control form-control-lg rounded-3"
                        v-model="form.password"
                        placeholder="Enter your password"
                        required
                        :class="{ 'is-invalid': errors.password }"
                        @copy.prevent
                        @paste.prevent
                      />
                      <img
                        :src="passwordIcon"
                        @click="togglePasswordVisibility('password')"
                        alt="Toggle password visibility"
                        class="password-toggle-icon"
                      />
                    </div>
                    <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">
                      <i class="fas fa-check-circle me-2 text-muted"></i>Confirm Password
                    </label>
                    <div class="password-wrapper">
                      <input
                        :type="confirmPasswordFieldType"
                        class="form-control form-control-lg rounded-3"
                        v-model="form.confirmPassword"
                        placeholder="Re-enter your password"
                        required
                        :class="{ 'is-invalid': errors.confirmPassword }"
                      />
                      <img
                        :src="confirmPasswordIcon"
                        @click="togglePasswordVisibility('confirmPassword')"
                        alt="Toggle confirm password visibility"
                        class="password-toggle-icon"
                      />
                    </div>
                    <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
                  </div>

                  <div class="form-check mb-4">
                    <input class="form-check-input" type="checkbox" id="facialRecognition" v-model="form.facialRecognition" />
                    <label class="form-check-label" for="facialRecognition">
                      Enable facial recognition login and agree to the <a href="#">Terms and Conditions</a>
                    </label>
                  </div>

                  <div class="d-grid mb-4">
                    <button type="submit" class="btn btn-primary btn-lg rounded-3 fw-semibold" :disabled="isLoading">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="fas fa-user-plus me-2"></i>
                      {{ isLoading ? 'Processing...' : 'Sign Up' }}
                    </button>
                  </div>
                </form>

                <div class="text-center">
                  <button
                    type="button"
                    class="btn btn-outline-secondary rounded-3"
                    @click="$router.push({ path: '/login' })"
                  >
                    <i class="fas fa-arrow-left me-2"></i>Back to Login
                  </button>
                </div>
              </div>
            </div>

            <div class="text-center mt-4">
              <p class="text-muted small mb-0">
                © 2025 RYT-Tyre. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCameraModal" class="camera-modal">
      <div class="camera-modal-content">
        <h4 class="text-center mb-3">Face Verification</h4>
        <p class="text-center text-muted mb-3">Please center your face in the frame and capture a photo.</p>
        <video ref="videoRef" autoplay playsinline class="w-100 rounded-3 mb-3"></video>
        <div class="d-grid gap-2">
          <button v-if="hasMultipleCameras" @click="flipCamera" class="btn btn-outline-primary">
            <i class="fas fa-sync-alt me-2"></i>Flip Camera
          </button>
          <button @click="captureAndVerify" class="btn btn-success btn-lg">
            <i class="fas fa-camera me-2"></i>Capture Photo
          </button>
          <button @click="closeCamera" class="btn btn-secondary btn-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// --- IMPORTS & SETUP ---
import { ref, reactive, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../server/supabase'

// Initialize the router
const router = useRouter()

// --- REACTIVE FORM STATE (UNCHANGED) ---
const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    facialRecognition: false
})
const errors = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

// UI state management (UNCHANGED)
const isLoading = ref(false)
const showCameraModal = ref(false)
const videoRef = ref(null)
let stream = null; // Holds the MediaStream object from the camera
const facingMode = ref('user');
const hasMultipleCameras = ref(false);

// --- PASSWORD VISIBILITY LOGIC (UNCHANGED) ---
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const passwordFieldType = computed(() => {
    return isPasswordVisible.value ? 'text' : 'password'
})
const confirmPasswordFieldType = computed(() => {
    return isConfirmPasswordVisible.value ? 'text' : 'password'
})

const passwordIcon = computed(() => {
    return isPasswordVisible.value ? '/images/passHide.png' : '/images/passShow.png'
})
const confirmPasswordIcon = computed(() => {
    return isConfirmPasswordVisible.value ? '/images/passHide.png' : '/images/passShow.png'
})

const togglePasswordVisibility = (field) => {
    if (field === 'password') {
        isPasswordVisible.value = !isPasswordVisible.value
    } else if (field === 'confirmPassword') {
        isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
    }
}

// --- CAMERA CONTROL FUNCTIONS (UNCHANGED) ---
const startCamera = async () => {
    // ... (logic)
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    try {
        // Only attempt to access camera if the modal is intended to be shown
        if (!showCameraModal.value) return;

        const constraints = { video: { facingMode: facingMode.value }, audio: false };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.value) {
            videoRef.value.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please ensure you have given permission.");
        closeCamera();
    }
}

const flipCamera = async () => {
    facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
    await startCamera();
}

/**
 * Ensures the stream is stopped and the modal state is reset.
 */
const closeCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null; // Explicitly clear the stream reference
    }
    showCameraModal.value = false
    isLoading.value = false;
}

const captureAndVerify = async () => {
    // ... (logic)
    if (!videoRef.value) return;

    isLoading.value = true;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg');

    closeCamera();

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-face`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64 })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Face verification failed.');
        }

        console.log('Face verification successful!');
        await proceedWithSupabaseSignUp();

    } catch (error) {
        console.error('Face verification failed:', error.message);
        alert(`Face verification failed: ${error.message}`);
    } finally {
        if(showCameraModal.value === false) {
            isLoading.value = false;
        }
    }
}

const proceedWithSupabaseSignUp = async () => {
    isLoading.value = true;
    const fullEmail = form.email.trim();

    try {
        const { data, error } = await supabase.auth.signUp({
            email: fullEmail,
            password: form.password,
            options: {
                data: {
                    username: form.username
                }
            }
        });

        if (error) throw error;

        alert('Account created! Please check your email for a verification link.');
        router.push({ name: 'login' });

    } catch (error) {
        if (error.message.includes('User already registered') || error.message.includes('duplicate key value violates unique constraint')) {
            errors.email = 'User Account Already Exist';
        } else {
            alert(`Sign-up failed: ${error.message}`);
        }
        console.error('Sign-up failed:', error.message);
    } finally {
        isLoading.value = false;
    }
};

const isValidEmail = (email) => {
    const gmailRegex = /^[^\s@]+@gmail\.com$/;
    return gmailRegex.test(email);
}


/**
 * Main function to handle form submission.
 * GUARANTEED to check the database first and abort the camera if the account exists.
 */
const handleSignUp = async () => {
    // 1. Reset errors and perform initial local validation
    errors.username = ''
    errors.email = ''
    errors.password = ''
    errors.confirmPassword = ''

    // Explicitly hide the camera modal before starting, in case it was left open from a previous attempt
    showCameraModal.value = false;

    let hasError = false;
    const usernameLength = form.username.trim().length;

    // Local Validation checks (UNCHANGED)
    if (!form.username.trim() || usernameLength < 6 || usernameLength > 12) {
        errors.username = 'Username must be between 6 and 12 characters';
        hasError = true;
    }

    if (!form.email.trim() || !isValidEmail(form.email.trim())) {
        errors.email = 'Please enter a valid @gmail.com address';
        hasError = true;
    }

    if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        hasError = true;
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        hasError = true;
    }

    if (!form.facialRecognition) {
        alert('You must enable facial recognition and agree to the terms to proceed.');
        hasError = true;
    }

    if (hasError) {
        isLoading.value = false;
        return; // Abort here if any client-side validation fails
    }

    // Set loading state now that local validation passed
    isLoading.value = true;

    // 2. GUARANTEED DATABASE CHECK BEFORE CAMERA INITIATION
    const fullEmailForCheck = form.email.trim();

    try {
        // Await ensures the function pauses until the response is received
        const { data: exists, error: checkError } = await supabase.rpc('user_profile_exists_by_email', {
            p_email: fullEmailForCheck
        });

        if (checkError) {
             throw checkError;
        }

        if (exists === true) {
            // Success! Account exists. ABORT CAMERA AND SHOW ERROR.
            errors.email = 'User Account Already Exist';
            // 🚨 CRITICAL FIX: Ensure camera is closed/aborted even if it somehow started
            closeCamera();
            isLoading.value = false;
            return;  }

    } catch (error) {
        console.error('Pre-sign-up check failed:', error.message);
        alert(`A verification error occurred: ${error.message}`);
        closeCamera(); // Shut down camera on API/DB error
        isLoading.value = false;
        return; // Abort on any Supabase/RPC error
    }

    // 3. PROCEED TO FACE RECOGNITION (Only runs if the return in step 2 was NOT hit)
    if (form.facialRecognition) {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            hasMultipleCameras.value = videoDevices.length > 1;
        } catch (err) {
            console.error("Could not enumerate devices:", err);
            hasMultipleCameras.value = false;
        }

        // Camera initiation only happens AFTER successful database check
        showCameraModal.value = true;
        startCamera();
    } else {
        await proceedWithSupabaseSignUp();
    }
}

// --- LIFECYCLE HOOKS (UNCHANGED) ---

onUnmounted(() => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
})
</script>

<style scoped>

/* --- ⬇️ NEW STYLES for Password Toggle and Email Input --- */

/* Ensures the email input and @gmail.com suffix align nicely */
.input-group-lg > .form-control,
.input-group-lg > .input-group-text {
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  border-radius: 0.3rem; /* Keep consistent with form-control-lg */
}
.input-group-lg > .form-control {
  border-right: 0; /* Remove border between input and suffix */
}
/* Ensure rounded corners on the input-group children */
.input-group-lg .form-control.rounded-start-3 {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.input-group-lg .input-group-text.rounded-end-3 {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

/* Password Wrapper Styles (unchanged from your original, but included for completeness) */
.password-wrapper {
  position: relative;
}

.password-wrapper .form-control {
  padding-right: 45px;
}

.password-toggle-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 18px;
  height: auto;
  cursor: pointer;
  z-index: 3;
}
/* --- ⬆️ END OF NEW STYLES --- */

/* All existing styles remain the same */
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

.login-form-container {
  max-width: 720px;
  width: 100%;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.avatar-wrapper,
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

/* NEW: Styles for the camera modal */
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.camera-modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
</style>