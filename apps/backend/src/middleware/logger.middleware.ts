import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Structured HTTP request logger.
 * Logs method, URL, status, and response time for every request.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger[level]({
      type: 'HTTP',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${ms}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
};
