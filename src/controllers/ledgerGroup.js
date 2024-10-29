import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const createLedgerGroup = async (req, res, next) => {
  const { SubscriberId, BranchId, LedgerGroupName, Description, CreatedBy, IsActive } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('LedgerGroupId', null)
      .input('LedgerGroupName', LedgerGroupName)
      .input('Description', Description)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_LedgerGroup');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'LedgerGroup';
    next();
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    responseHandler({
      req,
      res,
      data: { message: 'LedgerGroup Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};

const updateLedgerGroup = async (req, res, next) => {
  const { LedgerGroupName, BranchId, Description, ModifiedBy, IsActive } = req.body;
  const LedgerGroupId = req.params.id;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('BranchId', BranchId)
      .input('LedgerGroupId', LedgerGroupId)
      .input('LedgerGroupName', LedgerGroupName)
      .input('Description', Description)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_LedgerGroup');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'LedgerGroup';
    next();
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    responseHandler({
      req,
      res,
      data: { message: 'LedgerGroup Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
const deleteLedgerGroup = async (req, res, next) => {
  const LedgerGroupId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();
    if (LedgerGroupId && ModifiedBy) {
      const request = new mssql.Request(transaction);
      const result = await request
        .input('Flag', 4)
        .input('SubscriberId', null)
        .input('BranchId', null)
        .input('LedgerGroupId', LedgerGroupId)
        .input('LedgerGroupName', null)
        .input('Description', null)
        .input('CreatedBy', null)
        .input('ModifiedBy', ModifiedBy)
        .input('IsActive', null)
        .execute('Sazs_Pr_LedgerGroup');
      await transaction.commit();
      req.resultMessage = 'LedgerGroup Deleted Successfully';
      req.Event = 'Delete';
      req.ApiCall = 'LedgerGroup';
      next();
    } else {
      responseHandler({
        req,
        res,
        data: { message: 'LedgerGroup Error' },
        httpCode: HttpStatusCode.OK,
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    responseHandler({
      req,
      res,
      data: { message: 'LedgerGroup Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};

export default { createLedgerGroup, updateLedgerGroup, deleteLedgerGroup };
