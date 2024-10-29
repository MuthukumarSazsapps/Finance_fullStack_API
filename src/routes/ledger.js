import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import ledger from '../controllers/ledger.js';
import log from '../middleware/log.js';

const router = express.Router();

// router.get('/list', authenticateMiddleware, city.getAllCities);
router.post(
  '/create',
  authenticateMiddleware,
  // minimumPermissionLevelRequired('Admin'),
  ledger.createLedger,
  log.addLog,
);
router.post(
  '/list',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  ledger.getAllLedger,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  // minimumPermissionLevelRequired('Admin'),
  ledger.updateLedger,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  // minimumPermissionLevelRequired('Admin'),
  ledger.deleteLedger,
  log.addLog,
);
export default router;
