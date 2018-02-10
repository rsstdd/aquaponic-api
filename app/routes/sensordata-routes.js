import express from 'express';
import getSensorData from './sensordata/get-sensordata';
// import { authenticateUser } from '../utils/authenticate-user'

const router = express.Router({ mergeParams: true });

// router.use(authenticateUser);
router.get('/', getSensorData);

export default router;
