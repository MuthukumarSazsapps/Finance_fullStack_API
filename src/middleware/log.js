import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { pool } from '../config/database.js';
import _uniq from 'lodash/uniq.js';

const addLog = async (req, res, next) => {
  const { username } = req.decoded;
  const Message = req.resultMessage;
  const Event = req.Event;
  const ApiCall = req.ApiCall;
  try {
    const request = pool.request();
    const result = await request
      .input('Event', Event)
      .input('ApiCall', ApiCall)
      .input('ApiUrl', req.originalUrl)
      .input('Result', Message)
      .input('UserName', username)
      .input('Data', JSON.stringify(req.body))
      .execute('dbo.Sazs_Pr_LogEntry');
    responseHandler({
      req,
      res,
      data: { message: Message },
      httpCode: HttpStatusCode.OK,
    });
  } catch (error) {
    console.log('error', error);
    responseHandler({
      req,
      res,
      data: { message: Message },
      httpCode: HttpStatusCode.OK,
    });
  }
};

export default { addLog };
