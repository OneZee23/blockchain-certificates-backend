import { Injectable } from "@nestjs/common";

@Injectable()
export class CertificatesService {
  constructor() {}

  async test(): Promise<string> {
    return 'asd';
  }
}
