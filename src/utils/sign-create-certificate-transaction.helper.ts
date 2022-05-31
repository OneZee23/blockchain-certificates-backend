import { abi as CertificatesRouterABI } from "../modules/certificates/artifacts/CertificatesRouter.json";

const Web3 = require('web3');
const Transaction = require('ethereumjs-tx').Transaction;
const ethers = require('ethers');
const Common = require("ethereumjs-common");
require('dotenv').config();

const certificatesRouterContractAddress = process.env.CERTIFICATES_ROUTER_CONTRACT_ADDRESS;
const managerEthereumWalletAddress = process.env.CRYPTO_WALLET_ADDRESS;
const privateKey = process.env.CRYPTO_WALLET_PRIVATE_KEY;
const WEB3_HTTP_PROVIDER = process.env.POLYGON_NETWORK_ADDRESS;
const chainId = 80001;

export class SignCreateCertificateTransactionInput {
  to!: string;
  ipfsHash!: string;
  description!: string;
}

export async function signCreateCertificateTransaction(
  {
    to,
    ipfsHash,
    description,
  }: SignCreateCertificateTransactionInput,
): Promise<string> {
  const web3 = new Web3.providers.HttpProvider(WEB3_HTTP_PROVIDER);
  const ethersProvider = new ethers.providers.Web3Provider(web3);
  const contract = new ethers.Contract(certificatesRouterContractAddress, CertificatesRouterABI, ethersProvider);

  let nonce = await ethersProvider.getTransactionCount(managerEthereumWalletAddress, 'pending');
  const data = (await contract.populateTransaction.createCertificate(
    to,
    ipfsHash,
    description,
  )).data;


  const gasLimit = (await contract.estimateGas.createCertificate(
    to,
    ipfsHash,
    description,
    {
        from: managerEthereumWalletAddress,
    },
  ));

  const details = {
    to: certificatesRouterContractAddress,
    value: 0,
    gasLimit: gasLimit.toHexString(),
    gasPrice: ethers.utils.parseUnits('10', 'gwei').toHexString(),
    nonce: ethers.utils.hexlify(nonce),
    data,
  };

  const common = Common.default.forCustomChain('ropsten', {
    name: 'matic',
    networkId: chainId,
    chainId: chainId
  }, 'petersburg');
  const transaction = new Transaction(details, { common });
  transaction.sign(Buffer.from(privateKey, 'hex'));
  const serializedTransaction = transaction.serialize();
  return '0x' + serializedTransaction.toString('hex');
}
