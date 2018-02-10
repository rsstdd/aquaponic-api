import mongoose from 'mongoose';
import transformOldSensorData from '../../utils/transform-old-sensor-data';
import { setSensorCache } from '../../utils/sensor-cache';

const SensorData = mongoose.model('sensordata');

function extractIncomingData(body) {
  return { sensordata: body.sensordata ? body.sensordata : body };
}

async function createNewSensorData(dataArray) {
  try {
    const saveResult = await SensorData.create(dataArray);

    return true;
  } catch (e) {
    console.error('error: ', e);
    return false;
  }
}

export default (req, res) => {
  try {
    if (!req.body.sensordata && !req.body.hostname) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    // TODO: authenticate this request
    const incomingData = extractIncomingData(req.body);
    if (!incomingData) {
      return res.status(400).json({ error: 'Could not extract sensor data from request.' });
    }
    console.log(JSON.stringify(incomingData));

    const dataArray = transformOldSensorData(incomingData);
    if (!dataArray || dataArray.length <= 0) {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Rejected request: ${JSON.stringify(incomingData)}`);
      }
      return res.status(422).json({ success: false });
    }

    const result = createNewSensorData(dataArray);
    if (dataArray.value !== 0 || ['ppfd', 'lux'].includes(dataArray.type)) {
      setSensorCache(dataArray);
    } else {
      console.log(`Ignoring zero value for cache: ${JSON.stringify(incomingData)}`);
    }

    if (!result) {
      return res.status(500).json({ error: 'There was an error saving the data.' });
    }

    return res.status(201).json({ success: true });
  } catch (e) {
    console.error('error: ', e);
    return res.status(500).json({ error: 'There was an error saving the data.' });
  }
};
