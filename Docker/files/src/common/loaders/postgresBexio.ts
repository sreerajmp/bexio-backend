const { Pool } = require('pg')
import config from '../config/index'

console.log(config.DB_NAME);

const pool = new Pool({
  user:  config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME_BEXIO,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
  max: process.env.MAX_CLIENTS_IN_POOL,
  idleTimeoutMillis: process.env.CLIENT_CONNECTION_TIMEOUT_MILLIS,
  connectionTimeoutMillis: process.env.IDLE_TIMEOUT_MILLIS,
})
  // const connectPostgres = pool.connect()
  const connectPostgres =pool.connect()
    .then(pool => {
      // pool.query('select id,object_id,code as name,url as appLink,icon as src, additional_info  as className,active from application', (err, res) => {
      //     console.log(err, res)
      //     // pool.end()
      //   })
      config.DB_BEXIO=true;
      console.log('Connected to postgres in Normal')
      return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

 export default connectPostgres;