import { ConsoleLogger } from '@nestjs/common';
import * as safeJsonStringify from 'json-stringify-safe';
// import * as Sentry from '@sentry/node';

export class ApplicationLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error(this.formatMessageToJSON(message), stack, context);
  }

  log(message: unknown): void {
    super.log(this.formatMessageToJSON(message));
  }

  debug(message: unknown): void {
    super.debug(this.formatMessageToJSON(message));
  }

  warn(message: unknown): void {
    // if (process.env.SENTRY_ENABLED === 'true') {
    //   Sentry.captureMessage(this.formatMessageToJSON(message), 'warning');
    // }
    super.warn(this.formatMessageToJSON(message));
  }

  protected formatMessageToJSON(message: any): string {
    if (typeof message === 'string' || typeof message === 'number') {
      return String(message);
    }

    return safeJsonStringify(message);
  }
}
