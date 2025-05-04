import config from '../config';
import { createClient } from 'redis';

// REDIS Connection START
const redisClient = createClient({
    url:`redis://${config.REDIS_HOST}:${config.REDIS_PORT}`
    // password: config.REDIS_PASSWORD,
    // username: 'default',
});

redisClient.on('connect', function () {
    console.log('Connected Redis SuccessFully!', config.REDIS_HOST);
});

redisClient.on('error', (err) => {
    console.log('error to use redis!', err.message);
});

// Connect to Redis
redisClient.connect().catch(console.error);

// REDIS Connection END

export default redisClient;
