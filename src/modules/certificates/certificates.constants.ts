import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { fileFilter } from "../../filtres/exception-file.filter";

export const ALLOWED_FILE_EXTENSIONS = [
  'png',
  'jpeg',
  'gif',
  'jpg',
];
export const MAX_FILE_SIZE_IN_MB = 10; // 10 megabytes
export const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024;

export const multerOptions: MulterOptions = {
  fileFilter,
  limits: {
    files: 1,
    fileSize: MAX_FILE_SIZE,
  },
};

export const TEST_CERTIFICATE_IPFS_HASH = 'someHash';
export const TEST_CERTIFICATE_DESCRIPTION = 'someDescription';
export const DEFAULT_POLYGON_GAS_PRICES = {
  fastest: {
    price: 7,
    duration: 1,
  },
  fast: {
    price: 5,
    duration: 1,
  },
  safeLow: {
    price: 3,
    duration: 1,
  },
}
export const CURRENT_POLYGON_MATIC_USD_PRICE = 0.6676; // in dollars
export const GWEI_PRICE_IN_ETHER = 0.000000001;
export const PRICE_BASE_IN_WEI = 1e+9;
export const PUBLIC_IPFS_URL = 'https://ipfs.io/ipfs/';
export const LOCALHOST_IPFS_URL = 'http://bafybeietlcqkya7o4vjekbm6n2a7lvlygugl6z6cd6dexr2prhbzimtzjm.ipfs.localhost:8080/?filename=';
