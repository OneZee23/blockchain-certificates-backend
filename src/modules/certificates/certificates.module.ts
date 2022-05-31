import { Module } from "@nestjs/common";
import { CertificatesController } from "./certificates.controller";
import { CertificatesService } from "./certificates.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockchainCertificatesCollectionModel } from "../../data-sources";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([ BlockchainCertificatesCollectionModel ]),
    JwtModule,
  ],
  providers: [ CertificatesService ],
  exports: [ CertificatesService ],
  controllers: [ CertificatesController ],
})
export class CertificatesModule {}
