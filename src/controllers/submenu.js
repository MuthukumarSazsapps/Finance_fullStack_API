import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllSubMenus = async (req, res) => {
  try {
    const request = pool.request();
    const newQuery = 'SELECT * FROM Sazs_Vw_Adm_U_SubMenus';
    const result = await request.query(newQuery);
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching SubMenus', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createSubMenu = async (req, res, next) => {
  const { MenuId, SubMenuName, Path, Icon, CreatedBy, IsActive, SubMenuOrder } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('SubMenuId', null)
      .input('MenuId', MenuId)
      .input('SubMenuName', SubMenuName)
      .input('Path', Path)
      .input('Icon', Icon)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .input('SubMenuOrder', SubMenuOrder)
      .execute('Sazs_Pr_SubMenus');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'SubMenu';
    next();
  } catch (error) {
    await transaction.rollback();
    responseHandler({
      req,
      res,
      data: { message: 'An error occurred', error: error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateSubMenu = async (req, res, next) => {
  const SubMenuId = req.params.id;
  const { SubMenuName, MenuId, Path, Icon, ModifiedBy, SubMenuOrder, IsActive } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('SubMenuId', SubMenuId)
      .input('MenuId', MenuId)
      .input('SubMenuName', SubMenuName)
      .input('Path', Path)
      .input('Icon', Icon)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .input('SubMenuOrder', SubMenuOrder)
      .execute('Sazs_Pr_SubMenus');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'SubMenu';
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

const removeSubMenu = async (req, res, next) => {
  const SubMenuId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubMenuId', SubMenuId)
      .input('MenuId', null)
      .input('SubMenuName', null)
      .input('Path', null)
      .input('Icon', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .input('SubMenuOrder', null)
      .execute('Sazs_Pr_SubMenus');
    await transaction.commit();
    req.resultMessage = 'SubMenu Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'SubMenu';
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
  getAllSubMenus,
  updateSubMenu,
  removeSubMenu,
  createSubMenu,
};
