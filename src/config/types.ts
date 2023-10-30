export type EnvironmentVariables = {
  // Application
  NODE_ENV: 'development' | 'production' | 'staging' | 'homolog';
  // WebServer
  PORT: number;

  // Sentry
  SENTRY_ENABLED: boolean;
  SENTRY_DSN: string;
  SENTRY_TRACE_SAMPLE_RATE: number;
};
