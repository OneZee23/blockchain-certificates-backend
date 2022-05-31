import { IsEnum, IsString, IsUrl } from "class-validator";

export enum PolygonNetCodes {
  MAINNET = 137,
  MUMBAI = 80001,
}

export class PolygonSettings {
  @IsUrl()
  address!: string;

  @IsString()
  polygonscanAPIKey!: string;

  @IsEnum(PolygonNetCodes)
  netCode!: PolygonNetCodes;
}
