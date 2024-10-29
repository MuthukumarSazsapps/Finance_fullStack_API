import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import showRoom from '../controllers/showRoom.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post(
  '/list',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  showRoom.getAllShowRooms,
);
router.post(
  '/create',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  showRoom.createShowRoom,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  showRoom.updateShowRoom,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  showRoom.removeShowRoom,
  log.addLog,
);

export default router;
