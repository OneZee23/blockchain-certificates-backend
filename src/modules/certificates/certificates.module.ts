import { Module } from "@nestjs/common";
import { CertificatesController } from "./certificates.controller";
import { CertificatesService } from "./certificates.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockchainCertificatesCollectionModel } from "../../data-sources";

@Module({
  imports: [ TypeOrmModule.forFeature([ BlockchainCertificatesCollectionModel ]) ],
  providers: [ CertificatesService ],
  exports: [ CertificatesService ],
  controllers: [ CertificatesController ],
})
export class CertificatesModule {}
