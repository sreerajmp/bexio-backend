let { Issuer, generators } = require('openid-client');
import connectPostgres from '../../common/loaders/postgres';



module.exports = {
    edit: async () => {
        let pool = await connectPostgres;

        const getBexioKeysQry = `SELECT * 
        FROM social_account_provider
        WHERE code = $1`
        
        const getBexioKeys = await pool.query(getBexioKeysQry, ['BEXIO']);
        let keyDeatis = getBexioKeys.rows[0].config;
        console.log(keyDeatis);

            let issuer = await Issuer.discover('https://idp.bexio.com');
            let client = new issuer.Client({
            client_id: keyDeatis.BEXIO_CLIENT_ID,
            client_secret:keyDeatis.BEXIO_SECRET,
            redirect_uris: keyDeatis.BEXIO_REDIRECT_URIS
        })
        console.log('bexio');
        
        return client;
    }
}