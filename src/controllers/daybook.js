import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getDayReport = async (req, res) => {
  const { SubscriberId, BranchId, startDate, endDate } = req.body;
  try {
    if (BranchId && SubscriberId) {
      const request = pool.request();
      const result = await request
        .input('Flag', 1)
        .input('SubscriberId', SubscriberId)
        .input('BranchId', BranchId)
        .input('StartDate', startDate)
        .input('EndDate', endDate)
        .execute('dbo.SazsFinance_Pr_Daybook');
      responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
    }
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Cities', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const loanDisburse = async (req, res, next) => {
  const { LoanId, ByLedgerCode, PayAmount, PaymentDate, Particulars, Remarks, CreatedBy } =
    req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('LoanId', LoanId)
      .input('IssueDate', PaymentDate)
      .input('ByLedgerCode', ByLedgerCode)
      .input('Amount', PayAmount)
      .input('Particulars', Particulars)
      .input('Remarks', Remarks)
      .input('CreatedBy', CreatedBy)
      .execute('dbo.SazsFinance_Pr_LedgerEntry');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Loan Disburse';
    req.ApiCall = 'LedgerEntry';
    next();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Cities', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export default {
  getDayReport,
  loanDisburse,
};
