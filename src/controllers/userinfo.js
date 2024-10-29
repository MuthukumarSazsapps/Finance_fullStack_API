import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool } from '../config/database.js';

const userinfo = async (req, res) => {
  const { UserId } = req.body;
  try {
    const request = pool.request();
    const result = await request
      .input('Flag', 1)
      .input('UserId', UserId)
      .execute('Sazs_Pr_UserDetails');
    responseHandler({
      req,
      res,
      data: {
        data: result.recordset,
      },
      httpCode: HttpStatusCode.CREATED,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 'EREQUEST') {
      if (error.precedingErrors[0]?.number === 2627) {
        responseHandler({
          req,
          res,
          data: { message: 'No List Available' },
          httpCode: HttpStatusCode.OK,
        });
      }
    } else {
      responseHandler({
        req,
        res,
        data: { error: 'An error occurred' },
        httpCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
};

export default {
  userinfo,
};
