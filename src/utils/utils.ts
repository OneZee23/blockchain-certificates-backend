import { utils } from "ethers";


export function toChecksumAddress(address: string): string {
  return utils.getAddress(address);
}
