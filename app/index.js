import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import redis from 'redis';
import bluebird from 'bluebird';
import config from './config';
import routes from './routes';

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');
app.disable('etag');
app.use(cors({ allowedHeaders: ['Authorization', 'Content-Type'] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const db = mongoose.connect(config.mongo.url);
db.connection.on('open', () => console.log('db connection opened'));
db.connection.on('disconnected', () => console.log('db connection disconnected'));
db.connection.on('close', () => console.log('db connection closed'));
db.connection.on('error', () => console.log('db connection error'));

mongoose.Promise = bluebird;
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

global.redis_client = redis.createClient(process.env.REDIS_URL); // creates a new client

app.use('/api', routes);
app.use('/', routes);

// Basic error handler
app.use((err, _req, res, _next) => {
  if (res.headersSent) {
    console.error('failed view step with', err.viewErr, err.stack);
  } else {
    if (err.output && err.output.statusCode) {
      return res
        .status(err.output.statusCode)
        .set({ 'Content-Type': 'application/JSON' })
        .send({ message: err.output.payload.message, error: err.data.error });
    } else if (err.status) {
      return res
        .status(err.status)
        .set('Content-Type', 'text/plain')
        .send(err.errors[0].messages[0]);
    }
    console.error(err.stack);

    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


export default app;
