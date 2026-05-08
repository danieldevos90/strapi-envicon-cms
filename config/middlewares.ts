/**
 * Strapi v5 middleware stack.
 *
 * - CORS is locked down via env var `STRAPI_CORS_ORIGINS` (comma-separated).
 *   We never use `*` so the admin and Strapi cookies cannot be exfiltrated
 *   from arbitrary origins. Local dev origins are appended automatically
 *   when `NODE_ENV !== 'production'`.
 *
 * - Body limits are scoped to realistic upload sizes. The previous 256MB
 *   ceiling allowed unauthenticated callers to chew through memory; we now
 *   default to 25MB JSON / 50MB multipart, with a hard cap configurable via
 *   `STRAPI_UPLOAD_MAX_BYTES`.
 */

const DEFAULT_PROD_ORIGINS = [
  'https://envicon.nl',
  'https://www.envicon.nl',
  'https://cms.envicon.nl',
];

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:1337',
];

function buildCorsOrigins(): string[] {
  const fromEnv = (process.env.STRAPI_CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
  const base = fromEnv.length ? fromEnv : DEFAULT_PROD_ORIGINS;

  // Always allow the dev origins outside of production so contributors don't
  // need to set env vars locally.
  return Array.from(new Set(isProd ? base : [...base, ...DEFAULT_DEV_ORIGINS]));
}

const uploadMaxBytes = Number(
  process.env.STRAPI_UPLOAD_MAX_BYTES || 50 * 1024 * 1024 // 50 MB
);

export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: buildCorsOrigins(),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'X-Requested-With',
      ],
      credentials: true,
      keepHeadersOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '25mb',
      jsonLimit: '25mb',
      textLimit: '25mb',
      formidable: {
        maxFileSize: uploadMaxBytes,
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
