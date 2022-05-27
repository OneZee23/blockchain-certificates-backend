import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, ValidateNested } from "class-validator";
import { CertificatesSettings, JWTSettings, TypeormSettings, Web3Settings } from "./setting-models";

export enum AppEnv {
  Development = 'DEV',
  Staging = 'STAGE',
  Production = 'PROD',
  Testing = 'TEST',
}

export class JwtOptionsModel {
  @IsString()
  secret!: string;

  @IsString()
  expiresIn!: string;
}

export class ConfigModel {
  @IsEnum(AppEnv)
  readonly env!: AppEnv;

  @IsInt()
  readonly port!: number;

  @ValidateNested()
  @Type(() => TypeormSettings)
  readonly typeorm!: TypeormSettings;

  @ValidateNested()
  @Type(() => CertificatesSettings)
  readonly certificates!: CertificatesSettings;

  @ValidateNested()
  @Type(() => Web3Settings)
  readonly web3!: Web3Settings;

  @ValidateNested()
  @Type(() => JWTSettings)
  readonly jwt!: JWTSettings;
}
