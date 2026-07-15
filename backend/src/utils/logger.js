import winston from 'winston';

const { combine, timestamp, json, errors, colorize, printf } = winston.format;

const devFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}]: ${message}${metaStr}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'bitbuds-api' },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? combine(timestamp(), errors({ stack: true }), json())
          : combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), devFormat),
    }),
  ],
});

export default logger;
