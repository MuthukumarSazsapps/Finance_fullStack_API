import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool } from '../config/database.js';

export const getBranchCompoBox = async (req, res) => {
  const { SubscriberId, BranchId, PageName } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('RefId', null)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('PageName', PageName)
      .execute('Sazs_Pr_PageComboBox');
    responseHandler({ req, res, data: result.recordsets, httpCode: HttpStatusCode.OK });
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Menus', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getCustomerReport = async (req, res) => {
  const { LoanId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 1)
      .input('LoanId', LoanId)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .execute('SazsFinance_Pr_GetLoanDetails');
    responseHandler({ req, res, data: result.recordsets, httpCode: HttpStatusCode.OK });
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Menus', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
