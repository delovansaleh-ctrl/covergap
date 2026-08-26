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

  // Full-detail alert when the lead COMPLETES the form. Without this you only
  // ever hear about the thin partial record and never see the finished lead.
  // Guarded on completeAlertSent so verification (a second 'complete' write)
  // can't double-text.
  const isComplete = incoming.status === 'complete' || incoming.status === 'complete-unverified';
  if (isComplete && !(existing && existing.completeAlertSent)) {
    const ownerPhone = process.env.OWNER_PHONE;
    const fromPhone  = process.env.TWILIO_FROM_NUMBER;
    if (ownerPhone && fromPhone) {
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const g = {
          premiums: 'lower premiums', review: 'review cover',
          life_change: 'life change', dont_know: "doesn't know cover", new: 'new to insurance',
        }[merged.goal] || merged.goal || '?';
        const verified = incoming.status === 'complete' ? 'verified' : 'unverified';
        const lines = [
          `\u2705 CoverGap FULL LEAD (${verified})`,
          `${merged.firstName || '?'} \u2014 ${merged.mobile || 'no mobile'}`,
          merged.email ? `Email: ${merged.email}` : null,
          `Age: ${merged.ageBand || '?'}  |  Goal: ${g}`,
          merged.callTime ? `Best time: ${merged.callTime}` : null,
          merged.providers ? `With: ${merged.providers}` : null,
          merged.coverTypes ? `Wants: ${merged.coverTypes}` : null,
        ].filter(Boolean);
        await client.messages.create({ to: ownerPhone, from: fromPhone, body: lines.join('\n') });
        merged.completeAlertSent = true;
      } catch (smsErr) {
        console.error(JSON.stringify({ event: 'complete_alert_error', leadId, error: smsErr.message }));
      }
    }
  }

  // Email the full lead via FormSubmit (already activated for this address).
  // Runs on completion only, same guard as the SMS, and never blocks the response.
  if (isComplete && !(existing && existing.completeAlertSent)) {
    try {
      const goalLabel = {
        premiums: 'Lower premiums', review: 'Review cover levels',
        life_change: 'Big life change', dont_know: "Doesn't know current cover",
        new: 'New to insurance',
      }[merged.goal] || merged.goal || '';
      const resp = await fetch('https://formsubmit.co/ajax/delovan.saleh@spireadvice.co.nz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `CoverGap lead: ${merged.firstName || 'Unknown'} (${merged.ageBand || 'age ?'})`,
          _template: 'table',
          Name: merged.firstName || '',
          Mobile: merged.mobile || '',
          Email: merged.email || '',
          Age: merged.ageBand || '',
          Goal: goalLabel,
          'Best time to call': merged.callTime || '',
          'Currently with': merged.providers || '',
          'Interested in': merged.coverTypes || '',
          Verified: incoming.status === 'complete' ? 'Yes' : 'Not yet',
          'Lead ID': leadId,
          Submitted: now,
        }),
      });
      console.log(JSON.stringify({ event: 'lead_email', leadId, ok: resp.ok, status: resp.status }));
    } catch (mailErr) {
      console.error(JSON.stringify({ event: 'lead_email_error', leadId, error: mailErr.message }));
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
