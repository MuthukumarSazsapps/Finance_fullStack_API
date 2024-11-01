import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import upload from '../controllers/upload.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import customer from '../controllers/customer.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post(
  '/get',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  customer.getCustomer,
);
router.post(
  '/list',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  customer.getAllCustomers,
);
router.post(
  '/create',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  // subscriberValidation,
  upload.uploadSingle('CustomerPhotoURL', '../uploads/customer'),
  customer.createCustomer,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  upload.uploadSingle('CustomerPhotoURL', '../uploads/customer'),
  customer.updateCustomer,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  customer.removeCustomer,
  log.addLog,
);
export default router;
