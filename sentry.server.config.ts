import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
    Sentry.consoleLoggingIntegration({levels: ["log", "warn", "error"]}),
  ],
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
  debug: false,
});
