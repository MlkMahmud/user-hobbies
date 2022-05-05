import mongoose from 'mongoose';
import app from './app';
import logger from './lib/logger';

const {
  DB_URL = '',
  PORT = 3000,
} = process.env;

(async function start () {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      logger.info(`> Ready on localhost:${PORT} - env ${process.env.NODE_ENV}`);
    })
  } catch (err) {
    logger.error({ err });
    process.exit(1);
  }
})();
