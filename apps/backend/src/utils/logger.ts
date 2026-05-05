/**
 * Structured Winston Logger
 * Outputs JSON in production, colorized text in development.
 */
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, json, colorize, printf } = format;

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format:
    process.env.NODE_ENV === 'production'
      ? prodFormat
      : combine(colorize(), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), devFormat),
  transports: [
    new transports.Console(),
    // In production, add file or cloud transport:
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
  exitOnError: false,
});
