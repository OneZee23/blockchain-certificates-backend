import { Controller, Post, UseGuards, Body, UseInterceptors, UploadedFile, Get, Query } from "@nestjs/common";
import { CertificatesService } from "./certificates.service";
import { AuthGuard } from "../../guards";
import {
  CreateCertificateRequestDto,
  CreateCertificateResponseDto, GetCertificateRequestDto, GetCertificateResponseDto,
  GetNewCertificateQuoteRequestDto,
  GetNewCertificateQuoteResponseDto,
  SendCreateCertificateTransactionRequestDto,
  SendCreateCertificateTransactionResponseDto, SetActiveStatusRequestDto,
  SetCertificateRequestDto
} from "./certificates.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from "./certificates.constants";

@Controller('certificates')
export class CertificatesController {
  constructor(
    private readonly certificatesService: CertificatesService,
  ) {}

  @Get('getNewCertificateQuote')
  @UseGuards(AuthGuard)
  async getNewCertificateQuote(
    @Query() data: GetNewCertificateQuoteRequestDto,
  ): Promise<GetNewCertificateQuoteResponseDto> {
    return await this.certificatesService.getNewCertificateQuote(data);
  }

  @Post('uploadCertificate')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadCertificate(
    @Body() { toEtherWalletAddress, description }: CreateCertificateRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateCertificateResponseDto> {
    if (!file) {
      throw new Error(`Validation errors('undefined file', 'image')`);
    }
    return await this.certificatesService.uploadCertificate({
      fileBuffer: file.buffer,
    });
  }

  @Post('sendCreateCertificateTransaction')
  @UseGuards(AuthGuard)
  async sendCreateCertificateTransaction(
    @Body() { managerEtherWalletAddress, signedTransactionBody }: SendCreateCertificateTransactionRequestDto,
  ): Promise<SendCreateCertificateTransactionResponseDto> {
    return await this.certificatesService.sendCreateCertificateTransaction(managerEtherWalletAddress, signedTransactionBody);
  }

  @Post('setCertificate')
  @UseGuards(AuthGuard)
  async setCertificate(
    @Body() data: SetCertificateRequestDto,
  ): Promise<void> {
    await this.certificatesService.setCertificate(data);
  }

  @Get('getCertificate')
  @UseGuards(AuthGuard)
  async getCertificate(
    @Query() { certificateId }: GetCertificateRequestDto,
  ): Promise<GetCertificateResponseDto> {
    return await this.certificatesService.getCertificate(certificateId);
  }

  @Post('setActiveStatus')
  @UseGuards(AuthGuard)
  async setActiveStatus(
    @Body() { certificateId, status }: SetActiveStatusRequestDto,
  ): Promise<void> {
    await this.certificatesService.setActiveStatus(certificateId, status);
  }
}
