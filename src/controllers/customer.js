import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';
import uploadFileToS3 from '../utils/uploadFileToS3.js';

const handleMultipleUploads = async files => {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map(file => uploadFileToS3(file)));
};

const getCustomer = async (req, res) => {
  const { CustomerId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('CustomerId', CustomerId)
      .execute('SazsFinance_Pr_Get_Customers_Details');
    responseHandler({
      req,
      res,
      data: result.recordset[0],
      httpCode: HttpStatusCode.CREATED,
    });
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Agent', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
const getAllCustomers = async (req, res) => {
  const { BranchId, SubscriberId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 4)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('CustomerId', null)
      .input('CustomerName', null)
      .input('CustomerFatherName', null)
      .input('CustomerDOB', null)
      .input('CustomerGender', null)
      .input('CustomerAddress', null)
      .input('CustomerProfession', null)
      .input('CustomerCity', null)
      .input('CustomerAADHAAR', null)
      .input('CustomerDrivingLicenseNo', null)
      .input('CustomerDrivingLicenseExpiryDate', null)
      .input('CustomerPAN', null)
      .input('CustomerPhoneNo', null)
      .input('CustomerAlternatePhoneNo', null)
      .input('GuarantorName', null)
      .input('GuarantorFatherName', null)
      .input('GuarantorGender', null)
      .input('GuarantorAddress', null)
      .input('GuarantorCity', null)
      .input('GuarantorPhoneNo', null)
      .input('CustomerEmail', null)
      .input('CustomerPhotoURL', null)
      .input('CustomerDocumentURL', null)
      .input('CustomerRating', null)
      .input('CustomerIsBlocked', null)
      .input('CustomerIsCurrent', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', null)
      .execute('SazsFinance_Pr_Customers');
    responseHandler({
      req,
      res,
      data: result.recordset,
      httpCode: HttpStatusCode.CREATED,
    });
  } catch (error) {
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Agent', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
// const createCustomer = async (req, res, next) => {
//   const {
//     SubscriberId,
//     BranchId,
//     CustomerName,
//     CustomerFatherName,
//     CustomerDOB,
//     CustomerGender,
//     CustomerAddress,
//     CustomerProfession,
//     CustomerCity,
//     CustomerAADHAAR,
//     CustomerDrivingLicenseNo,
//     CustomerDrivingLicenseExpiryDate,
//     CustomerPAN,
//     CustomerPhoneNo,
//     CustomerAlternatePhoneNo,
//     GuarantorName,
//     GuarantorFatherName,
//     GuarantorGender,
//     GuarantorAddress,
//     GuarantorCity,
//     GuarantorPhoneNo,
//     CustomerEmail,
//     CustomerRating,
//     CustomerIsBlocked,
//     CustomerIsCurrent,
//     CreatedBy,
//   } = req.body;
//   const CustomerPhotoURL = req.file?.filename;
//   try {
//     await transaction.begin();
//     const request = new mssql.Request(transaction);
//     const result = await request
//       .input('Flag', 1)
//       .input('CustomerId', null)
//       .input('SubscriberId', SubscriberId)
//       .input('BranchId', BranchId)
//       .input('CustomerName', CustomerName)
//       .input('CustomerFatherName', CustomerFatherName)
//       .input('CustomerDOB', CustomerDOB ? new Date(CustomerDOB) : ' ')
//       .input('CustomerGender', CustomerGender)
//       .input('CustomerAddress', CustomerAddress)
//       .input('CustomerProfession', CustomerProfession)
//       .input('CustomerCity', CustomerCity)
//       .input('CustomerAADHAAR', CustomerAADHAAR)
//       .input('CustomerDrivingLicenseNo', CustomerDrivingLicenseNo)
//       .input(
//         'CustomerDrivingLicenseExpiryDate',
//         CustomerDrivingLicenseExpiryDate ? new Date(CustomerDrivingLicenseExpiryDate) : null,
//       )
//       .input('CustomerPAN', CustomerPAN)
//       .input('CustomerPhoneNo', CustomerPhoneNo)
//       .input('CustomerAlternatePhoneNo', CustomerAlternatePhoneNo)
//       .input('GuarantorName', GuarantorName)
//       .input('GuarantorFatherName', GuarantorFatherName)
//       .input('GuarantorGender', GuarantorGender)
//       .input('GuarantorAddress', GuarantorAddress)
//       .input('GuarantorCity', GuarantorCity)
//       .input('GuarantorPhoneNo', GuarantorPhoneNo)
//       .input('CustomerEmail', CustomerEmail)
//       .input('CustomerPhotoURL', CustomerPhotoURL)
//       .input('CustomerRating', CustomerRating)
//       .input('CustomerIsBlocked', CustomerIsBlocked)
//       .input('CustomerIsCurrent', CustomerIsCurrent)
//       .input('CreatedBy', CreatedBy)
//       .input('ModifiedBy', null)
//       .execute('SazsFinance_Pr_Customers');
//     await transaction.commit();
//     req.resultMessage = result.recordset[0].message;
//     req.Event = 'Create';
//     req.ApiCall = 'Customer';
//     next();
//   } catch (error) {
//     console.log(error);
//     await transaction.rollback();
//     responseHandler({
//       req,
//       res,
//       data: { error: 'An error occurred' },
//       httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

const createCustomer = async (req, res, next) => {
  const {
    SubscriberId,
    BranchId,
    CustomerName,
    CustomerFatherName,
    CustomerDOB,
    CustomerGender,
    CustomerAddress,
    CustomerProfession,
    CustomerCity,
    CustomerAADHAAR,
    CustomerDrivingLicenseNo,
    CustomerDrivingLicenseExpiryDate,
    CustomerPAN,
    CustomerPhoneNo,
    CustomerAlternatePhoneNo,
    GuarantorName,
    GuarantorFatherName,
    GuarantorGender,
    GuarantorAddress,
    GuarantorCity,
    GuarantorPhoneNo,
    CustomerEmail,
    CustomerRating,
    CustomerIsBlocked,
    CustomerIsCurrent,
    CreatedBy,
  } = req.body;
  const { CustomerPhotoURL, CustomerDocumentURL } = req.files;
  console.log('CustomerPhotoURLFile', req.files.CustomerDocumentURL);
  try {
    await transaction.begin();
    const uploadedCustomerPhotos = await handleMultipleUploads(CustomerPhotoURL);
    const uploadedCustomerDocuments = await handleMultipleUploads(CustomerDocumentURL);

    const CustomerPhotoURLPath = uploadedCustomerPhotos[0] || null;
    const CustomerDocumentURLPath = uploadedCustomerDocuments[0] || null;

    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('CustomerId', null)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('CustomerName', CustomerName)
      .input('CustomerFatherName', CustomerFatherName)
      .input('CustomerDOB', CustomerDOB ? new Date(CustomerDOB) : ' ')
      .input('CustomerGender', CustomerGender)
      .input('CustomerAddress', CustomerAddress)
      .input('CustomerProfession', CustomerProfession)
      .input('CustomerCity', CustomerCity)
      .input('CustomerAADHAAR', CustomerAADHAAR)
      .input('CustomerDrivingLicenseNo', CustomerDrivingLicenseNo)
      .input(
        'CustomerDrivingLicenseExpiryDate',
        CustomerDrivingLicenseExpiryDate ? new Date(CustomerDrivingLicenseExpiryDate) : null,
      )
      .input('CustomerPAN', CustomerPAN)
      .input('CustomerPhoneNo', CustomerPhoneNo)
      .input('CustomerAlternatePhoneNo', CustomerAlternatePhoneNo)
      .input('GuarantorName', GuarantorName)
      .input('GuarantorFatherName', GuarantorFatherName)
      .input('GuarantorGender', GuarantorGender)
      .input('GuarantorAddress', GuarantorAddress)
      .input('GuarantorCity', GuarantorCity)
      .input('GuarantorPhoneNo', GuarantorPhoneNo)
      .input('CustomerEmail', CustomerEmail)
      .input('CustomerPhotoURL', CustomerPhotoURLPath)
      .input('CustomerDocumentURL', CustomerDocumentURLPath)
      .input('CustomerRating', CustomerRating)
      .input('CustomerIsBlocked', CustomerIsBlocked)
      .input('CustomerIsCurrent', CustomerIsCurrent)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .execute('SazsFinance_Pr_Customers');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Customer';
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

const updateCustomer = async (req, res, next) => {
  const CustomerId = req.params.id;
  const {
    BranchId,
    CustomerName,
    CustomerFatherName,
    CustomerDOB,
    CustomerGender,
    CustomerAddress,
    CustomerProfession,
    CustomerCity,
    CustomerAADHAAR,
    CustomerDrivingLicenseNo,
    CustomerDrivingLicenseExpiryDate,
    CustomerPAN,
    CustomerPhoneNo,
    CustomerAlternatePhoneNo,
    GuarantorName,
    GuarantorFatherName,
    GuarantorGender,
    GuarantorAddress,
    GuarantorCity,
    GuarantorPhoneNo,
    CustomerEmail,
    CustomerRating,
    CustomerIsBlocked,
    CustomerIsCurrent,
    ModifiedBy,
  } = req.body;
  console.log('ol', req.files);
  const { CustomerPhotoURL, CustomerDocumentURL } = req.files;
  try {
    await transaction.begin();
    const uploadedCustomerPhotos = await handleMultipleUploads(CustomerPhotoURL);
    const uploadedCustomerDocuments = await handleMultipleUploads(CustomerDocumentURL);

    const CustomerPhotoURLPath = uploadedCustomerPhotos[0] || null;
    const CustomerDocumentURLPath = uploadedCustomerDocuments[0] || null;

    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('CustomerId', CustomerId)
      .input('SubscriberId', null)
      .input('BranchId', BranchId)
      .input('CustomerName', CustomerName)
      .input('CustomerFatherName', CustomerFatherName)
      .input('CustomerDOB', CustomerDOB ? new Date(CustomerDOB) : ' ')
      .input('CustomerGender', CustomerGender)
      .input('CustomerAddress', CustomerAddress)
      .input('CustomerProfession', CustomerProfession)
      .input('CustomerCity', CustomerCity)
      .input('CustomerAADHAAR', CustomerAADHAAR)
      .input('CustomerDrivingLicenseNo', CustomerDrivingLicenseNo)
      .input(
        'CustomerDrivingLicenseExpiryDate',
        CustomerDrivingLicenseExpiryDate !== 'null'
          ? new Date(CustomerDrivingLicenseExpiryDate)
          : null,
      )
      .input('CustomerPAN', CustomerPAN)
      .input('CustomerPhoneNo', CustomerPhoneNo)
      .input('CustomerAlternatePhoneNo', CustomerAlternatePhoneNo)
      .input('GuarantorName', GuarantorName)
      .input('GuarantorFatherName', GuarantorFatherName)
      .input('GuarantorGender', GuarantorGender)
      .input('GuarantorAddress', GuarantorAddress)
      .input('GuarantorCity', GuarantorCity)
      .input('GuarantorPhoneNo', GuarantorPhoneNo)
      .input('CustomerEmail', CustomerEmail)
      .input('CustomerPhotoURL', CustomerPhotoURLPath)
      .input('CustomerDocumentURL', CustomerDocumentURLPath)
      .input('CustomerRating', CustomerRating)
      .input('CustomerIsBlocked', CustomerIsBlocked)
      .input('CustomerIsCurrent', CustomerIsCurrent)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .execute('SazsFinance_Pr_Customers');
    await transaction.commit();

    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Customer';
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

const removeCustomer = async (req, res, next) => {
  const CustomerId = req.params.id;
  const ModifiedBy = req.body.ModifiedBy;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('BranchId', null)
      .input('CustomerId', CustomerId)
      .input('CustomerName', null)
      .input('CustomerFatherName', null)
      .input('CustomerDOB', null)
      .input('CustomerGender', null)
      .input('CustomerAddress', null)
      .input('CustomerCity', null)
      .input('CustomerAADHAAR', null)
      .input('CustomerDrivingLicenseNo', null)
      .input('CustomerDrivingLicenseExpiryDate', null)
      .input('CustomerPAN', null)
      .input('CustomerPhoneNo', null)
      .input('CustomerAlternatePhoneNo', null)
      .input('GuarantorName', null)
      .input('GuarantorFatherName', null)
      .input('GuarantorGender', null)
      .input('GuarantorAddress', null)
      .input('GuarantorCity', null)
      .input('GuarantorPhoneNo', null)
      .input('CustomerEmail', null)
      .input('CustomerPhotoURL', null)
      .input('CustomerDocumentURL', null)
      .input('CustomerRating', null)
      .input('CustomerIsBlocked', null)
      .input('CustomerIsCurrent', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .execute('SazsFinance_Pr_Customers');
    await transaction.commit();
    req.resultMessage = 'Customer Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Customer';
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
  getAllCustomers,
  getCustomer,
  updateCustomer,
  removeCustomer,
  createCustomer,
};
