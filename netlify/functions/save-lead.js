const admin = require('firebase-admin');
const twilio = require('twilio');

// Initialise once per cold start
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

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const isNew = !body.leadId;
  const leadId = body.leadId || `cg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = admin.firestore.FieldValue.serverTimestamp();

  // Build the update payload — only write non-empty incoming fields
  const incoming = {
    status:     body.status     || 'partial',
    firstName:  body.firstName  || '',
    mobile:     body.phone      || '',
    ageBand:    body.ageBand    || '',
    providers:  Array.isArray(body.providers)  ? body.providers.join(', ')  : (body.providers  || ''),
    coverTypes: Array.isArray(body.coverTypes) ? body.coverTypes.join(', ') : (body.coverTypes || ''),
    callTime:   body.callTime   || '',
    email:      body.email      || '',
    goal:       body.goal       || '',
    userAgent:  body.userAgent  || ua,
    referrer:   body.referrer   || referrer,
  };

  // Strip empty strings so they don't overwrite existing values on update
  const nonEmpty = Object.fromEntries(Object.entries(incoming).filter(([, v]) => v !== ''));
  // Always update status
  nonEmpty.status = incoming.status;

  try {
    const ref = db.collection('leads').doc(leadId);

    if (isNew) {
      await ref.set({
        leadId,
        createdAt: now,
        updatedAt: now,
        ...incoming,
      });
    } else {
      const patch = { updatedAt: now, ...nonEmpty };
      if (body.status === 'complete') patch.verifiedAt = now;
      await ref.set(patch, { merge: true });
    }
  } catch (fsErr) {
    console.error(JSON.stringify({ event: 'firestore_error', leadId, error: fsErr.message, ts: new Date().toISOString() }));
    // Non-fatal — still send the SMS alert
  }

  // SMS alert to owner on new partial lead
  if (isNew && incoming.status === 'partial') {
    const ownerPhone = process.env.OWNER_PHONE;
    const fromPhone  = process.env.TWILIO_FROM_NUMBER;
    if (ownerPhone && fromPhone) {
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const goalLabel = {
          premiums: 'lower premiums', review: 'review cover',
          life_change: 'life change', dont_know: "doesn't know cover", new: 'new to insurance',
        }[incoming.goal] || incoming.goal || '?';
        await client.messages.create({
          to: ownerPhone,
          from: fromPhone,
          body: `🔔 CoverGap lead: ${incoming.firstName || 'Unknown'}, ${incoming.mobile || 'no mobile'}. Goal: ${goalLabel}. Age: ${incoming.ageBand || '?'}`,
        });
      } catch (smsErr) {
        console.error(JSON.stringify({ event: 'sms_alert_error', leadId, error: smsErr.message }));
      }
    }
  }

  const duration = Date.now() - startMs;
  console.log(JSON.stringify({ event: 'save_lead', leadId, status: incoming.status, isNew, duration, ts: new Date().toISOString() }));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', ...cors },
    body: JSON.stringify({ success: true, leadId }),
  };
};
