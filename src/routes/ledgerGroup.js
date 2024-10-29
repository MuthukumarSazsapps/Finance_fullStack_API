import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import ledgerGroup from '../controllers/ledgerGroup.js';
import log from '../middleware/log.js';

const router = express.Router();
// router.get('/list', authenticateMiddleware, city.getAllCities);
router.post(
  '/create',
  authenticateMiddleware,
  // minimumPermissionLevelRequired('Admin'),
  ledgerGroup.createLedgerGroup,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  // minimumPermissionLevelRequired('Admin'),
  ledgerGroup.updateLedgerGroup,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  // minimumPermissionLevelRequired('Admin'),
  ledgerGroup.deleteLedgerGroup,
  log.addLog,
);

export default router;
