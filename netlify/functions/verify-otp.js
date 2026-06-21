const twilio = require('twilio');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let phone, code;
  try {
    ({ phone, code } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!phone || !code) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Phone and code required' }) };
  }

  const digits = phone.replace(/\D/g, '');
  const e164 = digits.startsWith('0') ? '+64' + digits.slice(1) : '+' + digits;

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: e164, code });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: check.status === 'approved' }),
    };
  } catch (err) {
    console.error('Twilio verify error:', err.message);
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
