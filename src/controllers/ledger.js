import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllLedger = async (req, res) => {
  const { SubscriberId, BranchId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 2)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('LedgerId', null)
      .input('LedgerName', null)
      .input('LedgerType', null)
      .input('BalanceAmount', null)
      .input('LedgerGroupId', null)
      .input('Description', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', null)
      .input('IsActive', null)
      .execute('Sazs_Pr_Ledger');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Ledgerss', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createLedger = async (req, res, next) => {
  const {
    SubscriberId,
    BranchId,
    LedgerGroupId,
    LedgerName,
    LedgerType,
    BalanceAmount,
    Description,
    CreatedBy,
    IsActive,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('LedgerId', null)
      .input('LedgerName', LedgerName)
      .input('LedgerType', LedgerType)
      .input('BalanceAmount', BalanceAmount)
      .input('LedgerGroupId', LedgerGroupId)
      .input('Description', Description)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Ledger');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Ledger';
    next();
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateLedger = async (req, res, next) => {
  const {
    LedgerGroupId,
    BranchId,
    LedgerName,
    LedgerType,
    BalanceAmount,
    Description,
    ModifiedBy,
    IsActive,
  } = req.body;
  const LedgerId = req.params.id;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('BranchId', BranchId)
      .input('LedgerId', LedgerId)
      .input('LedgerGroupId', LedgerGroupId)
      .input('LedgerName', LedgerName)
      .input('LedgerType', LedgerType)
      .input('BalanceAmount', BalanceAmount)
      .input('Description', Description)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Ledger');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Ledger';
    next();
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    responseHandler({
      req,
      res,
      data: { message: 'Ledger Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
const deleteLedger = async (req, res, next) => {
  const LedgerId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();

    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 4)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .input('LedgerId', LedgerId)
      .input('LedgerGroupId', null)
      .input('LedgerName', null)
      .input('LedgerType', null)
      .input('BalanceAmount', null)
      .input('Description', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .execute('Sazs_Pr_Ledger');
    await transaction.commit();
    req.resultMessage = 'Ledger Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Ledger';
    next();
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    responseHandler({
      req,
      res,
      data: { message: 'Ledger Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};

export default { createLedger, getAllLedger, updateLedger, deleteLedger };
