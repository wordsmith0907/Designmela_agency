/**
 * Shared security middleware and helpers for Designmela API routes.
 * Enforces CORS, rate limiting, request size limits, and credential validation.
 */

// In-memory sliding window rate-limiter store
// Map<ip_route, Array<timestamp>>
const rateLimitMap = new Map();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // clean expired IPs every 5 minutes
let lastCleanup = Date.now();

function cleanupExpiredEntries(windowMs) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter(t => now - t < windowMs);
    if (valid.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, valid);
    }
  }
}

/**
 * Get client IP address reliably across Vercel serverless and local Node
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (realIp) return realIp.trim();
  return req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Allowed origin checker
 */
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?designmela\.com$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/.*\.vercel\.app$/
];

export function handleCors(req, res) {
  const origin = req.headers.origin;

  if (origin) {
    const isAllowed = ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin));
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
      res.setHeader('Access-Control-Max-Age', '86400');
      res.setHeader('Vary', 'Origin');
    } else {
      // Reject cross-origin requests from untrusted origins
      return false;
    }
  }

  return true;
}

/**
 * Rate limiter (sliding window)
 * Defaults: 20 requests per minute per IP for chat/tools
 */
export function enforceRateLimit(req, res, { routeKey = 'api', maxRequests = 20, windowMs = 60000 } = {}) {
  const ip = getClientIp(req);
  const key = `${routeKey}:${ip}`;
  const now = Date.now();

  cleanupExpiredEntries(windowMs);

  let timestamps = rateLimitMap.get(key) || [];
  timestamps = timestamps.filter(t => now - t < windowMs);

  const remaining = Math.max(0, maxRequests - timestamps.length);
  const resetSeconds = Math.ceil(windowMs / 1000);

  res.setHeader('RateLimit-Limit', maxRequests.toString());
  res.setHeader('RateLimit-Remaining', Math.max(0, remaining - 1).toString());
  res.setHeader('RateLimit-Reset', resetSeconds.toString());

  if (timestamps.length >= maxRequests) {
    res.setHeader('Retry-After', resetSeconds.toString());
    res.status(429).json({
      error: 'Too many requests. Please slow down and try again shortly.'
    });
    return false;
  }

  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return true;
}

/**
 * Enforce maximum payload size on parsed JSON body
 */
export function enforcePayloadLimit(req, res, maxBytes = 50000) {
  try {
    const payloadLength = JSON.stringify(req.body || {}).length;
    if (payloadLength > maxBytes) {
      res.status(413).json({
        error: 'Request payload exceeds maximum allowed size.'
      });
      return false;
    }
  } catch (e) {
    res.status(400).json({ error: 'Malformed request body.' });
    return false;
  }
  return true;
}

/**
 * Safely retrieve Gemini API key from environment
 */
export function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_key_here' || key.trim().length === 0) {
    return null;
  }
  return key.trim();
}
