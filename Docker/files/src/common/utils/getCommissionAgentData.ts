import connectPostgres from "../loaders/postgres";
import config from '../../common/config/index';


const getConfigData = async (domainName = null, companyId = null) => {
    const pool = await connectPostgres;
    let defaultConfig;
    try {
        if (companyId) {
            const getCommisionAgentQry = `SELECT cap."defaultMail"
                ,ca.config AS defaultConfig
                ,cap.fk_commissionagent  
                FROM commissionagent_party cap
                INNER JOIN commissionagent ca ON ca.cid = cap.fk_commissionagent
                WHERE cap.fk_party = $1
                AND cap."defaultMail" = true`;
            const getCommisionAgentRslt = await pool.query(getCommisionAgentQry,[companyId]);
            if (getCommisionAgentRslt.rows.length > 0) {
                defaultConfig = getCommisionAgentRslt.rows[0].defaultconfig;
            }
            else {
                defaultConfig = JSON.parse(config.DEFAULT_CONFIG);
            }
        }
        else if (domainName) {
            const getConfig = ` SELECT 
                config->>'domain' AS domainname,
                config AS configdata
                FROM 
                public.commissionagent 
                WHERE config->>'domain' = $1
                AND config IS NOT NULL`;
            const getConfigRslt = await pool.query(getConfig,[domainName]);
            if (getConfigRslt.rows.length > 0) {
                defaultConfig = getConfigRslt.rows[0].configdata;
            }
            else {
                defaultConfig = JSON.parse(config.DEFAULT_CONFIG);
            }
        }
        else {
            defaultConfig = JSON.parse(config.DEFAULT_CONFIG);
        }
        return defaultConfig
    } catch (error) {
        console.error('Error fetching commission agent data:', error);
        throw new Error('Failed to retrieve configuration data.');
    }

}
module.exports = getConfigData