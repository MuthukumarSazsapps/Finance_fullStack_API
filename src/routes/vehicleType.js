import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import vehicleType from '../controllers/vehicleType.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post(
  '/list',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  vehicleType.getAllVehicleTypes,
);
router.post(
  '/create',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  // subscriberValidation,
  vehicleType.createVehicleType,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  vehicleType.updateVehicleType,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  vehicleType.removeVehicleType,
  log.addLog,
);
export default router;
