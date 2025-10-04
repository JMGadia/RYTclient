import { RekognitionClient, GetFaceLivenessSessionResultsCommand } from "@aws-sdk/client-rekognition";

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { SessionId } = request.body;
  if (!SessionId) {
    return response.status(400).json({ error: 'SessionId is required.' });
  }

  const client = new RekognitionClient({
    region: process.env.AWS_REGION,
  });

  try {
    const command = new GetFaceLivenessSessionResultsCommand({ SessionId });
    const data = await client.send(command);
    
    // AWS recommends a confidence score of 80 or higher to be considered a pass.
    const isLive = data.Confidence > 80;

    return response.status(200).json({
      isLive: isLive,
      confidence: data.Confidence,
      status: data.Status,
    });
  } catch (error) {
    console.error("Error getting liveness results:", error);
    return response.status(500).json({ error: 'Failed to get liveness results.' });
  }
}