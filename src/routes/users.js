import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import users from '../controllers/users.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post(
  '/list',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  users.getAllUsers,
);
router.post(
  '/create',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  users.createUser,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  users.updateUser,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Subscriber'),
  users.removeUser,
  log.addLog,
);
export default router;
