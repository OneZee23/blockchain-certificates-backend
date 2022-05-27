import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class TypeormSettings {
  @IsString()
  readonly type!: string;

  @IsString()
  readonly host!: string;

  @IsNumber()
  readonly port!: number;

  @IsString()
  readonly database!: string;

  @IsString()
  readonly username!: string;

  @IsString()
  readonly password!: string;

  @IsBoolean()
  readonly synchronize!: string;

  @IsArray()
  readonly entities!: string[];
}
