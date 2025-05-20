import { Issuer, generators } from 'openid-client';
import { connectLibrary } from '../../db/prisma-clients';
import config from '../config';

export const edit = async () => {
  const code = 'BEXIO_INTERFACE';

  // Use Prisma ORM (raw query)
  const getBexioKeys = await connectLibrary.$queryRaw<any[]>`
    SELECT * FROM social_account_provider WHERE code = ${code}
  `;

  if (!getBexioKeys || getBexioKeys.length === 0) {
    throw new Error('Bexio keys not found');
  }

  const keyDetails = getBexioKeys[0].config;
  console.log(keyDetails);

  const issuer = await Issuer.discover('https://auth.bexio.com/realms/bexio');

  const client = new issuer.Client({
    client_id: keyDetails.BEXIO_CLIENT_ID,
    client_secret:keyDetails.BEXIO_SECRET,
    redirect_uri: `${config.API_URL}api/v1/bexio-user/bexio-redirect`,
    response_types: ['code']
  });


  return client;
};
