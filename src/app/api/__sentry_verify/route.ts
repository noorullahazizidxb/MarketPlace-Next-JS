import * as Sentry from '@sentry/nextjs';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Temporary header-gated verification route. Returns 404 unless the
 * x-sentry-verify header matches SENTRY_VERIFY_KEY.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.SENTRY_VERIFY_KEY;
  const provided = request.headers.get('x-sentry-verify');
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  Sentry.captureException(
    new Error(`Sentry verification error (${process.env.SENTRY_PROJECT ?? 'app'})`),
  );
  await Sentry.flush(2000);
  return NextResponse.json({ ok: true });
}
