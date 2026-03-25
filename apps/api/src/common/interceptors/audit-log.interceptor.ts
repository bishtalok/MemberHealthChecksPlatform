import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only audit state-changing operations
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return next.handle();
    }

    const user = request.user;
    const path = request.route?.path || request.url;

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          const entityId =
            responseData?.data?.id ||
            responseData?.id ||
            request.params?.id;

          if (entityId) {
            await this.prisma.auditLog.create({
              data: {
                entity_type: this.getEntityType(path),
                entity_id: entityId,
                action: `${method} ${path}`,
                actor_id: user?.id || null,
                actor_role: user?.role || null,
                details: {
                  body: this.sanitizeBody(request.body),
                  params: request.params,
                },
              },
            });
          }
        } catch {
          // Don't fail the request if audit logging fails
          console.error('Audit log failed');
        }
      }),
    );
  }

  private getEntityType(path: string): string {
    if (path.includes('journey')) return 'journey';
    if (path.includes('booking')) return 'booking';
    if (path.includes('result')) return 'result';
    if (path.includes('insurer')) return 'handoff';
    return 'unknown';
  }

  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...body };
    delete sanitized.eligibility_token;
    return sanitized;
  }
}
