import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllLoans = async (req, res) => {
  const { BranchId, SubscriberId } = req.body;
  try {
    if (BranchId && SubscriberId) {
      const request = pool.request();
      const result = await request
        .input('Flag', 2)
        .input('LoanId', null)
        .input('SubscriberId', SubscriberId)
        .input('BranchId', BranchId)
        .execute('SazsFinance_Pr_GetLoanDetails');
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

const createLoan = async (req, res, next) => {
  const {
    PermitDate,
    OriginalRC,
    DuplicateKey,
    Insurance,
    LoanNo,
    LoanType,
    Endosement,
    OtherDocument,
    LoanAmount,
    Interest,
    FCDate,
    Tenure,
    CalculatedEmiAmount,
    ActualEmiAmount,
    PrincipalAmount,
    InterestAmount,
    VehicleTypeId,
    LoanStartDate,
    CustomerId,
    DocumentCharges,
    LoanEndDate,
    AgentId,
    AgentCommission,
    SubscriberId,
    RegisterNumber,
    ShowRoomId,
    MadeYear,
    InsuranceDate,
    BranchId,
    CreatedBy,
    IsActive,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('LoanId', null)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('LoanNo', LoanNo)
      .input('LoanType', LoanType)
      .input('VehicleTypeId', VehicleTypeId)
      .input('CustomerId', CustomerId)
      .input('RegisterNumber', RegisterNumber)
      .input('ShowRoomId', ShowRoomId)
      .input('MadeYear', MadeYear)
      .input('InsuranceDate', InsuranceDate ? new Date(InsuranceDate) : null)
      .input('FCDate', new Date(FCDate))
      .input('PermitDate', new Date(PermitDate))
      .input('OriginalRC', OriginalRC)
      .input('DuplicateKey', DuplicateKey)
      .input('Insurance', Insurance)
      .input('Endosement', Endosement)
      .input('OtherDocument', OtherDocument)
      .input('DocumentCharges', DocumentCharges)
      .input('LoanAmount', LoanAmount)
      .input('Interest', Interest)
      .input('Tenure', Tenure)
      .input('CalculatedEmiAmount', CalculatedEmiAmount)
      .input('ActualEmiAmount', ActualEmiAmount)
      .input('PrincipalAmount', PrincipalAmount)
      .input('InterestAmount', InterestAmount)
      .input('LoanStartDate', new Date(LoanStartDate))
      .input('LoanEndDate', new Date(LoanEndDate))
      .input('AgentId', AgentId)
      .input('AgentCommission', AgentCommission)
      .input('VehicleDocsURL', null)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .execute('SazsFinance_Pr_LoanDetails');
    await transaction.commit();
    req.resultMessage = 'Loan created Successfully';
    req.Event = 'Create';
    req.ApiCall = 'Loan';
    next();
  } catch (error) {
    console.log('error', error);
    await transaction.rollback();
    if (error.code === 'EREQUEST') {
      responseHandler({
        req,
        res,
        data: { error: error },
        httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const updateLoan = async (req, res, next) => {
  const LoanId = req.params.id;
  const {
    PermitDate,
    OriginalRC,
    DuplicateKey,
    Insurance,
    LoanNo,
    Endosement,
    OtherDocument,
    LoanAmount,
    Interest,
    FCDate,
    Tenure,
    DocumentCharges,
    CalculatedEmiAmount,
    ActualEmiAmount,
    PrincipalAmount,
    InterestAmount,
    VehicleTypeId,
    LoanStartDate,
    CustomerId,
    LoanEndDate,
    AgentId,
    AgentCommission,
    ModifiedBy,
    RegisterNumber,
    ShowRoomId,
    MadeYear,
    InsuranceDate,
    BranchId,
    IsActive,
  } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('LoanId', LoanId)
      .input('SubscriberId', null)
      .input('BranchId', BranchId)
      .input('LoanType', null)
      .input('LoanNo', LoanNo)
      .input('VehicleTypeId', VehicleTypeId)
      .input('CustomerId', CustomerId)
      .input('RegisterNumber', RegisterNumber)
      .input('ShowRoomId', ShowRoomId)
      .input('MadeYear', MadeYear)
      .input('InsuranceDate', InsuranceDate ? new Date(Insurance) : null)
      .input('FCDate', new Date(FCDate))
      .input('PermitDate', new Date(PermitDate))
      .input('OriginalRC', OriginalRC)
      .input('DuplicateKey', DuplicateKey)
      .input('Insurance', Insurance)
      .input('Endosement', Endosement)
      .input('OtherDocument', OtherDocument)
      .input('DocumentCharges', DocumentCharges)
      .input('LoanAmount', LoanAmount)
      .input('Interest', Interest)
      .input('Tenure', Tenure)
      .input('CalculatedEmiAmount', CalculatedEmiAmount)
      .input('ActualEmiAmount', ActualEmiAmount)
      .input('PrincipalAmount', PrincipalAmount)
      .input('InterestAmount', InterestAmount)
      .input('LoanStartDate', new Date(LoanStartDate))
      .input('LoanEndDate', new Date(LoanEndDate))
      .input('AgentId', AgentId)
      .input('AgentCommission', AgentCommission)
      .input('VehicleDocsURL', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .execute('SazsFinance_Pr_LoanDetails');
    await transaction.commit();
    req.resultMessage = 'Loan updated Successfully';
    req.Event = 'Create';
    req.ApiCall = 'Loan';
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

const removeLoan = async (req, res, next) => {
  const LoanId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('LoanId', LoanId)
      .input('LoanType', null)
      .input('LoanNo', null)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .input('VehicleTypeId', null)
      .input('CustomerId', null)
      .input('RegisterNumber', null)
      .input('ShowRoomId', null)
      .input('MadeYear', null)
      .input('InsuranceDate', null)
      .input('FCDate', null)
      .input('PermitDate', null)
      .input('OriginalRC', null)
      .input('DuplicateKey', null)
      .input('Insurance', null)
      .input('Endosement', null)
      .input('OtherDocument', null)
      .input('DocumentCharges', null)
      .input('LoanAmount', null)
      .input('Interest', null)
      .input('Tenure', null)
      .input('CalculatedEmiAmount', null)
      .input('ActualEmiAmount', null)
      .input('PrincipalAmount', null)
      .input('InterestAmount', null)
      .input('LoanStartDate', null)
      .input('LoanEndDate', null)
      .input('AgentId', null)
      .input('AgentCommission', null)
      .input('VehicleDocsURL', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .execute('SazsFinance_Pr_LoanDetails');
    await transaction.commit();
    req.resultMessage = 'Loan Deleted Successfully';
    req.Event = 'Create';
    req.ApiCall = 'Loan';
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
  getAllLoans,
  createLoan,
  updateLoan,
  removeLoan,
};
