import { IsString } from 'class-validator';

export class Web3Settings {
  @IsString()
  readonly rpcUrl!: string;

  @IsString()
  readonly privateKey!: string;
}
