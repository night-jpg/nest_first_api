import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import {tap} from "rxjs/operators";

export class LogInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const dt = Date.now();
        return next.handle().pipe(tap(() => {
            const request = context.switchToHttp().getRequest();
            console.log(`Url:${request.url}\nMethod:${request.method}`);
            console.log(`Execução levou:${Date.now() - dt} ms`);
        }));
    }
}