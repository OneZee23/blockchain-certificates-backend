import { IsEnum, IsEthereumAddress, IsNumberString, IsOptional, IsString } from "class-validator";
import { CertificateStatuses, ChainIds, FeeCryptoCurrencyTypes, NetworkType } from "./certificates.interfaces";

export class CreateCertificateRequestDto {
  @IsEthereumAddress()
  toEtherWalletAddress!: string;

  @IsString()
  description!: string;
}

export class CreateCertificateResponseDto {
  ipfsHash!: string;
}

export class UploadCertificateInput {
  fileBuffer!: Buffer;
}

export class GetNewCertificateQuoteRequestDto {
  @IsEthereumAddress()
  managerEtherWalletAddress!: string;

  @IsEthereumAddress()
  toEtherWalletAddress!: string;

  @IsEnum(NetworkType)
  @IsOptional()
  networkType?: NetworkType;
}

export class GetNewCertificateQuoteResponseDto {
  transactionParams!: GetPricesOutput;
  feeTokenCode!: FeeCryptoCurrencyTypes;
  contractAddress!: string;
}

export class GetPricesOutput {
  fastest!: GasPriceOneItem;
  fast!: GasPriceOneItem;
  safeLow!: GasPriceOneItem;
  nonce!: number;
  chainId!: ChainIds;
}

export class GasPriceOneItem {
  price!: number;
  limit!: number;
  duration!: number;
  fee!: number;
  feeInDollars!: number;
}

export class SetCertificateRequestDto {
  @IsNumberString()
  certificateId!: string;

  @IsEthereumAddress()
  etherWalletAddress!: string;

  @IsString()
  description?: string;
}

export class SendCreateCertificateTransactionRequestDto {
  @IsEthereumAddress()
  managerEtherWalletAddress!: string;

  @IsString()
  signedTransactionBody!: string;
}

export class SendCreateCertificateTransactionResponseDto {
  certificateId!: string;
  transactionHash!: string;
}

export class GetCertificateRequestDto {
  @IsNumberString()
  certificateId!: string;
}

export class GetCertificateResponseDto {
  ownerEtherWalletAddress!: string;
  certificateUrl!: string;
  description!: string;
  isActive!: boolean;
}

export class SetActiveStatusRequestDto {
  @IsNumberString()
  certificateId!: string;

  @IsEnum(CertificateStatuses)
  status!: CertificateStatuses;
}
