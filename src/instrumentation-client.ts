import * as Sentry from '@sentry/nextjs';
import { sentryCommonOptions } from './sentry.shared';

Sentry.init({
  ...sentryCommonOptions(),
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
