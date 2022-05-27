import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { GetNewAccessTokenRequestDto, LogInRequestDto, LogInResponseDto, SignUpRequestDto } from "./user.dto";
import { User, UserData } from "../../decorators";
import { AuthGuard } from "../../guards/auth.guard";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('signUp')
  async signUp(
    @Body() data: SignUpRequestDto,
  ): Promise<void> {
    await this.userService.signUp(data);
  }

  @Post('logIn')
  async logIn(
    @Body() data: LogInRequestDto,
  ): Promise<LogInResponseDto> {
    return await this.userService.logIn(data);
  }

  @Post('getNewAccessToken')
  async newAccessToken(
    @Body() data: GetNewAccessTokenRequestDto,
  ): Promise<LogInResponseDto> {
    const refreshToken = data.refreshToken;
    const accessToken = await this.userService.getNewAccessToken(refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('logOut')
  @UseGuards(AuthGuard)
  async logOut(
    @User() user: UserData,
  ): Promise<void> {
    await this.userService.logOut(user.tokenId);
  }
}
