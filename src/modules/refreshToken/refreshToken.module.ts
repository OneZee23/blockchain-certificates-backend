import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshTokenService } from "./refreshToken.service";
import { RefreshTokenCollectionModel } from "../../data-sources";

@Module({
  imports: [ TypeOrmModule.forFeature([ RefreshTokenCollectionModel ]) ],
  providers: [ RefreshTokenService ],
  exports: [ RefreshTokenService ]
})
export class RefreshTokenModule {
}
