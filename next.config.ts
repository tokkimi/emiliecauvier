import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/download': ['./storage/pdf/**/*.pdf', './storage/pdf-en/**/*.pdf'],
    '/api/stripe/confirm': ['./storage/pdf/**/*.pdf', './storage/pdf-en/**/*.pdf'],
    '/api/stripe/webhook': ['./storage/pdf/**/*.pdf', './storage/pdf-en/**/*.pdf'],
    '/abonnement': ['./src/data/reader/1.json', './src/data/reader-en/1.json'],
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
    ] }];
  },
};

export default nextConfig;
