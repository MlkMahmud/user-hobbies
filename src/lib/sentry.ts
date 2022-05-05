import * as Sentry from '@sentry/node';

const dsn = process.env.SENTRY_DSN || '';
const enabled = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn,
  enabled,
});

export default Sentry;
