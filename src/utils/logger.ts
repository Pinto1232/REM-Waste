type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {

  level: LogLevel;

  message: string;

  data?: unknown;

  timestamp: string;
}

class Logger {

  private isEnabled: boolean;

  private isDevelopment: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_LOGGING === 'true';
    this.isDevelopment = import.meta.env.DEV;
  }

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

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }
}

export const logger = new Logger();