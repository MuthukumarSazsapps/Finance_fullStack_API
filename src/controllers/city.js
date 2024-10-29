import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllCities = async (req, res) => {
  try {
    const request = pool.request();
    const sqlQuery = 'SELECT * FROM Sazs_Vw_Adm_U_CityMaster';
    const result = await request.query(sqlQuery);
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Cities', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createCity = async (req, res, next) => {
  const { StateId, CityName, CreatedBy, Pincode, IsActive } = req.body;
  try {
    if (StateId && CityName && CreatedBy && IsActive) {
      await transaction.begin();
      const request = new mssql.Request(transaction);
      const result = await request
        .input('Flag', 1)
        .input('StateId', StateId)
        .input('Pincode', Pincode)
        .input('CityName', CityName)
        .input('CityId', null)
        .input('CreatedBy', CreatedBy)
        .input('ModifiedBy', null)
        .input('IsActive', IsActive)
        .execute('Sazs_Pr_CityMaster');
      await transaction.commit();
      req.resultMessage = result.recordset[0].message;
      req.Event = 'Create';
      req.ApiCall = 'City';
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
const updateCity = async (req, res, next) => {
  const { StateId, CityName, ModifiedBy, Pincode, IsActive } = req.body;
  const CityId = req.params.id;
  try {
    if (CityId && IsActive && StateId && CityName && ModifiedBy) {
      await transaction.begin();
      const request = new mssql.Request(transaction);
      const result = await request
        .input('Flag', 2)
        .input('StateId', StateId)
        .input('CityName', CityName)
        .input('CityId', CityId)
        .input('Pincode', Pincode)
        .input('CreatedBy', null)
        .input('ModifiedBy', ModifiedBy)
        .input('IsActive', IsActive)
        .execute('Sazs_Pr_CityMaster');
      await transaction.commit();
      req.resultMessage = result.recordset[0].message;
      req.Event = 'Update';
      req.ApiCall = 'City';
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
const deleteCity = async (req, res, next) => {
  const CityId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('StateId', null)
      .input('CityName', null)
      .input('Pincode', null)
      .input('CityId', CityId)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .execute('Sazs_Pr_CityMaster');
    await transaction.commit();
    req.resultMessage = 'City Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'City';
    next();
  } catch (error) {
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { message: 'Network Error' },
      httpCode: HttpStatusCode.OK,
    });
  }
};
export default { createCity, updateCity, deleteCity, getAllCities };
