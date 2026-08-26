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
  const coldStart = !globalThis.__cgWarm;
  globalThis.__cgWarm = true;

  let phone, code, leadId;
  try { ({ phone, code, leadId } = await req.json()); }
  catch { return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors } }); }

  if (!phone || !code) return new Response(JSON.stringify({ error: 'Phone and code required' }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors } });

  const digits = phone.replace(/\D/g, '');
  const e164 = digits.startsWith('0') ? '+64' + digits.slice(1) : '+' + digits;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const ts = new Date().toISOString();

  let twilioResponse = null, errorCode = null, verified = false;
  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to: e164, code });
    verified = check.status === 'approved';
    twilioResponse = { sid: check.sid, status: check.status, verified };
  } catch (err) {
    twilioResponse = { error: err.message };
    errorCode = err.code || null;
  }

  const durationMs = Date.now() - startMs;

  try {
    const logs = getStore({ name: 'verifyLogs', consistency: 'strong' });
    const logKey = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await logs.setJSON(logKey, {
      timestamp: ts, leadId: leadId || null,
      action: 'check', phone: e164,
      twilioResponse, errorCode, durationMs, coldStart, userAgent: ua, referrer,
    });
  } catch (logErr) {
    console.error('verifyLogs write failed:', logErr.message);
  }

  console.log(JSON.stringify({ event: 'verify_otp', phone: e164, verified, durationMs, coldStart, ts }));

  if (errorCode) {
    return new Response(JSON.stringify({ error: twilioResponse.error }), { status: 400, headers: { 'Content-Type': 'application/json', ...cors } });
  }
  return new Response(JSON.stringify({ verified }), { status: 200, headers: { 'Content-Type': 'application/json', ...cors } });
};

export const config = { path: '/.netlify/functions/verify-otp' };
