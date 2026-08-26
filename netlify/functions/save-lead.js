const { getStore } = require('@netlify/blobs');
const twilio = require('twilio');

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
  const now = new Date().toISOString();

  // Blobs must never take down the alert path — treat storage as best-effort.
  let leads = null;
  try { leads = getStore('leads'); }
  catch (e) { console.error(JSON.stringify({ event: 'blobs_unavailable', error: e.message })); }

  // Read existing record (null if new or storage unavailable)
  let existing = null;
  if (!isNew && leads) {
    existing = await leads.get(leadId, { type: 'json' }).catch(() => null);
  }

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

  // Merge: keep existing non-empty values, overwrite with non-empty incoming values
  const merged = existing ? { ...existing } : { leadId, createdAt: now };
  for (const [k, v] of Object.entries(incoming)) {
    if (v !== '') merged[k] = v;
  }
  merged.status = incoming.status; // always update status
  merged.updatedAt = now;
  if (incoming.status === 'complete') merged.verifiedAt = now;

  // SMS alert to owner on first partial save
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

  // Persist last, guarded — a storage failure must not fail the request
  let stored = false;
  if (leads) {
    try { await leads.setJSON(leadId, merged); stored = true; }
    catch (e) { console.error(JSON.stringify({ event: 'blob_write_error', leadId, error: e.message })); }
  }

  const duration = Date.now() - startMs;
  console.log(JSON.stringify({ event: 'save_lead', leadId, status: incoming.status, isNew, stored, duration, ts: now }));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', ...cors },
    body: JSON.stringify({ success: true, leadId }),
  };
};
