import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigModel, JwtOptionsModel } from "./config.model";
require('dotenv/config');

@Injectable()
export class ConfigService {
  private readonly _config: ConfigModel;

  constructor() {
    this._config = ConfigService.validateConfig();
  }

  get config(): ConfigModel {
    return this._config;
  }

  public get typeorm(): any {
    return this._config.typeorm;
  }

  get jwtOptionsSignAccessToken(): JwtOptionsModel {
    return {
      secret: this._config.jwt.secretAccess,
      expiresIn: this._config.jwt.accessExp
    };
  }

  private static validateConfig(): ConfigModel {
    const envs = process.env as any;
    const plainConfig = {
      env: envs.ENV,
      port: parseInt(envs.PORT),
      typeorm: {
        type: envs.TYPEORM_CONNECTION,
        host: envs.TYPEORM_HOST,
        port: +envs.TYPEORM_PORT,
        database: envs.TYPEORM_DATABASE,
        username: envs.TYPEORM_USERNAME,
        password: envs.TYPEORM_PASSWORD,
        synchronize: envs.TYPEORM_SYNCHRONIZE === 'true',
        entities: [envs.TYPEORM_ENTITIES],
      },
      certificates: {
        routerContractAddress: envs.CERTIFICATES_ROUTER_CONTRACT_ADDRESS,
      },
      web3: {
        rpcUrl: envs.WEB3_RPC_URL,
        privateKey: envs.WEB3_PRIVATE_KEY,
      },
      jwt: {
        secretAccess: process.env.JWT_SECRET_ACCESS,
        accessExp: process.env.JWT_ACCESS_EXP,
        secretRefresh: process.env.JWT_SECRET_REFRESH,
        refreshExp: process.env.JWT_REFRESH_EXP,
      },
    };
    const result = plainToClass(ConfigModel, plainConfig);
    const errors = validateSync(result);
    if (errors.length > 0) {
      const list = errors.map((error) => {
        return error.toString();
      });
      throw new Error(
        `Environment configuration is invalid: ` + list.join(' - '),
      );
    }

    return result;
  }
}
