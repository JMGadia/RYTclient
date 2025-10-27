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
             <h1 class="display-4 fw-bold mb-3">RYT-Tyre</h1>
             <h2 class="h3 fw-light mb-4">Customer Sign Up</h2>
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
                    <input type="email" class="form-control form-control-lg rounded-3" v-model="form.email" placeholder="Enter your email" required :class="{ 'is-invalid': errors.email }" />
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
                      />
                      <img
                        :src="passwordIcon"
                        @click="togglePasswordVisibility"
                        alt="Toggle password visibility"
                        class="password-toggle-icon"
                      />
                    </div>
                    <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
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
import { ref, reactive, onUnmounted, computed } from 'vue' // Core Vue functions for state, reactivity, and cleanup
import { useRouter } from 'vue-router' // Vue Router hook for navigation
import { supabase } from '../server/supabase' // Supabase client for authentication and database calls

// Initialize the router
const router = useRouter()

// --- REACTIVE FORM STATE ---

// Data binding for the sign-up form inputs
const form = reactive({
  username: '',
  email: '',
  password: '',
  facialRecognition: false // Checkbox state for enabling face verification
})

// State for validation errors
const errors = reactive({
  username: '',
  email: '',
  password: ''
})

// UI state management
const isLoading = ref(false) // Global loading indicator
const showCameraModal = ref(false) // Controls visibility of the facial recognition modal
const videoRef = ref(null) // Reference to the HTML <video> element
let stream = null; // Holds the MediaStream object from the camera
let capturedImageBase64 = null; // To store the image data after capture

// Facial recognition control state
const facingMode = ref('user'); // Tracks the current camera direction ('user' or 'environment')
const hasMultipleCameras = ref(false); // Controls the visibility of the "Flip Camera" button

// --- PASSWORD VISIBILITY LOGIC ---

const isPasswordVisible = ref(false)

// Computed property to switch the password input type
const passwordFieldType = computed(() => {
  return isPasswordVisible.value ? 'text' : 'password'
})

// Computed property to switch the eye icon
const passwordIcon = computed(() => {
  return isPasswordVisible.value ? '/images/passHide.png' : '/images/passShow.png'
})

/**
 * Toggles the state of password visibility.
 */
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

// --- CAMERA CONTROL FUNCTIONS ---

/**
 * Initiates the camera stream using the currently selected `facingMode`.
 * Stops any existing stream before starting a new one.
 */
const startCamera = async () => {
 // Stop the previous stream to release the camera resource
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  try {
    // Constraints object to select the camera based on `facingMode`
    const constraints = {
      video: { facingMode: facingMode.value },
      audio: false
    };
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

/**
 * Toggles the camera between 'user' (front) and 'environment' (back) and restarts the stream.
 */
const flipCamera = async () => {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
  await startCamera(); // Restart the camera with the new facing mode
}

/**
 * Stops the camera stream and closes the modal.
 */
const closeCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  showCameraModal.value = false
  isLoading.value = false;
}

/**
 * Captures an image from the video stream and sends it for facial verification.
 * Proceeds to Supabase sign-up on successful verification.
 */
const captureAndVerify = async () => {
  if (!videoRef.value) return;

  isLoading.value = true;

  // Capture image from video stream into a base64 string
  const canvas = document.createElement('canvas');
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
  capturedImageBase64 = canvas.toDataURL('image/jpeg'); // Store the captured image

  closeCamera(); // Close camera immediately after capture

  try {
    // Send image to external API for face verification
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-face`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: capturedImageBase64 }) // Use the stored image
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Face verification failed.');
    }

    console.log('Face verification successful!');
    // Proceed with sign-up and image storage ONLY IF face verification succeeds
    await uploadImageAndSignUp(capturedImageBase64);

  } catch (error) {
    console.error('Face verification failed:', error.message);
    alert(`Face verification failed: ${error.message}`);
  } finally {
    // Only reset global loading if the camera modal isn't still being shown (shouldn't happen here)
    if(showCameraModal.value === false) {
      isLoading.value = false;
    }
    capturedImageBase64 = null; // Clear the image data
  }
}

/**
 * Registers the user with Supabase, uploads the face image, and updates the profiles table.
 * @param {string} imageBase64 - The base64 string of the captured image.
 */
const uploadImageAndSignUp = async (imageBase64) => {
    isLoading.value = true;
    let user = null; // Variable to hold the user object for cleanup if needed

    try {
        // 1. Create the user account first, but DISABLE THE EMAIL CONFIRMATION
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    username: form.username
                },
                // NEW: Prevents automatic email sending
                disableEmailConfirmation: true
            }
        });

        if (authError) throw authError;

        user = authData.user;
        if (!user) throw new Error('User object not returned after sign up.');

        // 2. Upload the image to Supabase Storage
       const file = dataURLtoFile(imageBase64, `face.jpeg`); // Name the file generically
        // UPDATED: Use the folder structure face_images/user_id/face.jpeg
        const filePath = `face_images/${user.id}/face.jpeg`;

        const { error: storageError } = await supabase.storage
            .from('store_face')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (storageError) {
            console.error('Storage upload failed:', storageError.message);
            // Throw a specific error that will be caught below for cleanup
            throw new Error(`Account created, but image upload failed: ${storageError.message}`);
        }

        // 3. Get the public URL
        const { data: publicUrlData } = supabase.storage
            .from('store_face')
            .getPublicUrl(filePath);

        const image_url = publicUrlData.publicUrl;

        // 4. Update the profiles table with the image URL
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ image_url: image_url })
            .eq('id', user.id)
            .select();

        if (updateError) {
            console.error('Profile URL update failed:', updateError.message);
            // Throw a specific error that will be caught below for cleanup
            throw new Error(`Account created, image uploaded, but profile update failed: ${updateError.message}`);
        }

        // 5. NEW: MANUALLY TRIGGER THE EMAIL ONLY AFTER ALL STEPS SUCCEED
        const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: user.email
        });

        if (resendError) throw resendError;

        // Success feedback and redirect
        alert('Account created! Please check your email for a verification link.');
        router.push({ name: 'login' });

    } catch (error) {
        // If the error occurred AFTER auth.signUp, the user account exists but is unconfirmed.
        // It's often best to clean up the user or the uploaded file here, but for now,
        // we'll focus on error reporting.

        // This handles errors that occur after account creation (storage/profile update failure)
        if (error.message.includes('Account created')) {
            // The user exists, but the sign-up flow failed. We alert the specific failure.
            alert(`Sign-up failed: ${error.message}`);
        }
        // Custom error handling for existing users (may happen during the initial auth.signUp)
        else if (error.message.includes('User already registered') || error.message.includes('duplicate key value violates unique constraint')) {
            errors.email = 'User Account Already Exist';
        } else {
            // General failure, e.g., resend error, network error, etc.
            alert(`Sign-up failed: ${error.message}`);
        }
        console.error('Sign-up failed:', error.message);
    } finally {
        isLoading.value = false;
    }
};

/**
 * Utility function to convert a Base64 string to a File object.
 * @param {string} dataurl - The base64 string (e.g., "data:image/jpeg;base64,...").
 * @param {string} filename - The desired filename for the File object.
 * @returns {File} - The converted File object.
 */
function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}


/**
 * Basic email format validation utility.
 * @param {string} email - The email string to test.
 * @returns {boolean} - True if the email format is valid.
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Main function to handle form submission.
 * Validates fields, checks for existing user, and initiates the face verification flow.
 */
const handleSignUp = async () => {
    // Reset errors
    errors.username = ''
    errors.email = ''
    errors.password = ''

    let hasError = false;

    // Validation checks
    if (!form.username.trim()) { errors.username = 'Username is required'; hasError = true; }

    if (!form.email.trim()) {
        errors.email = 'Email is required';
        hasError = true;
    } else if (!isValidEmail(form.email.trim())) {
        errors.email = 'Please enter a valid email address';
        hasError = true;
    }

    if (form.password.length < 6) { errors.password = 'Password must be at least 6 characters'; hasError = true; }

    // Check for mandatory facial recognition
    if (!form.facialRecognition) {
      alert('You must enable facial recognition and agree to the terms to proceed.');
      hasError = true;
    }

    if (hasError) return;

    isLoading.value = true;

    try {
        // Pre-sign-up check: use a Supabase RPC to check if a user with this email already exists
        const { data: exists, error: checkError } = await supabase.rpc('user_profile_exists_by_email', {
            p_email: form.email.trim()
        });

        if (checkError) throw checkError;

        if (exists === true) {
            errors.email = 'User Account Already Exist';
            isLoading.value = false;
            return;
        }

    } catch (error) {
        console.error('Pre-sign-up check failed:', error.message);
        alert(`An error occurred during verification: ${error.message}`);
        isLoading.value = false;
        return;
    }

    // Logic to initiate camera/face verification
    if (form.facialRecognition) {
        // Enumerate devices to check if the flip button should be visible
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            hasMultipleCameras.value = videoDevices.length > 1;
        } catch (err) {
            console.error("Could not enumerate devices:", err);
            hasMultipleCameras.value = false;
        }

        showCameraModal.value = true;
        startCamera(); // Starts the default (front) camera
    } else {
        // Fallback (though the checkbox is mandatory, this keeps the logic clean)
        isLoading.value = false;
    }
}

// --- LIFECYCLE HOOKS ---

// Ensure the camera stream is stopped when the component is destroyed
onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
})
</script>

<style scoped>

/* --- ⬇️ NEW STYLES for Password Toggle --- */
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