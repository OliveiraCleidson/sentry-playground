import * as Joi from 'joi';

export const Validator = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'homolog'),
  // WebServer
  PORT: Joi.number().default(3000),

  // Sentry
  SENTRY_ENABLED: Joi.bool().default(false),
}).when('.SENTRY_ENABLED', {
  is: true,
  then: Joi.object({
    SENTRY_DSN: Joi.string().required(),
    SENTRY_TRACE_SAMPLE_RATE: Joi.number().default(1),
  }),
});
