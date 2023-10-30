import { Router } from 'express';
import * as Sentry from '@sentry/node';

export function sentryFactory(app: Router) {
  const isSentryEnabled = process.env.SENTRY_ENABLED === 'true'; // process.env.SENTRY_ENABLED === 'true';
  if (!isSentryEnabled) return;
  if (!process.env.SENTRY_DSN)
    throw new Error(
      'Sentry is enabled and environment variable SENTRY_DSN is not defined',
    );
  if (!process.env.SENTRY_TRACE_SAMPLE_RATE)
    throw new Error(
      'Sentry is enabled and environment variable SENTRY_TRACE_SAMPLE_RATE is not defined',
    );

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({
        tracing: true,
      }),
      new Sentry.Integrations.Express({
        app,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: Number(process.env.SENTRY_TRACE_SAMPLE_RATE),
    environment: process.env.NODE_ENV,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}
