import express from 'express';
import { getBranchCompoBox, getCustomerReport } from '../controllers/pageCompoBox.js';
import authenticateMiddleware from '../middleware/authenticate.js';

const router = express.Router();
router.post('/branches', authenticateMiddleware, getBranchCompoBox);
router.post('/report', authenticateMiddleware, getCustomerReport); // Add a jwt and data validation

export default router;
