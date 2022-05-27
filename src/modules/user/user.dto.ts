import { IsEthereumAddress, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username!: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  password!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsEthereumAddress()
  blockchainAddress!: string;
}

export class LogInRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username!: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  password!: string;
}

export class GetNewAccessTokenRequestDto {
  @IsString()
  refreshToken!: string;
}

export class LogInResponseDto {
  accessToken!: string;
  refreshToken!: string;
}

export class SetRefreshTokenDto {
  hashedRefreshToken!: string;
  tokenId!: string;
}
