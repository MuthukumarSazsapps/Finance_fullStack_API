import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import city from '../controllers/city.js';
import log from '../middleware/log.js';

const router = express.Router();
router.get('/list', authenticateMiddleware, city.getAllCities);
router.post(
  '/create',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  city.createCity,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  city.updateCity,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  minimumPermissionLevelRequired('Admin'),
  city.deleteCity,
  log.addLog,
);
export default router;
