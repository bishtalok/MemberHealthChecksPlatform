import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
      tap(async (responseData: unknown) => {
        try {
          const data = responseData as Record<string, unknown>;
          const entityId =
            (data?.['data'] as Record<string, unknown>)?.['id'] ||
            data?.['id'] ||
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
                } as Prisma.InputJsonValue,
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
