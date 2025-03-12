const { Pool } = require('pg')
import config from '../config/index'

const pool = new Pool({
  user:  config.GATE2B_DB_USER,
  host: config.GATE2B_DB_HOST,
  database: config.GATE2B_DB_NAME,
  password: config.GATE2B_DB_PASSWORD,
  port: config.GATE2B_DB_PORT,
  max: process.env.MAX_CLIENTS_IN_POOL,
  idleTimeoutMillis: process.env.CLIENT_CONNECTION_TIMEOUT_MILLIS,
  connectionTimeoutMillis: process.env.IDLE_TIMEOUT_MILLIS,
})

  // const connectGate2b = pool.connect()
  const connectGate2b = pool.connect()
    .then(pool => {
      config.DB_G2B=true;
       console.log('Connected to postgres in gate2b');
      return pool
    })
    .catch(err => {})

 export default connectGate2b;