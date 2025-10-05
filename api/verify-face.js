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
      Attributes: ['ALL'],
    });

    const rekognitionResponse = await rekognitionClient.send(command);
    const faceDetails = rekognitionResponse.FaceDetails;

    if (!faceDetails || faceDetails.length !== 1) {
      return response.status(400).json({ success: false, message: 'Please ensure only one person is in the photo.' });
    }

    // You can add more detailed validation checks here if you wish

    return response.status(200).json({ success: true, message: 'Face verified successfully.' });

  } catch (error) {
    console.error('AWS Rekognition error:', error);
    return response.status(500).json({ success: false, message: 'An error occurred during face verification.' });
  }
}