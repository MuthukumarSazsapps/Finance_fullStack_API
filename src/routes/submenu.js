import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import subMenuValidation from '../utils/validations/subMenuValidation.js';
import submenu from '../controllers/submenu.js';
import log from '../middleware/log.js';

const router = express.Router();
router.get('/list', authenticateMiddleware, submenu.getAllSubMenus);
router.post(
  '/create',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  // subMenuValidation,
  submenu.createSubMenu,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  // subMenuValidation,
  submenu.updateSubMenu,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  submenu.removeSubMenu,
  log.addLog,
);
export default router;
