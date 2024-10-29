import express from 'express';
import subscribers from '../controllers/subscribers.js';
import authenticateMiddleware from '../middleware/authenticate.js';
import upload from '../controllers/upload.js';
import subscriberValidation from '../utils/validations/subscribeValidator.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import log from '../middleware/log.js';

const router = express.Router();
router.get(
  '/list',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  subscribers.getAllSubscribers,
);
router.post(
  '/logs',
  authenticateMiddleware,
  // minimumPermissionLevelRequired('Admin'),
  subscribers.getAllLogs,
);
router.post(
  '/create',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  // subscriberValidation,
  upload.uploadSingle('Logo', '../uploads/subscriber'),
  subscribers.createSubscriber,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  upload.uploadSingle('Logo', '../uploads/subscriber'),
  subscribers.updateSubscriber,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  subscribers.removeSubscriber,
  log.addLog,
);
export default router;
