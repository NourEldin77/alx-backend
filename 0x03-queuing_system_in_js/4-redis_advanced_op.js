import redis from 'redis';

const client = redis.createClient();

client.on('error', (err) => {
    console.error('Error connecting to Redis', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
    
    client.hset('HolbertonSchools', 'Portland', 50, redis.print);
    client.hset('HolbertonSchools', 'Seattle', 80, redis.print);
    client.hset('HolbertonSchools', 'New York', 20, redis.print);
    client.hset('HolbertonSchools', 'Bogota', 20, redis.print);
    client.hset('HolbertonSchools', 'Cali', 40, redis.print);
    client.hset('HolbertonSchools', 'Paris', 2, redis.print);

    client.hgetall('HolbertonSchools', (err, obj) => {
        if (err) {
            console.error('Error fetching data from Redis', err);
        } else {
            console.log(obj);
        }
        client.quit();
    });
});