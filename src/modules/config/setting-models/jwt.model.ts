import { IsString } from "class-validator";

export class JWTSettings {
  @IsString()
  secretAccess!: string;

  @IsString()
  accessExp!: string;

  @IsString()
  secretRefresh!: string;

  @IsString()
  refreshExp!: string;
}
