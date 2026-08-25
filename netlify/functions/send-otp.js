const admin = require('firebase-admin');
const twilio = require('twilio');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}
const db = admin.firestore();

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method not allowed' };

  const startMs = Date.now();
  const ua = event.headers['user-agent'] || '';
  const referrer = event.headers['referer'] || '';
  const coldStart = !global.__cgWarm;
  global.__cgWarm = true;

  let phone, leadId;
  try { ({ phone, leadId } = JSON.parse(event.body)); }
  catch { return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid request body' }) }; }

  if (!phone) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Phone number required' }) };

  const digits = phone.replace(/\D/g, '');
  const e164 = digits.startsWith('0') ? '+64' + digits.slice(1) : '+' + digits;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const ts = new Date().toISOString();

  let twilioResponse = null, errorCode = null, success = false;
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to: e164, channel: 'sms' });
    twilioResponse = { sid: verification.sid, status: verification.status };
    success = true;
  } catch (err) {
    twilioResponse = { error: err.message };
    errorCode = err.code || null;
  }

  const durationMs = Date.now() - startMs;

  // Write to verifyLogs
  try {
    await db.collection('verifyLogs').add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      leadId: leadId || null,
      action: 'send',
      phone: e164,
      twilioResponse,
      errorCode,
      durationMs,
      coldStart,
      userAgent: ua,
      referrer,
    });
  } catch (logErr) {
    console.error('verifyLogs write failed:', logErr.message);
  }

  console.log(JSON.stringify({ event: 'send_otp', phone: e164, success, durationMs, coldStart, ts }));

  if (success) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', ...cors }, body: JSON.stringify({ success: true }) };
  } else {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json', ...cors }, body: JSON.stringify({ error: twilioResponse.error }) };
  }
};
