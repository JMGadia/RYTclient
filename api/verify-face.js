import { RekognitionClient, DetectFacesCommand } from '@aws-sdk/client-rekognition';
import { createClient } from '@supabase/supabase-js'; // You need to install @supabase/supabase-js

// --- CONFIGURATION ---
// Initialize the AWS Rekognition client
const rekognitionClient = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Initialize Supabase Admin Client for secure, server-side storage upload
// NOTE: Use the service_role key here, not the anon key.
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Ensure this is set in your Vercel/Node environment
);

const FACE_STORAGE_BUCKET = 'face_storage';

/**
 * Conceptual function to upload the verified image to Supabase Storage.
 * @param {Buffer} imageBuffer - The binary image data.
 * @returns {string} The public URL of the uploaded image.
 */
async function uploadFaceImage(imageBuffer) {
    // Generate a unique file path, typically tied to a temporary ID or a hash
    // We'll use a unique ID here, the final mapping to user ID happens after successful Supabase signup.
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpeg`;

    // Path structure: face_storage/temp_uploads/fileId.jpeg
    const filePath = `temp_uploads/${fileId}`;

    const { data, error: uploadError } = await supabaseAdmin.storage
        .from(FACE_STORAGE_BUCKET)
        .upload(filePath, imageBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
        });

    if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: publicData } = supabaseAdmin.storage
        .from(FACE_STORAGE_BUCKET)
        .getPublicUrl(filePath);

    if (!publicData || !publicData.publicUrl) {
        throw new Error('Failed to retrieve public URL after upload.');
    }

    return publicData.publicUrl;
}


// This is the main function Vercel will run
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { imageBase64 } = request.body;
    if (!imageBase64) {
        return response.status(400).json({ success: false, message: 'Image data is required.' });
    }

    try {
        const imageBuffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const command = new DetectFacesCommand({
            Image: { Bytes: imageBuffer },
            Attributes: ['ALL'],
        });

        const rekognitionResponse = await rekognitionClient.send(command);
        const faceDetails = rekognitionResponse.FaceDetails;

        // --- FACE VERIFICATION CHECKS ---

        // Step 1: Check if any face was detected at all
        if (!faceDetails || faceDetails.length === 0) {
            return response.status(400).json({ success: false, message: 'No face was detected. Please try again.' });
        }

        // Step 2: Check for multiple faces
        if (faceDetails.length !== 1) {
            return response.status(400).json({ success: false, message: 'Please ensure only one person is in the photo.' });
        }

        const face = faceDetails[0];

        // Step 3: Check Confidence Level (Must be very high)
        const confidenceThreshold = 99.5;
        if (face.Confidence < confidenceThreshold) {
            return response.status(400).json({ success: false, message: 'Face is not clear enough. Please ensure good lighting.' });
        }

        // Step 4: Check Sharpness Level (Key anti-spoofing check)
        const sharpnessThreshold = 95.0;
        if (face.Quality.Sharpness < sharpnessThreshold) {
            return response.status(400).json({ success: false, message: 'Image is too blurry. Please hold the camera steady.' });
        }

        // --- IMAGE STORAGE ---

        // Step 5: If all checks pass, upload the image to storage
        const faceImageUrl = await uploadFaceImage(imageBuffer);

        // Step 6: Return the success message AND the image URL
        return response.status(200).json({
            success: true,
            message: 'Face verified and image stored successfully.',
            faceImageUrl: faceImageUrl // <-- RETURN THE URL
        });

    } catch (error) {
        console.error('Error during verification/storage:', error);
        // Provide a generic error message for security
        return response.status(500).json({ success: false, message: 'An error occurred during face verification and storage.' });
    }
}