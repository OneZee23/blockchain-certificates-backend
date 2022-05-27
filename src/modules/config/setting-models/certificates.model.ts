import { IsString } from 'class-validator';

export class CertificatesSettings {
  @IsString()
  readonly routerContractAddress!: string;
}
