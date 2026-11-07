import * as Sentry from '@sentry/nextjs';
import { sentryCommonOptions } from './sentry.shared';

Sentry.init(sentryCommonOptions());
