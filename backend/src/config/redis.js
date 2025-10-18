const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-13396.c322.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 13396
    }
});

module.exports = redisClient; 



