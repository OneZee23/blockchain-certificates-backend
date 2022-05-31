import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ConfigModel, JwtOptionsModel } from "./config.model";
import { ethers } from 'ethers';
import * as ipfsHttpClient from 'ipfs-http-client';
import Web3 from 'web3';
require('dotenv/config');

@Injectable()
export class ConfigService {
  private readonly _config: ConfigModel;
  private readonly _web3Polygon: ethers.providers.JsonRpcProvider;
  private readonly _ipfsClient: ipfsHttpClient.IPFSHTTPClient;

  private readonly _web3Configuration = {
    timeout: 30000, // ms

    clientConfig: {
      // Useful if requests are large
      maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
      maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

      // Useful to keep a connection alive
      keepalive: true,
      keepaliveInterval: -1, // ms
    },

    // Enable auto reconnection
    reconnect: {
      auto: true,
      delay: 1000, // ms
      maxAttempts: 10,
      onTimeout: false,
    },
  };

  constructor() {
    this._config = ConfigService.validateConfig();

    // web3 blockchain
    const polygonProvider = new Web3.providers.HttpProvider(this.config.polygonNet.address, this._web3Configuration);
    this._web3Polygon = new ethers.providers.Web3Provider(polygonProvider as unknown as ethers.providers.JsonRpcFetchFunc);

    // ipfs
    this._ipfsClient = ipfsHttpClient.create({
      host: this._config.ipfs.host,
      port: this._config.ipfs.port,
      protocol: this._config.ipfs.protocol,
    });
  }

  get config(): ConfigModel {
    return this._config;
  }

  get web3Polygon() {
    return this._web3Polygon;
  }

  get ipfsClient() {
    return this._ipfsClient;
  }

  public get typeorm(): any {
    return this._config.typeorm;
  }

  get jwtOptionsSignAccessToken(): JwtOptionsModel {
    return {
      secret: this._config.jwt.secretAccess,
      expiresIn: this._config.jwt.accessExp
    };
  }

  private static validateConfig(): ConfigModel {
    const envs = process.env as any;
    const plainConfig = {
      env: envs.ENV,
      port: parseInt(envs.PORT),
      typeorm: {
        type: envs.TYPEORM_CONNECTION,
        host: envs.TYPEORM_HOST,
        port: +envs.TYPEORM_PORT,
        database: envs.TYPEORM_DATABASE,
        username: envs.TYPEORM_USERNAME,
        password: envs.TYPEORM_PASSWORD,
        synchronize: envs.TYPEORM_SYNCHRONIZE === 'true',
        entities: [envs.TYPEORM_ENTITIES],
      },
      certificates: {
        routerContractAddress: envs.CERTIFICATES_ROUTER_CONTRACT_ADDRESS,
      },
      web3: {
        rpcUrl: envs.WEB3_RPC_URL,
        privateKey: envs.WEB3_PRIVATE_KEY,
      },
      jwt: {
        secretAccess: process.env.JWT_SECRET_ACCESS,
        accessExp: process.env.JWT_ACCESS_EXP,
        secretRefresh: process.env.JWT_SECRET_REFRESH,
        refreshExp: process.env.JWT_REFRESH_EXP,
      },
      polygonNet: {
        address: process.env.POLYGON_NETWORK_ADDRESS,
        polygonscanAPIKey: process.env.POLYGON_NETWORK_SCAN_API_KEY,
        netCode: process.env.POLYGON_NETWORK_CODE,
      },
      ipfs: {
        host: process.env.IPFS_HOST,
        port: process.env.IPFS_PORT,
        protocol: process.env.IPFS_PROTOCOL,
      },
    };
    const result = plainToClass(ConfigModel, plainConfig);
    const errors = validateSync(result);
    if (errors.length > 0) {
      const list = errors.map((error) => {
        return error.toString();
      });
      throw new Error(
        `Environment configuration is invalid: ` + list.join(' - '),
      );
    }

    return result;
  }
}
