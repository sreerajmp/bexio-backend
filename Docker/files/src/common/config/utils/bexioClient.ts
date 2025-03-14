import { Issuer, generators } from 'openid-client';
import { connectLibrary } from '../../../db/prisma-clients';

export const edit = async () => {
  const code = 'BEXIO';

  // Use Prisma ORM (raw query)
  const getBexioKeys = await connectLibrary.$queryRaw<any[]>`
    SELECT * FROM social_account_provider WHERE code = ${code}
  `;

  if (!getBexioKeys || getBexioKeys.length === 0) {
    throw new Error('Bexio keys not found');
  }

  const keyDetails = getBexioKeys[0].config;
  console.log(keyDetails);

  const issuer = await Issuer.discover('https://idp.bexio.com');

  const client = new issuer.Client({
    client_id: '28edc495-45a1-4d67-a9a9-c48022b5e639',
    client_secret: 'APZ6OmJvjYVYe-ir-hMBDL2zTLHKfqQBtOSUPD9tOnOIbPnicqtOgqstaHA8zQS-JRbi2zyZXu3N7A0R72VlMDQ',
    redirect_uris: ['http://localhost:3000/bexioRedirect'], 
  });

  console.log('*****************', 'bexio');

  return client;
};
