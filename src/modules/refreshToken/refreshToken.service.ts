import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RefreshTokenDto } from "./refreshToken.dto";
import { RefreshTokenCollectionModel } from "../../data-sources";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenCollectionModel)
    private readonly refreshTokenRepository: Repository<RefreshTokenCollectionModel>,
  ) {}

  async createToken(refreshToken: RefreshTokenDto): Promise<void> {
    const dataToCreate: Partial<RefreshTokenCollectionModel> = {
      ...refreshToken,
    }
    await this.refreshTokenRepository.save(dataToCreate);
  }

  async getTokenId(token: string): Promise<string> {
    const foundToken = await this.refreshTokenRepository.findOne({ where: { token } });
    if (!foundToken) {
      throw new Error('RefreshToken not found by hashedToken');
    }
    return foundToken.id;
  }

  async getTokensByUserId(userId: number): Promise<RefreshTokenCollectionModel[]> {
    const foundTokens = await this.refreshTokenRepository.find({ where: { userId } });
    return foundTokens ?? [];
  }

  async getUserIdByRefreshTokenMatches(token: string): Promise<string> {
    const foundToken = await this.refreshTokenRepository.findOne({ where: { token } });
    if (!foundToken) {
      throw new Error('RefreshToken not found by tokenId');
    }
    return foundToken.userId;
  }

  async deleteToken(tokenId: number): Promise<void> {
    const foundTokens = await this.refreshTokenRepository.findOne(tokenId);
    if (!foundTokens) {
      throw new Error('RefreshToken not found by tokenId');
    }
    await this.refreshTokenRepository.delete(tokenId);
  }
}
