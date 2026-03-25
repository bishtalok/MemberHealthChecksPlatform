import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MockUser } from './mock-users';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): MockUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
