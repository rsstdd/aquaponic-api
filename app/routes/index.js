import express from 'express';

import guestRoutes from './guest-routes.js';
import visitRoutes from './visit-routes.js';
import spaceRoutes from './space-routes.js';
import taskRoutes from './task-routes.js';
import createSensorData from './sensordata/create-sensor-data';
import notificationRoutes from './notification-routes';

const router = express.Router();

router.use('/guest', guestRoutes);
router.use('/visits', visitRoutes);
router.use('/spaces', spaceRoutes); // POST /spaces/:spaceId/tasks will route and use taskRoutes
router.use('/tasks', taskRoutes);  // but PATCH /tasks/:taskId will also use taskRoutes
router.use('/notifications', notificationRoutes);

// TODO: lock down the sensordata routes
router.post('/sensordata', createSensorData) // for posting directly from device (will not include spaceId);


export default router;
