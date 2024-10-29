import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllStates = async (req, res) => {
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 4)
      .input('StateId', null)
      .input('StateName', null)
      .input('StateCode', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', null)
      .input('IsActive', null)
      .execute('Sazs_Pr_State_Master');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching States', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createState = async (req, res, next) => {
  const { StateCode, StateName, CreatedBy, IsActive } = req.body;
  try {
    if (StateName && StateCode && CreatedBy) {
      await transaction.begin();
      const request = new mssql.Request(transaction);
      const result = await request
        .input('Flag', 1)
        .input('StateId', null)
        .input('StateName', StateName)
        .input('StateCode', StateCode)
        .input('CreatedBy', CreatedBy)
        .input('ModifiedBy', null)
        .input('IsActive', IsActive)
        .execute('Sazs_Pr_State_Master');
      await transaction.commit();
      req.resultMessage = result.recordset[0].message;
      req.Event = 'Create';
      req.ApiCall = 'State';
      next();
    } else {
      await transaction.rollback();
      responseHandler({
        req,
        res,
        data: { message: 'State information is incorrect.' },
        httpCode: HttpStatusCode.OK,
      });
    }
  } catch (err) {
    console.error('Error inserting data:', err);
    responseHandler({
      req,
      res,
      data: { message: 'Internal Server Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
const updateState = async (req, res, next) => {
  const { StateCode, StateName, ModifiedBy, IsActive } = req.body;
  const StateId = req.params.id;
  try {
    if (StateId && IsActive && StateCode && StateName && ModifiedBy) {
      await transaction.begin();
      const request = new mssql.Request(transaction);
      const result = await request
        .input('Flag', 2)
        .input('StateId', StateId)
        .input('StateName', StateName)
        .input('StateCode', StateCode)
        .input('CreatedBy', null)
        .input('ModifiedBy', ModifiedBy)
        .input('IsActive', IsActive)
        .execute('Sazs_Pr_State_Master');
      await transaction.commit();
      req.resultMessage = result.recordset[0].message;
      req.Event = 'Update';
      req.ApiCall = 'State';
      next();
    } else {
      await transaction.rollback();
      responseHandler({
        req,
        res,
        data: { message: 'Internal Server Error' },
        httpCode: HttpStatusCode.OK,
      });
    }
  } catch (err) {
    console.error('Error inserting data:', err);
    responseHandler({
      req,
      res,
      data: { message: 'Internal Server Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
const deleteState = async (req, res, next) => {
  const StateId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    if (StateId && ModifiedBy) {
      const request = pool.request();
      const result = await request
        .input('Flag', 3)
        .input('StateId', StateId)
        .input('StateName', null)
        .input('StateCode', null)
        .input('CreatedBy', null)
        .input('ModifiedBy', ModifiedBy)
        .input('IsActive', null)
        .execute('Sazs_Pr_State_Master');
      req.resultMessage = 'State Deleted Successfully';
      req.Event = 'Delete';
      req.ApiCall = 'State';
      next();
    } else {
      responseHandler({
        req,
        res,
        data: { message: 'Network Error' },
        httpCode: HttpStatusCode.OK,
      });
    }
  } catch (err) {
    console.error('Error inserting data:', err);
    responseHandler({
      req,
      res,
      data: { message: 'Internal Server Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
export default { createState, updateState, deleteState, getAllStates };
