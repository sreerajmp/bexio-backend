
const sql = require('mssql')
import config from '../config/index'


const sqlConfig = {
  user: config.EBILL_DB_USER,
  password: config.EBILL_DB_PASSWORD,
  database: config.EBILL_DB_NAME,
  server: config.EBILL_DB_HOST,
  port: config.EBILL_DB_PORT,
  pool: {
    max: config.MAX_CLIENTS_IN_POOL,
    min: 0,
    idleTimeoutMillis:config.IDLE_TIMEOUT_MILLIS,
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}

const connectEbillPostgres = sql.connect(sqlConfig)
    .then((dbConn) => {
       console.log('Connected to MSSQL in Normal');
       
        return dbConn;
    })
    .catch((err) => console.log(`Database Connection Failed! Bad Config:${config.EBILL_DB_NAME} `, err));


export default connectEbillPostgres;