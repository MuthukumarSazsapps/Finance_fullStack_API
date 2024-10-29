import express from 'express';
import authenticateMiddleware from '../middleware/authenticate.js';
import minimumPermissionLevelRequired from '../middleware/permissionLevel.js';
import loan from '../controllers/loan.js';
import due from '../controllers/dueEntry.js';
import log from '../middleware/log.js';
import preclose from '../controllers/preclose.js';
import daybook from '../controllers/daybook.js';

const router = express.Router();
router.post(
  '/list',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  loan.getAllLoans,
);
router.post(
  '/create',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  loan.createLoan,
  log.addLog,
);
router.put(
  '/update/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  loan.updateLoan,
  log.addLog,
);
router.post(
  '/currentdue',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  due.getCurrentDue,
);
router.post(
  '/due-entry/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  due.dueEntry,
  log.addLog,
);
router.post(
  '/due-delete',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  due.dueDelete,
  log.addLog,
);
router.post(
  '/pending-dues',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  due.getAllPendingDues,
);
router.post(
  '/preclose/calculation',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  preclose.getPrecloseAmount,
);
router.post(
  '/day-report',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  daybook.getDayReport,
);
router.post(
  '/disburse',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  daybook.loanDisburse,
  log.addLog,
);
router.post(
  '/preclose',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  preclose.precloseLoan,
  log.addLog,
);
router.delete(
  '/remove/:id',
  authenticateMiddleware,
  //minimumPermissionLevelRequired('Admin'),
  loan.removeLoan,
  log.addLog,
);
export default router;
