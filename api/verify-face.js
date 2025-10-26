// Add this helper function below your imports
const setCorsHeaders = (response) => {
    // Allows requests from any origin (easiest for testing and common for APIs)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// This is the main function Vercel will run
export default async function handler(request, response) {
    // 1. Handle OPTIONS preflight request (REQUIRED by browsers for CORS)
    if (request.method === 'OPTIONS') {
        setCorsHeaders(response);
        return response.status(200).end(); // End the request successfully after setting headers
    }

    // 2. Continue with POST logic
    if (request.method !== 'POST') {
        setCorsHeaders(response);
        return response.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { imageBase64 } = request.body;
    if (!imageBase64) {
        setCorsHeaders(response); // Set headers on error response
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

        // --- Start of Verification Logic ---
        if (!faceDetails || faceDetails.length === 0) {
            setCorsHeaders(response);
            return response.status(400).json({ success: false, message: 'No face was detected. Please try again.' });
        }
        if (faceDetails.length !== 1) {
            setCorsHeaders(response);
            return response.status(400).json({ success: false, message: 'Please ensure only one person is in the photo.' });
        }

        const face = faceDetails[0];
        const confidenceThreshold = 99.5;
        if (face.Confidence < confidenceThreshold) {
            setCorsHeaders(response);
            return response.status(400).json({ success: false, message: 'Face is not clear enough. Please ensure good lighting.' });
        }

        const sharpnessThreshold = 95.0;
        if (face.Quality.Sharpness < sharpnessThreshold) {
            setCorsHeaders(response);
            return response.status(400).json({ success: false, message: 'Image is too blurry. Please hold the camera steady.' });
        }
        // --- End of Verification Logic ---

        // Success response
        setCorsHeaders(response);
        return response.status(200).json({ success: true, message: 'Face verified successfully.' });

    } catch (error) {
        console.error('AWS Rekognition error:', error);
        setCorsHeaders(response);
        return response.status(500).json({ success: false, message: 'An error occurred during face verification.' });
    }
}