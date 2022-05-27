import { Module } from '@nestjs/common';
import { CertificatesModule } from "./modules";
import { AppEnv, ConfigModule } from "./modules/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "./modules/user";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      keepConnectionAlive: process.env.ENV === AppEnv.Testing,
    }),
    UserModule,
    CertificatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
