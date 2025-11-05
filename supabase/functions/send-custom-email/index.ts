// Deno uses 'Deno.env.get' to access secrets set via the CLI
// The environment variable name is 'BREVO_API_KEY'
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');

// The Brevo transactional email API endpoint
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// --- CRITICAL: CORS Configuration ---
// Allow all origins for development (*). For production, replace '*' with your Vercel URL.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  // Allow all necessary headers for Vue/Fetch to work
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// We export a handler function that Supabase Edge will call
Deno.serve(async (req: Request) => {

  // 1. CRITICAL: Handle the OPTIONS (CORS preflight) request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 2. Check for the API Key
  if (!BREVO_API_KEY) {
    return new Response('Missing BREVO_API_KEY secret.', {
      status: 500,
      headers: corsHeaders
    });
  }

  // 3. Check for the correct method
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders
    });
  }

  // 4. Extract Custom Data from the Vue.js request
  // We need a separate try/catch for req.json() as it can fail
  let toEmail, subject, htmlContent;
  try {
    const jsonBody = await req.json();
    toEmail = jsonBody.toEmail;
    subject = jsonBody.subject;
    htmlContent = jsonBody.htmlContent;
  } catch (e) {
    console.error("Error parsing JSON body:", e);
    return new Response(JSON.stringify({ message: 'Invalid JSON body provided.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (!toEmail || !subject || !htmlContent) {
    return new Response('Missing required email fields (toEmail, subject, htmlContent).', {
        status: 400,
        headers: corsHeaders
    });
  }

  // 5. Construct the Brevo API payload
  const emailData = {
    sender: {
        name: "Your Thesis Project",
        // !!! IMPORTANT: Change this to your actual VERIFIED Brevo sender email !!!
        email: "your-verified-sender@example.com"
    },
    to: [{ email: toEmail }],
    subject: subject,
    htmlContent: htmlContent,
  };

  // 6. Send the request to Brevo
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY, // Used securely from Deno.env.get()
    },
    body: JSON.stringify(emailData),
  });

  // 7. Handle the Brevo response and include CORS headers
  if (response.ok) {
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
      headers: {
        ...corsHeaders, // Success must include CORS headers
        'Content-Type': 'application/json'
      },
    });
  } else {
    const errorText = await response.text();
    console.error('Brevo API Error:', errorText);
    return new Response(JSON.stringify({ message: 'Failed to send email via Brevo.', error: errorText }), {
      status: 500,
      headers: {
        ...corsHeaders, // Error must also include CORS headers
        'Content-Type': 'application/json'
      },
    });
  }
});