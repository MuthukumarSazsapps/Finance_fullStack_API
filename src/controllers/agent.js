import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllAgents = async (req, res) => {
  const { BranchId, SubscriberId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 4)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('AgentId', null)
      .input('CityId', null)
      .input('AgentName', null)
      .input('AgentPhoneNumber', null)
      .input('ModifiedBy', null)
      .input('IsActive', null)
      .input('CreatedBy', null)
      .execute('SazsFinance_Pr_Agent');
    responseHandler({
      req,
      res,
      data: result.recordset,
      httpCode: HttpStatusCode.CREATED,
    });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Agent', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const createAgent = async (req, res, next) => {
  const { SubscriberId, CreatedBy, CityId, BranchId, AgentName, AgentPhoneNumber, IsActive } =
    req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('AgentId', null)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('CityId', CityId)
      .input('AgentName', AgentName)
      .input('AgentPhoneNumber', AgentPhoneNumber)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .execute('SazsFinance_Pr_Agent');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Agent';
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

const updateAgent = async (req, res, next) => {
  const AgentId = req.params.id;
  const { BranchId, AgentName, CityId, AgentPhoneNumber, ModifiedBy, IsActive } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('SubscriberId', null)
      .input('BranchId', BranchId)
      .input('AgentId', AgentId)
      .input('CityId', CityId)
      .input('AgentName', AgentName)
      .input('AgentPhoneNumber', AgentPhoneNumber)
      .input('ModifiedBy', ModifiedBy)
      .input('CreatedBy', null)
      .input('IsActive', IsActive)
      .execute('SazsFinance_Pr_Agent');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Agent';
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

const removeAgent = async (req, res, next) => {
  const AgentId = req.params.id;
  const ModifiedBy = req.body.ModifiedBy;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .input('AgentId', AgentId)
      .input('CityId', null)
      .input('AgentName', null)
      .input('AgentPhoneNumber', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .execute('SazsFinance_Pr_Agent');
    await transaction.commit();
    req.resultMessage = 'Agent Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Agent';
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
  getAllAgents,
  updateAgent,
  removeAgent,
  createAgent,
};
