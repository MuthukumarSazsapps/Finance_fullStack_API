import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllVehicleTypes = async (req, res) => {
  const { BranchId, SubscriberId } = req.body;
  try {
    if (BranchId && SubscriberId) {
      const request = pool.request();
      const result = await request
        .input('Flag', 4)
        .input('VehicleTypeId', null)
        .input('SubscriberId', SubscriberId)
        .input('BranchId', BranchId)
        .input('VehicleType', null)
        .input('Brand', null)
        .input('Variant', null)
        .input('VehicleName', null)
        .input('CreatedBy', null)
        .input('ModifiedBy', null)
        .input('IsActive', null)
        .input('WheelBase', null)
        .execute('SazsFinance_Pr_VehicleType');
      responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
    }
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching VehicleType', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const createVehicleType = async (req, res, next) => {
  const {
    SubscriberId,
    BranchId,
    Brand,
    VehicleName,
    VehicleType,
    WheelBase,
    Variant,
    CreatedBy,
    IsActive,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('VehicleTypeId', null)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('VehicleType', VehicleType)
      .input('Brand', Brand)
      .input('Variant', Variant)
      .input('VehicleName', VehicleName)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .input('WheelBase', WheelBase)
      .execute('SazsFinance_Pr_VehicleType');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Vehicle';
    next();
  } catch (error) {
    await transaction.rollback();
    if (error.code === 'EREQUEST') {
      responseHandler({
        req,
        res,
        data: { error: 'An error occurred' },
        httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const updateVehicleType = async (req, res, next) => {
  const VehicleTypeId = req.params.id;
  const {
    SubscriberId,
    BranchId,
    Brand,
    VehicleName,
    VehicleType,
    WheelBase,
    Variant,
    ModifiedBy,
    IsActive,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('VehicleTypeId', VehicleTypeId)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('VehicleType', VehicleType)
      .input('Brand', Brand)
      .input('Variant', Variant)
      .input('VehicleName', VehicleName)
      .input('CreatedBy', null)
      .input('WheelBase', WheelBase)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .execute('SazsFinance_Pr_VehicleType');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Vehicle';
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

const removeVehicleType = async (req, res, next) => {
  const VehicleTypeId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('VehicleTypeId', VehicleTypeId)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .input('VehicleType', null)
      .input('Brand', null)
      .input('Variant', null)
      .input('VehicleName', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .input('WheelBase', null)
      .execute('SazsFinance_Pr_VehicleType');
    await transaction.commit();
    req.resultMessage = 'Vehicle Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Vehicle';
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
  getAllVehicleTypes,
  createVehicleType,
  updateVehicleType,
  removeVehicleType,
};
