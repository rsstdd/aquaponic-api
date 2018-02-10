import express from 'express';

import createSensorData from './sensordata/create-sensor-data';

const router = express.Router();

router.post('/sensordata', createSensorData);

export default router;
