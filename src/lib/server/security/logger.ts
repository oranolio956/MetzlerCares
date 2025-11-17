import { createLogger, format, transports } from 'winston';
import { join } from 'path';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} [${level}]: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
});

export const securityLogger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat)
    }),
    new transports.File({
      filename: join(process.cwd(), 'logs', 'security.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

export function logSecurityEvent(event: string, details: Record<string, any>) {
  securityLogger.info(event, details);
}

export function logSecurityError(error: string, details: Record<string, any>) {
  securityLogger.error(error, details);
}