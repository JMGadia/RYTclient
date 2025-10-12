import { RekognitionClient, DetectFacesCommand } from '@aws-sdk/client-rekognition';

// Initialize the AWS Rekognition client
const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
      Attributes: ['ALL'], // 'ALL' includes the Quality attribute we need
    });

    const rekognitionResponse = await rekognitionClient.send(command);
    const faceDetails = rekognitionResponse.FaceDetails;

    // --- START OF FIX ---

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
    // This ensures Rekognition is very sure it's a well-defined face.
    const confidenceThreshold = 99.5; 
    if (face.Confidence < confidenceThreshold) {
      return response.status(400).json({ success: false, message: 'Face is not clear enough. Please ensure good lighting.' });
    }

    // Step 4: Check Sharpness Level (Key anti-spoofing check)
    // Photos of other photos or screens are often less sharp.
    const sharpnessThreshold = 80.0;
    if (face.Quality.Sharpness < sharpnessThreshold) {
        return response.status(400).json({ success: false, message: 'Image is too blurry. Please hold the camera steady.' });
    }
    
    // --- END OF FIX ---

    return response.status(200).json({ success: true, message: 'Face verified successfully.' });

  } catch (error) {
    console.error('AWS Rekognition error:', error);
    return response.status(500).json({ success: false, message: 'An error occurred during face verification.' });
  }
}