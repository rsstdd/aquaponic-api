import mongoose from 'mongoose';
import config from '../config';
import SensorData from '../models/SensorData';
import transformOldSensorData from '../utils/transform-old-sensor-data';

function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    const db = mongoose.connect(config.mongo.url);
    db.connection.on('open', () => console.log('db connection opened'));
    db.connection.on('disconnected', () => console.log('db connection disconnected'));
    db.connection.on('close', () => console.log('db connection closed'));
    db.connection.on('error', (err) => console.log('db connection error: ', err));
    mongoose.Promise = require('bluebird');
  }
}

async function createNewAndRemoveOld(doc) {
  try {
    const dataArray = transformOldSensorData(doc);

    if (!dataArray) return;

    if (dataArray.length >= 1) {
      for (let i = 0; i < dataArray.length; i++) {
        const saveResult = await SensorData.create(dataArray[i]);
      }
    }

    const removeResult = await doc.remove();

    return;
  } catch (e) {
    console.log('error: ', e);
  }
}

async function finishJob() {
  const num = await SensorData.count();

  console.log('done updating sensordata');
  console.log('num of sensordata in db: ', num);
  process.exit(0);
}

async function countData() {
  const num = await SensorData.count();
  console.log('found ' + num + ' sensor data...')
}

function reportError(err) {
  console.log('error: ', err)
  process.exit(1)
}

function perform() {
  console.log('reformatSensorData > starting...');
  SensorData.find().cursor()
    .on('data', createNewAndRemoveOld)
    .on('close', finishJob)
    .on('error', reportError);
}

connectMongo();
countData();
perform();
