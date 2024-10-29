import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';
import _uniq from 'lodash/uniq.js';

const getUserMenus = async (req, res) => {
  try {
    const { userId } = req.body;
    const request = pool.request();
    const userMenuMapping = await request
      .query(`SELECT SubMenuId FROM Sazs_UserMenuMapping WHERE UserId = '${userId}'`)
      .then(res => res.recordset.map(mapping => mapping.SubMenuId));
    const menus = await request
      .query('SELECT * FROM Sazs_Vw_Adm_U_Menus')
      .then(res => res.recordset);
    const subMenus = await request
      .query('SELECT * FROM Sazs_Vw_Adm_U_SubMenus')
      .then(res => res.recordset);
    const allMenus = menus
      .map(menu => ({
        ...menu,
        subMenus: subMenus.filter(
          submenu => submenu.MenuId === menu.MenuId && userMenuMapping.includes(submenu.SubMenuId),
        ),
      }))
      .filter(menu => menu.subMenus.length || menu.Path === '/home');
    const filteredMenus = allMenus.filter(menu => menu.subMenus.length > 0);
    responseHandler({ req, res, data: filteredMenus, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Menus', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const getAllMenus = async (req, res, next) => {
  try {
    if (req.decoded.role === 'User') {
      // todo: discussion: redirecting from all menu list
      next();
      return;
    }
    const request = pool.request();
    const menuQuery = 'SELECT * FROM Sazs_Vw_Adm_U_Menus';
    const AllMenus = await request.query(menuQuery);
    const subMenuQuery = 'SELECT * FROM Sazs_Vw_Adm_U_SubMenus';
    const AllSubMenus = await request.query(subMenuQuery);
    const menus = AllMenus.recordset;
    const submenus = AllSubMenus.recordset;
    const allMenus = menus.map(menu => ({
      ...menu,
      subMenus: submenus.filter(submenu => submenu.MenuId === menu.MenuId),
    }));
    responseHandler({ req, res, data: allMenus, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Menus', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createMenu = async (req, res, next) => {
  const { MenuName, CreatedBy, Icon, IsActive, MenuOrder } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('MenuId', null)
      .input('MenuName', MenuName)
      .input('Icon', Icon)
      .input('CreatedBy', CreatedBy)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .input('MenuOrder', MenuOrder)
      .execute('Sazs_Pr_Menus');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'Menu';
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

const updateMenu = async (req, res, next) => {
  const MenuId = req.params.id;
  const { MenuName, Icon, ModifiedBy, IsActive, MenuOrder } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('MenuId', MenuId)
      .input('MenuName', MenuName)
      .input('Icon', Icon)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .input('MenuOrder', MenuOrder)
      .execute('Sazs_Pr_Menus');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'Menu';
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

const removeMenu = async (req, res, next) => {
  const MenuId = req.params.id;
  const { ModifiedBy } = req.body;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('MenuId', MenuId)
      .input('MenuName', null)
      .input('Icon', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', null)
      .input('MenuOrder', null)
      .execute('Sazs_Pr_Menus');
    await transaction.commit();
    req.resultMessage = 'Menu Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'Menu';
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

const ImportMenu = async (req, res) => {
  const { ImportMenu } = req.body;
  try {
    await transaction.begin();
    await ImportMenu.reduce(async (prev, data) => {
      await prev;
      const request = new mssql.Request(transaction);
      await request
        .input('Flag', 1)
        .input('MenuId', null)
        .input('MenuName', data.MenuName)
        .input('Path', data.Path)
        .input('Icon', data.Icon)
        .input('CreatedBy', data.CreatedBy)
        .input('ModifiedBy', null)
        .input('IsActive', data.IsActive)
        .input('MenuOrder', data.MenuOrder)
        .execute('Sazs_Pr_Menus');
    }, Promise.resolve());
    await transaction.commit();
    responseHandler({
      req,
      res,
      data: {
        message: 'Menu created Successfully',
      },
      httpCode: HttpStatusCode.CREATED,
    });
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

export default {
  getUserMenus,
  getAllMenus,
  updateMenu,
  removeMenu,
  createMenu,
  ImportMenu,
};
