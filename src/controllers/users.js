import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import bcrypt from 'bcrypt';
import { pool, transaction } from '../config/database.js';
import mssql from 'mssql';

const getAllUsers = async (req, res) => {
  const SubscriberId = req.body.SubscriberId;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 1)
      .input('SubscriberId', SubscriberId)
      .execute('Sazs_Pr_AppLogin');
    responseHandler({ req, res, data: result.recordset, httpCode: HttpStatusCode.OK });
  } catch (error) {
    responseHandler({
      req,
      res,
      data: { message: 'Error fetching Users', error },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const createUser = async (req, res, next) => {
  const {
    DisplayName,
    Email,
    MobileNo,
    BranchId,
    UserName,
    Address1,
    Address2,
    LandMark,
    CityId,
    SubscriberId,
    Password,
    IsActive,
    userMenus,
  } = req.body;
  const MenuArray = JSON.parse(userMenus);
  const mainArray = MenuArray.map(menu => {
    const { MenuId, subMenus } = menu;
    const subMenuArray = subMenus.map(subMenu => ({
      MenuId,
      SubMenuId: subMenu.SubMenuId,
    }));

    return subMenuArray;
  });
  const subMenuIdsString = mainArray
    .flatMap(innerArray => innerArray.map(obj => obj.SubMenuId))
    .join(',');
  try {
    await transaction.begin();
    const hashedPassWord = await bcrypt.hash(Password, 10);
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 1)
      .input('UserId', null)
      .input('SubscriberId', SubscriberId)
      .input('UserName', UserName)
      .input('BranchId', BranchId)
      .input('Role', 0)
      .input('Password', hashedPassWord)
      .input('DisplayName', DisplayName)
      .input('MobileNo', MobileNo)
      .input('Email', Email)
      .input('Address1', Address1)
      .input('Address2', Address2)
      .input('LandMark', LandMark)
      .input('CityId', CityId)
      .input('CreatedBy', SubscriberId)
      .input('ModifiedBy', null)
      .input('IsActive', IsActive)
      .input('SubMenuIds', subMenuIdsString)
      .input('SupportingUrl', null)
      .execute('Sazs_Pr_UserMaster');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Create';
    req.ApiCall = 'User';
    next();
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    responseHandler({
      req,
      res,
      data: { message: 'An error occurred', error: 'An error occurred' },
      httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateUser = async (req, res, next) => {
  const UserId = req.params.id;
  try {
    const {
      SubscriberId,
      Password,
      DisplayName,
      MobileNo,
      UserName,
      Email,
      BranchId,
      Address1,
      Address2,
      LandMark,
      CityId,
      ModifiedBy,
      IsActive,
      SubMenuId,
      SupportingUrl,
      userMenus,
      sendPassword,
    } = req.body;
    const MenuArray = JSON.parse(userMenus);
    const mainArray = MenuArray.map(menu => {
      const { MenuId, subMenus } = menu;
      const subMenuArray = subMenus.map(subMenu => ({
        MenuId,
        SubMenuId: subMenu.SubMenuId,
      }));

      return subMenuArray;
    });
    const subMenuIdsString = mainArray
      .flatMap(innerArray => innerArray.map(obj => obj.SubMenuId))
      .join(',');
    await transaction.begin();
    const hashedPassword = Password ? await bcrypt.hash(Password, 10) : '';
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 2)
      .input('UserId', UserId)
      .input('SubscriberId', SubscriberId)
      .input('BranchId', BranchId)
      .input('UserName', UserName)
      .input('PassWord', Boolean(sendPassword) ? hashedPassword : null)
      .input('Role', 0)
      .input('DisplayName', DisplayName)
      .input('MobileNo', MobileNo)
      .input('Email', Email)
      .input('Address1', Address1)
      .input('Address2', Address2)
      .input('LandMark', LandMark)
      .input('CityId', CityId)
      .input('CreatedBy', SubscriberId)
      .input('ModifiedBy', ModifiedBy)
      .input('IsActive', IsActive)
      .input('SubMenuIds', subMenuIdsString)
      .input('SupportingUrl', null)
      .execute('Sazs_Pr_UserMaster');
    await transaction.commit();
    req.resultMessage = result.recordset[0].message;
    req.Event = 'Update';
    req.ApiCall = 'User';
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

const removeUser = async (req, res, next) => {
  const UserId = req.params.id;
  const ModifiedBy = req.body.ModifiedBy;
  try {
    await transaction.begin();
    const request = new mssql.Request(transaction);
    const result = await request
      .input('Flag', 3)
      .input('SubscriberId', null)
      .input('UserName', null)
      .input('BranchId', null)
      .input('UserId', UserId)
      .input('Password', null)
      .input('DisplayName', null)
      .input('Role', 0)
      .input('Email', null)
      .input('CityId', null)
      .input('MobileNo', null)
      .input('Address1', null)
      .input('Address2', null)
      .input('LandMark', null)
      .input('CreatedBy', null)
      .input('ModifiedBy', ModifiedBy)
      .input('SupportingUrl', null)
      .input('SubMenuIds', null)
      .input('IsActive', null)
      .execute('Sazs_Pr_UserMaster');
    await transaction.commit();
    req.resultMessage = 'User Deleted Successfully';
    req.Event = 'Delete';
    req.ApiCall = 'User';
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
  getAllUsers,
  createUser,
  updateUser,
  removeUser,
};
