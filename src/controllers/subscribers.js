import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import bcrypt from 'bcrypt';
import mssql from 'mssql';

const getAllSubscribers = async (req, res) => {
  try {
    const request = pool.request();
    const sqlQuery = 'SELECT * FROM Sazs_Vw_Subscribers';
    const result = await request.query(sqlQuery);
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

const getAllLogs = async (req, res) => {
  const { startDate, endDate, SubscriberId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('From', startDate)
      .input('To', endDate)
      .input('SubscriberId', SubscriberId)
      .execute('Sazs_Pr_LogView');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching subscribers', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createSubscriber = async (req, res, next) => {
  const {
    SubscriberName,
    ShortName,
    CompanyName,
    NoOfBranches,
    Email,
    MobileNo,
    LandLineNo,
    Address1,
    Address2,
    LandMark,
    CityId,
    Logo,
    GstNo,
    PointOfContact,
    UserName,
    Password,
    StartDate,
    EndDate,
    IsActive,
    CreatedBy,
  } = req.body;
  const logo = req.file?.filename;
  try {
    await transaction.begin();
    const hashedPassword = await bcrypt.hash(Password, 10);
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('SubscriberId', null)
      .input('SubscriberName', SubscriberName)
      .input('NoOfBranches', NoOfBranches)
      .input('ShortName', ShortName)
      .input('CompanyName', CompanyName)
      .input('Email', Email)
      .input('Role', 1)
      .input('CityId', CityId)
      .input('MobileNo', MobileNo)
      .input('LandLineNo', LandLineNo)
      .input('Address1', Address1)
      .input('Address2', Address2)
      .input('LandMark', LandMark)
      .input('GstNo', GstNo)
      .input('PointOfContact', PointOfContact)
      .input('StartDate', StartDate)
      .input('EndDate', EndDate)
      .input('CreatedBy', CreatedBy)
      .input('UserName', UserName)
      .input('Password', hashedPassword)
      .input('ModifiedBy', null)
      .input('Logo', logo)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Subscribers');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Subscriber';
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

const updateSubscriber = async (req, res, next) => {
  try {
    const logo = req.file?.filename;
    const SubscriberId = req.params.id;
    const {
      SubscriberName,
      ShortName,
      CompanyName,
      NoOfBranches,
      Email,
      Role,
      MobileNo,
      LandLineNo,
      Address1,
      Address2,
      LandMark,
      CityId,
      GstNo,
      PointOfContact,
      UserName,
      Password,
      StartDate,
      EndDate,
      IsActive,
      ModifiedBy,
      sendPassword,
    } = req.body;
    await transaction.begin();
    const hashedPassword = await bcrypt.hash(Password, 10);
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('SubscriberId', SubscriberId)
      .input('SubscriberName', SubscriberName)
      .input('NoOfBranches', NoOfBranches)
      .input('ShortName', ShortName)
      .input('CompanyName', CompanyName)
      .input('Email', Email)
      .input('Role', 1)
      .input('CityId', CityId)
      .input('MobileNo', MobileNo)
      .input('LandLineNo', LandLineNo)
      .input('Address1', Address1)
      .input('Address2', Address2)
      .input('LandMark', LandMark)
      .input('Logo', logo)
      .input('GstNo', GstNo)
      .input('PointOfContact', PointOfContact)
      .input('StartDate', StartDate)
      .input('EndDate', EndDate)
      .input('CreatedBy', null)
      .input('UserName', UserName)
      .input('Password', sendPassword === 'true' ? hashedPassword : null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .execute('Sazs_Pr_Subscribers');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Subscriber';
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

const removeSubscriber = async (req, res, next) => {
  const SubscriberId = req.params.id;
  const ModifiedBy = req.body.ModifiedBy;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', SubscriberId)
      .input('SubscriberName', null)
      .input('NoOfBranches', null)
      .input('ShortName', null)
      .input('CompanyName', null)
      .input('Email', null)
      .input('Role', null)
      .input('CityId', null)
      .input('MobileNo', null)
      .input('LandLineNo', null)
      .input('Address1', null)
      .input('Address2', null)
      .input('LandMark', null)
      .input('Logo', null)
      .input('GstNo', null)
      .input('PointOfContact', null)
      .input('StartDate', null)
      .input('EndDate', null)
      .input('CreatedBy', null)
      .input('UserName', null)
      .input('Password', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .execute('Sazs_Pr_Subscribers');
    await transaction.commit();
    req.resultMessage = 'Subscriber Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Subscriber';
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
  getAllSubscribers,
  getAllLogs,
  updateSubscriber,
  removeSubscriber,
  createSubscriber,
};
