export enum NetworkType {
  ETHEREUM = 'ETHEREUM',
  BINANCE_SMART_CHAIN = 'BINANCE_SMART_CHAIN',
  POLYGON = 'POLYGON',
}

export enum FeeCryptoCurrencyTypes {
  ETHER = 'ETHER',
  BNB = 'BNB',
  MATIC = 'MATIC',
}

export enum EthereumNetCodes {
  MAINNET = 1,
  ROPSTEN = 3,
}

export enum BinanceSmartChainNetCodes {
  MAINNET = 56,
  TESTNET = 97,
}

export enum PolygonNetCodes {
  MAINNET = 137,
  MUMBAI = 80001,
}

export type ChainIds = EthereumNetCodes | BinanceSmartChainNetCodes | PolygonNetCodes;

export interface BlockchainCertificate {
  to: string;
  ipfsHash: string;
  description: string;
}

export enum CertificateStatuses {
  ACTIVE = 1,
  INACTIVE = 0,
}
