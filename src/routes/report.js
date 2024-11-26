import express from 'express';
import report from '../controllers/report.js';
import authenticateMiddleware from '../middleware/authenticate.js';
import log from '../middleware/log.js';

const router = express.Router();

router.post('/pendingReport', authenticateMiddleware, report.getPendingReport);
router.post('/pendingCapitalReport', authenticateMiddleware, report.getPendingCapitalReport);
router.post('/documents', authenticateMiddleware, report.PendingDocuments);
router.post('/doc-update', authenticateMiddleware, report.PendingDocsUpdate, log.addLog);
router.put(
  '/update/PendingReport',
  authenticateMiddleware,
  report.PendingRemarksUpdate,
  log.addLog,
);
router.post('/defaultreport', authenticateMiddleware, report.getDefaultReport);

export default router;
