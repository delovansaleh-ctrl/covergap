import { getStore } from '@netlify/blobs';
import twilio from 'twilio';

export default async (req, context) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers: cors });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

  const startMs = Date.now();
  const ua = req.headers.get('user-agent') || '';
  const referrer = req.headers.get('referer') || '';

  let body;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors } }); }

  const isNew = !body.leadId;
  const leadId = body.leadId || `cg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  // Blobs must never take down the alert path — treat storage as best-effort.
  let leads = null;
  try { leads = getStore({ name: 'leads', consistency: 'strong' }); }
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

  // SMS alert to owner on first partial save — fires BEFORE storage write
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

  return new Response(JSON.stringify({ success: true, leadId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
};

export const config = { path: '/.netlify/functions/save-lead' };
