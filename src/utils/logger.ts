/** Available log levels in order of severity */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Structure of a log entry
 */
interface LogEntry {
  /** The severity level of the log */
  level: LogLevel;
  /** The log message */
  message: string;
  /** Optional additional data to log */
  data?: unknown;
  /** ISO timestamp when the log was created */
  timestamp: string;
}

/**
 * Centralized logging utility with environment-aware output
 * 
 * Provides structured logging with different severity levels and automatic
 * environment detection. Logs are only output in development mode or when
 * explicitly enabled via environment variables.
 * 
 * Features:
 * - Environment-aware logging (dev vs production)
 * - Structured log entries with timestamps
 * - Multiple severity levels (debug, info, warn, error)
 * - Optional data payload support
 * - Automatic console method selection based on level
 * 
 * @example
 * ```tsx
 * import { logger } from './utils/logger';
 * 
 * // Basic logging
 * logger.info('User logged in');
 * logger.error('Failed to save data');
 * 
 * // Logging with additional data
 * logger.debug('API request', { url: '/api/users', method: 'GET' });
 * logger.warn('Deprecated feature used', { feature: 'oldApi' });
 * ```
 */
class Logger {
  /** Whether logging is enabled via environment variable */
  private isEnabled: boolean;
  /** Whether running in development mode */
  private isDevelopment: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_LOGGING === 'true';
    this.isDevelopment = import.meta.env.DEV;
  }

  /**
   * Internal method to handle log output with appropriate console method
   * @param level - The log level
   * @param message - The log message
   * @param data - Optional additional data to include
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.isEnabled && !this.isDevelopment) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    const logMessage = `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`;

    // Use appropriate console method based on log level
    switch (level) {
      case 'debug':
        console.debug(logMessage, data);
        break;
      case 'info':
        console.info(logMessage, data);
        break;
      case 'warn':
        console.warn(logMessage, data);
        break;
      case 'error':
        console.error(logMessage, data);
        break;
    }
  }

  /**
   * Logs a debug message (lowest priority)
   * @param message - The debug message
   * @param data - Optional additional data
   */
  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  /**
   * Logs an informational message
   * @param message - The info message
   * @param data - Optional additional data
   */
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  /**
   * Logs a warning message
   * @param message - The warning message
   * @param data - Optional additional data
   */
  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  /**
   * Logs an error message (highest priority)
   * @param message - The error message
   * @param data - Optional additional data
   */
  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }
}

/** Singleton logger instance for application-wide use */
export const logger = new Logger();