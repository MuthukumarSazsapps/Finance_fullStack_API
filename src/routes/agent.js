import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import agent from '../controllers/agent.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post(
  '/list',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  agent.getAllAgents,
);
router.post(
  '/create',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  agent.createAgent,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  agent.updateAgent,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  agent.removeAgent,
  log.addLog,
);
export default router;
