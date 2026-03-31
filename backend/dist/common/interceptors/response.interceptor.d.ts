import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class ResponseInterceptor<T> implements NestInterceptor<T, {
    data: T;
}> {
    intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<{
        data: T;
    }>;
}
