import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllShowRooms = async (req, res) => {
  const { BranchId, SubscriberId } = req.body;
  try {
    if (BranchId) {
      const request = pool.request();
      const result = await request
        .input('Flag', 4)
        .input('SubscriberId', SubscriberId)
        .input('BranchId', BranchId)
        .input('ShowRoomId', null)
        .input('ShowRoomName', null)
        .input('ShowRoomPhoneNumber', null)
        .input('AccountHolderName', null)
        .input('AccountNumber', null)
        .input('BranchName', null)
        .input('IFSCcode', null)
        .input('CityId', null)
        .input('CreatedBy', null)
        .input('ModifiedBy', null)
        .input('IsActive', null)
        .execute('SazsFinance_Pr_ShowRoom');
      responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
    }
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Agent', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const createShowRoom = async (req, res, next) => {
  const {
    SubscriberId,
    BranchId,
    CityId,
    ShowRoomName,
    ShowRoomPhoneNumber,
    CreatedBy,
    IsActive,
    AccountHolderName,
    AccountNumber,
    IFSCcode,
    BranchName,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('ShowRoomId', null)
      .input('CityId', CityId)
      .input('ShowRoomName', ShowRoomName)
      .input('ShowRoomPhoneNumber', ShowRoomPhoneNumber)
      .input('AccountHolderName', AccountHolderName)
      .input('AccountNumber', AccountNumber)
      .input('BranchName', BranchName)
      .input('IFSCcode', IFSCcode)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .execute('SazsFinance_Pr_ShowRoom');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'ShowRoom';
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

const updateShowRoom = async (req, res, next) => {
  const ShowRoomId = req.params.id;
  const {
    BranchId,
    CityId,
    ShowRoomName,
    ShowRoomPhoneNumber,
    ModifiedBy,
    IsActive,
    AccountHolderName,
    AccountNumber,
    IFSCcode,
    BranchName,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('SubscriberId', null)
      .input('ShowRoomId', ShowRoomId)
      .input('BranchId', BranchId)
      .input('CityId', CityId)
      .input('ShowRoomName', ShowRoomName)
      .input('ShowRoomPhoneNumber', ShowRoomPhoneNumber)
      .input('AccountHolderName', AccountHolderName)
      .input('AccountNumber', AccountNumber)
      .input('BranchName', BranchName)
      .input('IFSCcode', IFSCcode)
      .input('ModifiedBy', ModifiedBy)
      .input('CreatedBy', null)
      .input('IsActive', IsActive)
      .execute('SazsFinance_Pr_ShowRoom');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'ShowRoom';
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

const removeShowRoom = async (req, res, next) => {
  const ShowRoomId = req.params.id;
  const ModifiedBy = req.body.ModifiedBy;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .input('CityId', null)
      .input('ShowRoomId', ShowRoomId)
      .input('ShowRoomName', null)
      .input('ShowRoomPhoneNumber', null)
      .input('AccountHolderName', null)
      .input('AccountNumber', null)
      .input('BranchName', null)
      .input('IFSCcode', null)
      .input('ModifiedBy', ModifiedBy)
      .input('CreatedBy', null)
      .input('IsActive', null)
      .execute('SazsFinance_Pr_ShowRoom');
    await transaction.commit();
    req.resultMessage = 'ShowRoom Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'ShowRoom';
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

export default {
  getAllShowRooms,
  updateShowRoom,
  removeShowRoom,
  createShowRoom,
};
