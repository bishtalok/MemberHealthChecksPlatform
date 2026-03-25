import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MOCK_USERS } from './mock-users';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check for mock role header
    const mockRole = request.headers['x-mock-user-role'] as string;

    if (mockRole && MOCK_USERS[mockRole.toLowerCase()]) {
      request.user = MOCK_USERS[mockRole.toLowerCase()];
    } else {
      // Default to member user for prototype
      request.user = MOCK_USERS.member;
    }

    return true;
  }
}
