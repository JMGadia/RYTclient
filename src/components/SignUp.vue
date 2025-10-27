<script setup>
// --- IMPORTS & SETUP ---
import { ref, reactive, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../server/supabase'

// Initialize the router
const router = useRouter()

// --- REACTIVE FORM STATE ---
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
const isLoading = ref(false)
const showCameraModal = ref(false)
const videoRef = ref(null)
let stream = null;

// Facial recognition control state
const facingMode = ref('user');
const hasMultipleCameras = ref(false);

// --- PASSWORD VISIBILITY LOGIC (Unchanged) ---
const isPasswordVisible = ref(false)
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password')
const passwordIcon = computed(() => isPasswordVisible.value ? '/images/passHide.png' : '/images/passShow.png')
const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value
}


// --- CAMERA CONTROL FUNCTIONS (Unchanged from your original logic) ---

/**
 * Initiates the camera stream.
 */
const startCamera = async () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    try {
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

/**
 * Toggles the camera between 'user' and 'environment'.
 */
const flipCamera = async () => {
    facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
    await startCamera();
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
 * Captures an image, sends it for verification, and receives the stored image URL.
 */
const captureAndVerify = async () => {
    if (!videoRef.value) return;

    isLoading.value = true;

    // Capture image
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg');

    closeCamera(); // Close camera immediately after capture

    try {
        // Send image to external API for face verification and storage
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-face`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64 })
        });

        const responseData = await response.json(); // <-- AWAIT the JSON data

        if (!response.ok) {
            throw new Error(responseData.message || 'Face verification failed.');
        }

        console.log('Face verification successful!');

        // 🌟 MODIFICATION 🌟 Pass the received faceImageUrl
        await proceedWithSupabaseSignUp(responseData.faceImageUrl);

    } catch (error) {
        console.error('Face verification failed:', error.message);
        alert(`Face verification failed: ${error.message}`);
    } finally {
        if(showCameraModal.value === false) {
            isLoading.value = false;
        }
    }
}

/**
 * Registers the user with Supabase, including the face image URL in metadata.
 * @param {string} faceImageUrl - The public URL of the verified face image.
 */
const proceedWithSupabaseSignUp = async (faceImageUrl) => { // <-- ACCEPT THE URL
    isLoading.value = true;
    try {
        // Create the user account, passing the image URL in the options data
        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    username: form.username,
                    face_image_url: faceImageUrl // <-- NEW FIELD FOR THE RLS TRIGGER
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
        // Pre-sign-up check: Check if a user with this email already exists
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

    // Initiate camera/face verification flow
    if (form.facialRecognition) {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            hasMultipleCameras.value = videoDevices.length > 1;
        } catch (err) {
            console.error("Could not enumerate devices:", err);
            hasMultipleCameras.value = false;
        }

        showCameraModal.value = true;
        startCamera();
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

<template>
    <form @submit.prevent="handleSignUp">
        <label>
            <input type="checkbox" v-model="form.facialRecognition" />
            Enable Facial Recognition for Signup
        </label>

        <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Processing...' : 'Sign Up' }}
        </button>
    </form>

    <div v-if="showCameraModal" class="camera-modal">
        <h2>Facial Verification</h2>
        <video ref="videoRef" autoplay playsinline></video>

        <button @click="captureAndVerify" :disabled="isLoading">Capture & Verify</button>

        <button v-if="hasMultipleCameras" @click="flipCamera">Flip Camera</button>
        <button @click="closeCamera">Cancel</button>
    </div>
</template>