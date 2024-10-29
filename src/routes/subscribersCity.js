import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import subscribersCity from '../controllers/subscribersCity.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post(
  '/list',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  subscribersCity.getAllSubscribersCities,
);
router.post(
  '/create',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  subscribersCity.createSubscribersCity,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  subscribersCity.updateSubscribersCity,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  subscribersCity.deleteSubscribersCity,
  log.addLog,
);
export default router;
