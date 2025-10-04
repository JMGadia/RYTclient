import { RekognitionClient, CreateFaceLivenessSessionCommand } from "@aws-sdk/client-rekognition";

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const client = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const command = new CreateFaceLivenessSessionCommand({});
    const { SessionId } = await client.send(command);
    return response.status(200).json({ SessionId });
  } catch (error) {
    console.error("Error creating liveness session:", error);
    return response.status(500).json({ error: 'Failed to create liveness session.' });
  }
}