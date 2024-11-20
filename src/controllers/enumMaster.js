import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';
import login from './login.js';

const createEnumMasterList = async (req, res, next) => {
  console.log(req.body);

  const { SubscriberId, BranchId, FlagType, TypeName, CreatedBy } = req.body;
  try {
    if (SubscriberId && BranchId && FlagType && TypeName && CreatedBy) {
      await transaction.begin();
      const request = new mssql.Request(transaction);
      const result = await request
        .input('Flag', 1)
        .input('SubscriberId', SubscriberId)
        .input('BranchId', BranchId)
        .input('ConfigName', FlagType)
        .input('EnumName', TypeName)
        .input('CreatedBy', CreatedBy)
        .input('IsActive', null)
        .execute('Sazs_Pr_EnumMaster');
      await transaction.commit();
      req.resultMessage = result.recordset[0].message;
      req.Event = 'Create';
      req.ApiCall = 'enumMasterList';
      next();
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Error inserting data:', error);
    responseHandler({
      req,
      res,
      data: { message: 'Network Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};

export default {
  createEnumMasterList,
};
