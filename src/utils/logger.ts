/**
 * Enhanced console logger with level control
 * Supports info, warn, error levels with timestamps
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private isDevelopment = import.meta.env.DEV

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toLocaleString('zh-CN', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    return `[${timestamp}] [${level}] ${message}`
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage(LogLevel.INFO, message), ...args)
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ...args)
    }
  }

  /**
   * Log error message
   */
  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage(LogLevel.ERROR, message), ...args)
    // Here you can integrate with error tracking services like Sentry
    // this.sendToErrorTracking(message, args)
  }

  /**
   * Send error to tracking service (Sentry, etc.)
   * Implement this method when integrating with error tracking
   */
  private sendToErrorTracking(message: string, args: any[]): void {
    // TODO: Integrate with Sentry or other error tracking service
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(message), { extra: args })
    // }
  }
}

export const logger = new Logger()
