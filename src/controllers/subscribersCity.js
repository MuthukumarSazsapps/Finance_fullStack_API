import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllSubscribersCities = async (req, res) => {
  const { SubscriberId, BranchId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 4)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('StateId', null)
      .input('CityName', null)
      .input('Pincode', null)
      .input('CityId', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', null)
      .input('IsActive', null)
      .execute('Sazs_Pr_Subscriber_CityMaster');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching SubscribersCities', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createSubscribersCity = async (req, res, next) => {
  const { SubscriberId, BranchId, StateId, CityName, Pincode, IsActive, CreatedBy } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('StateId', StateId)
      .input('CityName', CityName)
      .input('Pincode', Pincode)
      .input('CityId', null)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Subscriber_CityMaster');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Subscriber City';
    next();
  } catch (error) {
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { message: 'City Already Exists' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
const updateSubscribersCity = async (req, res, next) => {
  const { StateId, BranchId, CityName, ModifiedBy, IsActive, Pincode, SubscriberId } = req.body;
  const CityId = req.params.id;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('CityId', CityId)
      .input('SubscriberId', SubscriberId)
      .input('StateId', StateId)
      .input('BranchId', BranchId)
      .input('Pincode', Pincode)
      .input('CityName', CityName)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Subscriber_CityMaster');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Subscriber City';
    next();
  } catch (error) {
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { message: 'City information is incorrect.' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
const deleteSubscribersCity = async (req, res, next) => {
  const CityId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();
    if (CityId && ModifiedBy) {
      const request = new mssql.Request(transaction);
      const result = await request
        .input('Flag', 3)
        .input('StateId', null)
        .input('Pincode', null)
        .input('CityName', null)
        .input('BranchId', null)
        .input('SubscriberId', null)
        .input('CityId', CityId)
        .input('CreatedBy', null)
        .input('ModifiedBy', ModifiedBy)
        .input('IsActive', null)
        .execute('Sazs_Pr_Subscriber_CityMaster');
      await transaction.commit();
      req.resultMessage = 'City Deleted Successfully';
      req.Event = 'Delete';
      req.ApiCall = 'Subscriber City';
      next();
    } else {
      responseHandler({
        req,
        res,
        data: { message: 'Network Error' },
        httpCode: HttpStatusCode.OK,
      });
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
  getAllSubscribersCities,
  createSubscribersCity,
  updateSubscribersCity,
  deleteSubscribersCity,
};
