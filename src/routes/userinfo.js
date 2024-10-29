import express from 'express';
import userinfo from '../controllers/userinfo.js';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';

const router = express.Router();
router.post('/details', authenticateMiddleware, userinfo.userinfo); // Add a jwt and data validation
export default router;
