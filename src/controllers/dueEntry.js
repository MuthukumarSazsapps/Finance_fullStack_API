import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllPendingDues = async (req, res) => {
  const { BranchId, SubscriberId } = req.body;
  try {
    if (BranchId && SubscriberId) {
      const request = pool.request();
      const result = await request
        .input('Flag', 3)
        .input('LoanId', null)
        .input('SubscriberId', SubscriberId)
        .input('BranchId', BranchId)
        .execute('SazsFinance_Pr_GetLoanDetails');
      responseHandler({
        req,
        res,
        data: result.recordset,
        httpCode: HttpStatusCode.OK,
      });
    }
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching VehicleType', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const getCurrentDue = async (req, res) => {
  const { LoanId } = req.body;
  try {
    if (LoanId) {
      const request = pool.request();
      const result = await request
        .input('Flag', 1)
        .input('LoanId', LoanId)
        .execute('SazsFinance_Pr_DueCalculation');
      responseHandler({ req, res, data: result.recordset[0], httpCode: HttpStatusCode.OK });
    }
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching VehicleType', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const dueEntry = async (req, res, next) => {
  const LoanId = req.params.id;
  const { Installment, PaidAmount, PaymentMethod, PaidLateFees, ModifiedBy, Remarks } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('LoanId', LoanId)
      .input('Installment', Installment)
      .input('PaidAmount', PaidAmount)
      .input('ReceiptDate', new Date())
      .input('PaidLateFees', PaidLateFees)
      .input('PaymentMethod', PaymentMethod)
      .input('ModifiedBy', ModifiedBy)
      .input('Remarks', Remarks)
      .execute('SazsFinance_Pr_DueEntry');
    await transaction.commit();
    req.resultMessage = 'Due Paid Successfully';
    req.Event = 'Update';
    req.ApiCall = 'Due Entry';
    next();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { error: 'An error occurred' },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const dueDelete = async (req, res, next) => {
  const { LoanId, Installment } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('LoanId', LoanId)
      .input('Installment', Installment)
      .input('PaidAmount', null)
      .input('PaidLateFees', null)
      .input('ReceiptDate', null)
      .input('PaymentMethod', null)
      .input('ModifiedBy', null)
      .input('Remarks', null)
      .execute('SazsFinance_Pr_DueEntry');
    await transaction.commit();
    req.resultMessage = 'Due Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Due Entry';
    next();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    responseHandler({
      req,
      res,
      data: { error: 'An error occurred' },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
export default {
  getAllPendingDues,
  getCurrentDue,
  dueEntry,
  dueDelete,
};
