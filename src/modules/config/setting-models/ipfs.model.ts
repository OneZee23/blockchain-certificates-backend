import { IsNumberString, IsString } from "class-validator";

export class IPFSSettings {
  @IsString()
  readonly host!: string;

  @IsNumberString()
  readonly port!: number;

  @IsString()
  readonly protocol!: string;
}
