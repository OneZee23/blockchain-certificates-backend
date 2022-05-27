import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "../config";
import { Repository } from 'typeorm';
import { LogInRequestDto, LogInResponseDto, SetRefreshTokenDto, SignUpRequestDto } from "./user.dto";
import { UserCollectionModel } from "../../data-sources";
import { toChecksumAddress } from "../../utils/utils";
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from "../refreshToken";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserCollectionModel)
    private readonly usersRepository: Repository<UserCollectionModel>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async signUp(
    data: SignUpRequestDto,
  ): Promise<void> {
    const blockchainAddressVerified = toChecksumAddress(data.blockchainAddress);
    const isByBlockchainAddress = await this.isByBlockchainAddress(blockchainAddressVerified);
    if (isByBlockchainAddress) {
      throw new Error('User with blockchain address already exists');
    }

    await this.createUser(data);
  }

  async logIn(
    {
      username,
      password,
    }: LogInRequestDto,
  ): Promise<LogInResponseDto> {
    const { id: userId } = await this.getAuthenticatedUser(username, password);

    const { hashedRefreshToken, tokenId } = await this.setRefreshToken(userId);
    const accessToken = this.jwtService.sign(
      {
        userId,
        refreshTokenId: tokenId,
      },
      this.configService.jwtOptionsSignAccessToken,
    );

    return {
      accessToken,
      refreshToken: hashedRefreshToken
    }
  }

  async getNewAccessToken(
    refreshToken: string,
  ): Promise<string> {
    const { id } = await this.findUserByRefreshTokenMatches(refreshToken);
    const tokenId = await this.getRefreshTokenId(refreshToken);
    return this.jwtService.sign(
      {
        userId: id,
        refreshTokenId: tokenId
      },
      this.configService.jwtOptionsSignAccessToken
    );
  }

  async logOut(accessToken: string): Promise<void> {
    const userTokenDecode = await this.jwtService.decode(accessToken);
    const tokenDecodeParsed = JSON.parse(JSON.stringify(userTokenDecode));
    const userId = tokenDecodeParsed.id;
    const tokenId = tokenDecodeParsed.tokenId;
    await this.removeRefreshToken(userId, tokenId);
  }

  private async getAuthenticatedUser(
    username: string,
    plainTextPassword: string,
  ): Promise<UserCollectionModel> {
    const user = await this.getByUsername(username);
    await this.verifyPassword(plainTextPassword, user.password);
    return user;
  }

  private async isByBlockchainAddress(
    blockchainAddress: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { blockchainAddress } });
    return !!user;
  }

  private async createUser(
    data: SignUpRequestDto,
  ): Promise<void> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const dataToCreate: Partial<UserCollectionModel> = {
      ...data,
      password: hashedPassword,
    }
    await this.usersRepository.save(dataToCreate);
  }

  async getByUsername(username: string): Promise<UserCollectionModel> {
    console.log(await this.usersRepository.find());
    const user = await this.usersRepository.findOne({ where: { username } });
    console.log('user: ', user);
    if (!user) {
      throw new Error('User with username not found');
    }
    return user;
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new Error('User password not valid');
    }
  }

  async setRefreshToken(userId: string): Promise<SetRefreshTokenDto> {
    const foundUser = await this.usersRepository.findOne(userId);
    if (!foundUser) {
      throw new Error('User not found');
    }

    const refreshToken = this.jwtService.sign(
      {
        userId
      },
      this.configService.jwtOptionsSignAccessToken,
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.refreshTokenService.createToken({ userId, token: hashedRefreshToken });
    const tokenId = await this.refreshTokenService.getTokenId(hashedRefreshToken);

    return {
      hashedRefreshToken,
      tokenId
    };
  }

  async getRefreshTokenId(hashedRefreshToken: string): Promise<string> {
    return await this.refreshTokenService.getTokenId(hashedRefreshToken);
  }

  async findUserByRefreshTokenMatches(refreshToken: string): Promise<UserCollectionModel> {
    const userId = await this.refreshTokenService.getUserIdByRefreshTokenMatches(refreshToken);
    const foundUser = await this.usersRepository.findOne(userId);
    if (!foundUser) {
      throw new Error('User not found');
    }
    return foundUser;
  }

  async removeRefreshToken(userId: number, tokenId: number): Promise<void> {
    const foundUser = await this.usersRepository.findOne({ where: { id: userId }});
    if (!foundUser) {
      throw new Error('User not found');
    }
    await this.refreshTokenService.deleteToken(tokenId);
  }
}
