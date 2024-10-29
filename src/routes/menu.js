import express from 'express';
import menu from '../controllers/menu.js';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import menuValidation from '../utils/validations/menuValidation.js';
import log from '../middleware/log.js';

const router = express.Router();
router.post('/user-menu-list', authenticateMiddleware, menu.getUserMenus);
router.post('/list', authenticateMiddleware, menu.getAllMenus, menu.getUserMenus);
router.post(
  '/create',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  // menuValidation,
  menu.createMenu,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  // menuValidation,
  menu.updateMenu,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  menu.removeMenu,
  log.addLog,
);
router.post(
  '/import',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  // menuValidation,
  menu.ImportMenu,
);
export default router;
