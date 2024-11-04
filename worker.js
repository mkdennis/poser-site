const AIRTABLE_API_KEY = 'patTrS6EsC7wg74ru.23f3fc08410a604b01899fd6c307eabc1f8f31d9904745b39310e027aba01602';
const AIRTABLE_BASE_ID = 'appRAj1hsc7MrGnZA/tblcbLa0kx51ZpO2H';
const AIRTABLE_TABLE_NAME = 'Poser Signups';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const email = body.email;

      // Send to Airtable
      const airtableResponse = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [{
            fields: {
              Email: email,
              'Sign Up Date': new Date().toISOString()
            }
          }]
        })
      });

      if (!airtableResponse.ok) {
        throw new Error('Airtable submission failed');
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
} 