import config from '../config';
const redis = require('redis');

// REDIS Connection START
const redisClient = redis.createClient({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
});

redisClient.on('connect', function () {
    console.log('Connected Redis SuccessFully!', config.REDIS_HOST);
});
redisClient.on('error', (err) => {
    console.log('error to use redis!', err.message);
});
//   // REDIS Connection END

module.exports = redisClient;
