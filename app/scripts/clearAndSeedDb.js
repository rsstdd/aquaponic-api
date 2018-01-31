import redis from 'redis';
import clearDb from '../utils/clearDb';
import seed from '../utils/seed';
import mongoose from 'mongoose';
import config from '../config';
import bluebird from 'bluebird';

const db = mongoose.connect(config.mongo.url);
db.connection.on('open', () => clearAndSeedDb());
db.connection.on('disconnected', () => console.log('db connection disconnected'));
db.connection.on('close', () => console.log('db connection closed'));
db.connection.on('error', (err) => console.log('db connection error: ', err));
mongoose.Promise = bluebird;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

global.redis_client = redis.createClient(process.env.REDIS_URL); //creates a new client

async function clearAndSeedDb() {
  try {
    console.log('trying clearAndSeedDb...');
    const clearResult = await clearDb();
    const seedResult = await seed();

    console.log('all done!');
    process.exit();
  } catch(e) {
    console.log('error: ', e);
  }
}
