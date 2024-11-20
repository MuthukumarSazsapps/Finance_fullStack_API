import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import enumMaster from '../controllers/enumMaster.js';
import log from '../middleware/log.js';

const router = express.Router();

router.post('/create', authenticateMiddleware, enumMaster.createEnumMasterList, log.addLog);

export default router;
