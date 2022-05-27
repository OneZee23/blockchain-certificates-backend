import { Controller, Get } from "@nestjs/common";
import { CertificatesService } from "./certificates.service";

@Controller('certificates')
export class CertificatesController {
  constructor(
    private readonly certificatesService: CertificatesService,
  ) {}

  @Get('test')
  async test(): Promise<string> {
    return this.certificatesService.test();
  }
}
