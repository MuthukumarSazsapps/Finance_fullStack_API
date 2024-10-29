import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import state from '../controllers/state.js';
import log from '../middleware/log.js';

const router = express.Router();
router.get('/list', authenticateMiddleware, state.getAllStates);
router.post(
  '/create',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  state.createState,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  state.updateState,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  state.deleteState,
  log.addLog,
);
export default router;
