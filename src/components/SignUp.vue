<script setup>
// --- IMPORTS & SETUP ---
import { ref, reactive, onUnmounted, computed, nextTick } from 'vue' // Added nextTick
import { useRouter } from 'vue-router'
import { supabase } from '../server/supabase'

// Initialize the router
const router = useRouter()

// --- REACTIVE FORM STATE ---
const form = reactive({
    username: '',
    email: '',
    password: '',
    facialRecognition: false
})

// State for validation errors
const errors = reactive({
    username: '',
    email: '',
    password: ''
})

// UI state management
const isLoading = ref(false)
const showCameraModal = ref(false)
const videoRef = ref(null)
let stream = null;

// Facial recognition control state
const facingMode = ref('user');
const hasMultipleCameras = ref(false);

// --- PASSWORD VISIBILITY LOGIC ---
const isPasswordVisible = ref(false)

const passwordFieldType = computed(() => {
    return isPasswordVisible.value ? 'text' : 'password'
})

const passwordIcon = computed(() => {
    return isPasswordVisible.value ? '/images/passHide.png' : '/images/passShow.png'
})

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value
}

// ----------------------------------------------------------------------
// --- CAMERA CONTROL FUNCTIONS ---
// ----------------------------------------------------------------------

/**
 * Stops any existing camera stream.
 */
const stopCameraStream = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
};

/**
 * Initiates the camera stream.
 */
const startCamera = async () => {
    stopCameraStream(); // Always stop previous stream first

    try {
        await nextTick(); // Wait for the videoRef element to be fully available in the DOM

        const constraints = {
            video: { facingMode: facingMode.value },
            audio: false
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.value) {
            videoRef.value.srcObject = stream;
            // Ensure video playback starts after setting srcObject
            videoRef.value.play().catch(e => console.error("Video playback failed:", e));
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
    await startCamera();
}

/**
 * Stops the camera stream and closes the modal.
 */
const closeCamera = () => {
    stopCameraStream();
    showCameraModal.value = false
    isLoading.value = false;
}

/**
 * Captures an image from the video stream and sends it for facial verification via the Vercel API.
 */
const captureAndVerify = async () => {
    if (!videoRef.value) return;

    // Set loading indicator
    isLoading.value = true;

    // 1. Capture image
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg');

    closeCamera(); // Close camera/modal immediately

    try {
        // 2. Call Vercel API endpoint (verify-face)
        // Note: import.meta.env.VITE_API_BASE_URL should be defined in your environment config
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-face`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64 })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Face verification failed due to an unknown API error.');
        }

        console.log('Face verification successful!');
        // 3. If API is successful, proceed with user account creation
        await proceedWithSupabaseSignUp();

    } catch (error) {
        console.error('Face verification failed:', error.message);
        alert(`Face verification failed: ${error.message}`);
    } finally {
        isLoading.value = false;
    }
}

/**
 * Registers the user with Supabase after successful verification.
 */
const proceedWithSupabaseSignUp = async () => {
    isLoading.value = true;
    try {
        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    username: form.username
                }
            }
        });

        if (error) throw error;

        // Success feedback and redirect
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

/**
 * Basic email format validation utility.
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Main function to handle form submission.
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
        // Pre-sign-up check
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
        // The camera starts here, AFTER the modal is visible
        startCamera();
    } else {
        // Fallback (though the checkbox is mandatory)
        await proceedWithSupabaseSignUp();
    }
}

// --- LIFECYCLE HOOKS ---

// Ensure the camera stream is stopped when the component is destroyed
onUnmounted(() => {
    stopCameraStream();
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