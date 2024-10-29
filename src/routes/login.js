import express from 'express';
import login from '../controllers/login.js';
const router = express.Router();

router.post('/login', login.login); // Add a jwt and data validation]
router.post('/refresh-token', login.refTokenLogin);
export default router;
