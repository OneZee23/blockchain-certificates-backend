import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserCollectionModel } from "../../data-sources";
import { UserService } from "./user.service";
import { RefreshTokenModule } from "../refreshToken";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([ UserCollectionModel ]),
    JwtModule.register({}),
    RefreshTokenModule,
  ],
  providers: [ UserService ],
  exports: [ UserService ],
  controllers: [ UserController ],
})
export class UserModule {}
