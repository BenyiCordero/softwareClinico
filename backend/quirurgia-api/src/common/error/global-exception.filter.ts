import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

interface HttpExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Global exception filter that catches all unhandled exceptions.
 * Handles duplicate-entry database errors, HttpException subclasses,
 * and unknown errors — returning a consistent JSON envelope.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(GlobalExceptionFilter.name);
  }

  /**
   * Catches and formats all exceptions thrown during request processing.
   * Returns a JSON response with `success: false`, HTTP status, message, and path.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status: number = exception.getStatus();
      const res: string | HttpExceptionResponse = exception.getResponse() as string | HttpExceptionResponse;

      if (status >= 500) {
        this.logger.error(
          { err: exception, path: request.url, method: request.method },
          'HttpException with 5xx status',
        );
      }

      const message: string | string[] | undefined =
        typeof res === 'string' ? res : res.message;

      response.status(status).json({
        success: false,
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    this.logger.error(
      {
        err: exception,
        path: request.url,
        method: request.method,
      },
      'Unhandled exception reached GlobalExceptionFilter',
    );

    response.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}