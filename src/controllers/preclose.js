import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getPrecloseAmount = async (req, res) => {
  const { LoanId, Interest } = req.body;
  try {
    if (LoanId) {
      const request = pool.request();
      const result = await request
        .input('LoanId', LoanId)
        .input('Interest', Interest)
        .execute('SazsFinance_LoanPreclose_Calculation');
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

const precloseLoan = async (req, res, next) => {
  const { LoanId, PendingCapital, Remarks, ModifiedBy, PrecloseAmount, PaymentMethod, PaidAmount } =
    req.body;
  try {
    if (LoanId) {
      await transaction.begin();
      const request = new mssql.Request(transaction);
      const result = await request
        .input('LoanId', LoanId)
        .input('PendingCapital', PendingCapital)
        .input('PrecloseAmount', PrecloseAmount)
        .input('PaidAmount', PaidAmount)
        .input('PaymentMethod', PaymentMethod)
        .input('Remarks', Remarks)
        .input('ModifiedBy', ModifiedBy)
        .execute('SazsFinance_LoanPreclose');
      await transaction.commit();

      req.resultMessage = 'Loan Closed Successfully';
      req.Event = 'Update';
      req.ApiCall = 'Loan Preclose';
      next();
    }
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching VehicleType', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
export default {
  getPrecloseAmount,
  precloseLoan,
};
