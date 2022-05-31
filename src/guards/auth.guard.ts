import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from "../decorators";
import { AppEnv, ConfigService } from "../modules/config";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // @ts-ignore
    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new Error('User not auth');
    }
    const [prefix, accessToken] = authorization.split(' ');
    if (prefix !== 'Bearer') {
      throw new Error('User not auth');
    }
    // TODO: For production need to remove comments
    // try {
    //   await this.jwtService.verify(accessToken, { secret: this.configService.config.jwt.secretAccess });
    // } catch (TokenExpiredError) {
    //   throw new Error('Unauthorized exception');
    // }

    if (process.env.ENV === AppEnv.Testing.toString()) {
      if (accessToken) {
        request.user = {
          ...request.user,
          tokenId: 'request.headers',
        };
        return true;
      }
      throw new Error('User not auth');
    }
    try {
      request.user = {
        ...request.user,
        tokenId: 'accessToken',
      };
    } catch (e) {
      throw new Error('User not auth');
    }

    return true;
    console.log(this.jwtService);
    console.log(this.configService);
  }
}
