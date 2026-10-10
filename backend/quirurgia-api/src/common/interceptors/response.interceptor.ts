import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationDto } from '../pagination/type/pagination.type';
import { SuccessResponse } from '../pagination/interface/success-response.interface';

interface PaginatedControllerResponse<T> {
  data: T;
  pagination: PaginationDto;
}

type ControllerResponse<T> = T | PaginatedControllerResponse<T>;

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  ControllerResponse<T>,
  SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponse<T>>,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((response): SuccessResponse<T> => {
        if (this.isPaginatedResponse(response)) {
          return {
            success: true,
            data: response.data,
            pagination: response.pagination,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          data: response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private isPaginatedResponse(
    response: ControllerResponse<T>,
  ): response is PaginatedControllerResponse<T> {
    return (
      typeof response === 'object' &&
      response !== null &&
      'data' in response &&
      'pagination' in response
    );
  }
}
