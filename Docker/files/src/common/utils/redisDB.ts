import config from '../config';
import { createClient } from 'redis';

// REDIS Connection START
const redisClient = createClient({
    url: `redis://redis-13011.c98.us-east-1-4.ec2.redns.redis-cloud.com:13011`,
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
