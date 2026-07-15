const twilio = require('twilio');

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method not allowed' };
  }

  let phone;
  try {
    ({ phone } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!phone) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Phone number required' }) };
  }

  // Convert NZ local format to E.164  (021 456 7890 → +6421456789)
  const digits = phone.replace(/\D/g, '');
  const e164 = digits.startsWith('0') ? '+64' + digits.slice(1) : '+' + digits;

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: e164, channel: 'sms' });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Twilio send error:', err.message);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
