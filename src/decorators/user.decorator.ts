import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class UserData {
  userId!: string;
  tokenId!: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserData;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
