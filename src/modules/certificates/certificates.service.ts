import { Injectable } from "@nestjs/common";
import {
  CreateCertificateResponseDto,
  GasPriceOneItem,
  GetCertificateResponseDto,
  GetNewCertificateQuoteRequestDto,
  GetNewCertificateQuoteResponseDto,
  GetPricesOutput,
  SendCreateCertificateTransactionResponseDto,
  SetCertificateRequestDto,
  UploadCertificateInput
} from "./certificates.dto";
import { AppEnv, ConfigService } from "../config";
import { ethers } from "ethers";
import { abi as CertificatesRouterABI } from "./artifacts";
import BigNumber from "bignumber.js";
import {
  CURRENT_POLYGON_MATIC_USD_PRICE,
  DEFAULT_POLYGON_GAS_PRICES,
  GWEI_PRICE_IN_ETHER,
  LOCALHOST_IPFS_URL,
  PRICE_BASE_IN_WEI,
  PUBLIC_IPFS_URL,
  TEST_CERTIFICATE_DESCRIPTION,
  TEST_CERTIFICATE_IPFS_HASH
} from "./certificates.constants";
import {
  BlockchainCertificate,
  CertificateStatuses,
  FeeCryptoCurrencyTypes,
  NetworkType,
  PolygonNetCodes
} from "./certificates.interfaces";

@Injectable()
export class CertificatesService {
  private readonly certificatesRouterContract = new ethers.Contract(
    this.configService.config.certificates.routerContractAddress,
    CertificatesRouterABI,
    this.configService.web3Polygon,
  );

  constructor(
    private readonly configService: ConfigService,
  ) {}

  async getNewCertificateQuote(
    {
      managerEtherWalletAddress,
      toEtherWalletAddress,
      networkType,
    }: GetNewCertificateQuoteRequestDto,
  ): Promise<GetNewCertificateQuoteResponseDto> {
    const requestedNetworkType = networkType ? networkType : NetworkType.POLYGON;
    const newCertificateGasEstimation = (await this.certificatesRouterContract.estimateGas.createCertificate(
      toEtherWalletAddress,
      TEST_CERTIFICATE_IPFS_HASH,
      TEST_CERTIFICATE_DESCRIPTION,
    )).toNumber();
    const transactionParams = await this.getPrices(
      managerEtherWalletAddress,
      newCertificateGasEstimation,
      requestedNetworkType,
    );
    const feeTokenCode = CertificatesService.getFeeTokenCode(requestedNetworkType);

    return {
      transactionParams,
      feeTokenCode,
      contractAddress: this.configService.config.certificates.routerContractAddress,
    };
  }

  async uploadCertificate(
    {
      fileBuffer,
    }: UploadCertificateInput,
  ): Promise<CreateCertificateResponseDto> {
    const isOnline = await this.configService.ipfsClient.isOnline();
    if (!isOnline) {
      throw new Error('No ipfs connection');
    }
    const uploadResult = await this.configService.ipfsClient.add({ content: fileBuffer });
    const ipfsHash = uploadResult.path;
    return {
      ipfsHash,
    }
  }

  async sendCreateCertificateTransaction(
    managerEtherWalletAddress: string,
    signedTransactionBody: string,
  ): Promise<SendCreateCertificateTransactionResponseDto> {
    const isEnoughMoney = await this.isEnoughMoneyToSendTransaction(
      managerEtherWalletAddress,
      signedTransactionBody,
    );
    if (!isEnoughMoney) {
      throw new Error('Not enough money to send transaction');
    }

    const transactionHash = await this.configService.web3Polygon
      .sendTransaction(signedTransactionBody).then((transaction) => {
        return transaction.hash;
      }
    );
    const currentCertificateId = await this.getLastCertificateId() + 1;

    return {
      certificateId: currentCertificateId.toString(),
      transactionHash,
    };
  }

  async getCertificate(certificateId: string): Promise<GetCertificateResponseDto> {
    const foundCertificate: BlockchainCertificate =
      await this.certificatesRouterContract.callStatic.getCertificate(certificateId);
    const isIpfsHashAvailable = foundCertificate.ipfsHash;
    if (!isIpfsHashAvailable) {
      throw new Error('Such a certificate id not found');
    }

    const isActive = await this.certificatesRouterContract.callStatic.isActive(certificateId);

    const certificateUrl = CertificatesService.getCertificateIpfsUrl(foundCertificate.ipfsHash);
    return {
      ownerEtherWalletAddress: foundCertificate.to,
      certificateUrl,
      description: foundCertificate.description,
      isActive,
    };
  }

  async setActiveStatus(certificateId: string, status: CertificateStatuses): Promise<void> {
    const foundCertificate: BlockchainCertificate =
      await this.certificatesRouterContract.callStatic.getCertificate(certificateId);
    const isIpfsHashAvailable = foundCertificate.ipfsHash;
    if (!isIpfsHashAvailable) {
      throw new Error('Such a certificate id not found');
    }

    const isActive = await this.certificatesRouterContract.callStatic.isActive(certificateId);
    if (isActive !== status) {
      return;
    }

    if (status === CertificateStatuses.ACTIVE) {
      await this.certificatesRouterContract.callStatic.setActive(certificateId);
    }
    await this.certificatesRouterContract.callStatic.setInactive(certificateId);
  }

  async setCertificate(
    {
      certificateId,
      etherWalletAddress,
      description,
    }: SetCertificateRequestDto,
  ): Promise<void> {
    return await this.certificatesRouterContract.callStatic.setCertificate(
      certificateId,
      etherWalletAddress,
      description
    );
  }

  private static getCertificateIpfsUrl(ipfsHash: string): string {
    if (process.env.ENV === AppEnv.Testing.toString()) {
      return LOCALHOST_IPFS_URL + ipfsHash;
    }
    return PUBLIC_IPFS_URL + ipfsHash;
  }

  private async getLastCertificateId(): Promise<number> {
    return +(await this.certificatesRouterContract.callStatic.lastId());
  }

  private async isEnoughMoneyToSendTransaction(
    etherWalletAddress: string,
    signedTransactionBody: string,
  ): Promise<boolean> {
    const decodedTx = ethers.utils.RLP.decode(signedTransactionBody);
    const gasPrice = ethers.BigNumber.from(decodedTx[1]);
    const gasLimit = ethers.BigNumber.from(decodedTx[2]);
    const gasPriceFee = gasPrice.mul(gasLimit);

    const etherWalletBalance = (await this.configService.web3Polygon.getBalance(etherWalletAddress)).toString();
    return ethers.BigNumber.from(etherWalletBalance).gte(gasPriceFee);
  }

  private async getPrices(
    etherWalletAddress: string,
    gasLimit: number,
    networkType: NetworkType,
  ): Promise<GetPricesOutput> {
    const gasPriceRaw = DEFAULT_POLYGON_GAS_PRICES;
    const nonce = await this.getAddressNonceByNetworkType(etherWalletAddress, networkType);
    const chainId = PolygonNetCodes.MUMBAI;
    const platformTokenPriceInUSD = CURRENT_POLYGON_MATIC_USD_PRICE;

    const getOneItem = (way: 'fastest' | 'fast' | 'safeLow'): GasPriceOneItem => {
      const price = gasPriceRaw[way].price;
      const duration = Math.ceil(gasPriceRaw[way].duration);
      const priceInWei = new BigNumber(price).times(PRICE_BASE_IN_WEI);
      const fee = price * gasLimit * GWEI_PRICE_IN_ETHER;
      return {
        price: +priceInWei.toFixed(),
        limit: gasLimit,
        duration,
        fee: +CertificatesService.round(fee, 8),
        feeInDollars: +CertificatesService.round(fee * platformTokenPriceInUSD, 8),
      };
    };

    return {
      fastest: getOneItem('fastest'),
      fast: getOneItem('fast'),
      safeLow: getOneItem('safeLow'),
      nonce,
      chainId,
    };
  }

  private async getAddressNonceByNetworkType(etherWalletAddress: string, networkType: NetworkType): Promise<number> {
    switch (networkType) {
      case NetworkType.ETHEREUM:
      case NetworkType.BINANCE_SMART_CHAIN:
      case NetworkType.POLYGON:
        return await this.configService.web3Polygon.getTransactionCount(etherWalletAddress, 'pending');
      default:
        throw new Error('No such switch case: ' + networkType);
    }
  }

  private static getFeeTokenCode(networkType: NetworkType): FeeCryptoCurrencyTypes {
    switch (networkType) {
      case NetworkType.ETHEREUM:
        return FeeCryptoCurrencyTypes.ETHER;
      case NetworkType.BINANCE_SMART_CHAIN:
        return FeeCryptoCurrencyTypes.BNB;
      case NetworkType.POLYGON:
        return FeeCryptoCurrencyTypes.MATIC;
      default:
        throw new Error('No such switch case: ' + networkType);
    }
  }

  private static round(num: number | string, decimalPlaces: number): string {
    const bn = new BigNumber(num);
    return bn.decimalPlaces(decimalPlaces, 0).toFixed();
  }
}
