import express from 'express';
import branch from '../controllers/branch.js';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post(
  '/list',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  branch.getAllBranches,
);
router.post(
  '/create',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  branch.createBranch,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  branch.updateBranch,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  branch.removeBranch,
  log.addLog,
);
export default router;
