import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getPendingReport = async (req, res) => {
  const { SubscriberId, BranchId } = req.body;
  try {
    const result = await pool
      .request()
      .input('Flag', 1)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('LoanId', null)
      .input('Installment', null)
      .input('Remarks', null)
      .execute('SazsFinance_Pr_Report');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Pending Records', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const getDefaultReport = async (req, res) => {
  const { SubscriberId, BranchId } = req.body;
  try {
    const result = await pool
      .request()
      .input('Flag', 4)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('LoanId', null)
      .input('Installment', null)
      .input('Remarks', null)
      .execute('SazsFinance_Pr_Report');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Pending Records', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const PendingDocuments = async (req, res) => {
  const { BranchId, SubscriberId } = req.body;
  try {
    if (BranchId && SubscriberId) {
      const request = pool.request();
      const result = await request
        .input('Flag', 4)
        .input('LoanId', null)
        .input('SubscriberId', SubscriberId)
        .input('BranchId', BranchId)
        .execute('SazsFinance_Pr_GetLoanDetails');
      responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
    }
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Internal Server Error', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const PendingDocsUpdate = async (req, res, next) => {
  const { LoanId, OriginalRC, DuplicateKey, Insurance, ModifiedBy } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('LoanId', LoanId)
      .input('OriginalRC', OriginalRC)
      .input('DuplicateKey', DuplicateKey)
      .input('Insurance', Insurance)
      .input('ModifiedBy', ModifiedBy)
      .execute('SazsFinance_Pr_DocumentUpdate');
    await transaction.commit();
    req.resultMessage = 'Pending Docs updated Successfully';
    req.Event = 'Update';
    req.ApiCall = 'Pending Docs';
    next();
  } catch (error) {
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { message: 'Internal Server Error', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const PendingRemarksUpdate = async (req, res, next) => {
  const {
    LoanId,
    MaxInstallment,
    obj: { Remarks },
  } = req.body;

  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .input('LoanId', LoanId)
      .input('Installment', MaxInstallment)
      .input('Remarks', Remarks)
      .execute('SazsFinance_Pr_PendingReport');
    await transaction.commit();
    req.resultMessage = 'Pending Remarks updated Successfully';
    req.Event = 'Update';
    req.ApiCall = 'Pending Remarks';
    next();
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    responseHandler({
      req,
      res,
      data: { message: 'Internal Server Error', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export default {
  getPendingReport,
  PendingRemarksUpdate,
  PendingDocsUpdate,
  PendingDocuments,
  getDefaultReport,
};
