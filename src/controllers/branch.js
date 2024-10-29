import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllBranches = async (req, res) => {
  const { SubscriberId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 4)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', null)
      .input('BranchName', null)
      .input('CityId', null)
      .input('MobileNo', null)
      .input('LandLineNo', null)
      .input('Address1', null)
      .input('Address2', null)
      .input('LandMark', null)
      .input('GstNo', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', null)
      .input('IsActive', null)
      .execute('Sazs_Pr_Branches');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching subscribers', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createBranch = async (req, res, next) => {
  const {
    BranchName,
    MobileNo,
    LandLineNo,
    Address1,
    Address2,
    LandMark,
    CityId,
    GstNo,
    IsActive,
    SubscriberId,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', null)
      .input('BranchName', BranchName)
      .input('CityId', CityId)
      .input('MobileNo', MobileNo)
      .input('LandLineNo', LandLineNo)
      .input('Address1', Address1)
      .input('Address2', Address2)
      .input('LandMark', LandMark)
      .input('GstNo', GstNo)
      .input('CreatedBy', SubscriberId)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Branches');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Branch';
    next();
  } catch (error) {
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { error: 'An error occurred' },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateBranch = async (req, res, next) => {
  const BranchId = req.params.id;
  const {
    BranchName,
    MobileNo,
    LandLineNo,
    Address1,
    Address2,
    LandMark,
    CityId,
    GstNo,
    IsActive,
    SubscriberId,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('BranchName', BranchName)
      .input('CityId', CityId)
      .input('MobileNo', MobileNo)
      .input('LandLineNo', LandLineNo)
      .input('Address1', Address1)
      .input('Address2', Address2)
      .input('LandMark', LandMark)
      .input('GstNo', GstNo)
      .input('CreatedBy', null)
      .input('ModifiedBy', SubscriberId)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Branches');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Branch';
    next();
  } catch (error) {
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { error: 'An error occurred' },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const removeBranch = async (req, res, next) => {
  const BranchId = req.params.id;
  const ModifiedBy = req.body.ModifiedBy;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('BranchId', BranchId)
      .input('BranchName', null)
      .input('CityId', null)
      .input('MobileNo', null)
      .input('LandLineNo', null)
      .input('Address1', null)
      .input('Address2', null)
      .input('LandMark', null)
      .input('GstNo', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .execute('Sazs_Pr_Branches');
    await transaction.commit();
    req.resultMessage = 'Branch Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Branch';
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

export default {
  getAllBranches,
  createBranch,
  removeBranch,
  updateBranch,
};
