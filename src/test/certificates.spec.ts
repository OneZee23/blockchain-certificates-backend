import { signCreateCertificateTransaction } from "../utils/sign-create-certificate-transaction.helper";

describe('Main integrated tests – certificates', () => {
  it('sign create certificate transaction', async () => {
    const signedTransactionBody = await signCreateCertificateTransaction({
      to: '0xC4232867b2634B57ebc4dd9c1f78AD66eb050CED',
      ipfsHash: 'someIpfsHash',
      description: 'someDescription',
    });
    console.log('signedTransactionBody: ', signedTransactionBody);
    expect(signedTransactionBody).toBeTruthy();
  });
});
