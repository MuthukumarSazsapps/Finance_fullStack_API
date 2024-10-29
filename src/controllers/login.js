import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import responseHandler from '../utils/responseHandler.js';
import { HttpStatusCode } from '../utils/constants.js';
import { loginSchema } from '../utils/validations/loginValidator.js';
import crypto from 'crypto';
import { pool } from '../config/database.js';

export const SECRET_KEY = process.env.SECRET_KEY;

const getPasswordHash = async plainPassword => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  } catch (error) {
    return null;
  }
};

const getToken = async (username, role) => {
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    let refreshId = username + SECRET_KEY;
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
    let b = Buffer.from(hash);
    let refresh_token = b.toString('base64');
    const token = jwt.sign({ username, role }, SECRET_KEY, {
      expiresIn: '1d',
    });
    return {
      refresh_token,
      salt,
      token,
    };
  } catch (error) {
    console.error('Error Generate Token:', error);
    return {
      refresh_token: '',
      salt: '',
      token: '',
    };
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return responseHandler({
        req,
        res,
        data: { error: 'Username and password are required' },
        httpCode: HttpStatusCode.BAD_REQUEST,
      });
    }
    if (username === process.env.USER_NAME) {
      const { refresh_token, salt, token } = await getToken(username, 'Admin');
      return responseHandler({
        req,
        res,
        data: {
          UserId: '',
          UserName: username,
          role: 'Admin',
          token,
          refresh_token,
          refresh_key: salt,
        },
        httpCode: HttpStatusCode.OK,
      });
    }
    const request = pool.request();
    const result = await request
      .input('Flag', 1)
      .input('UserName', username)
      .execute('Sazs_Pr_ValidateLogin');
    if (result?.recordset?.length) {
      const loginInfo = result.recordset[0];
      const validPassword = await bcrypt.compare(password, loginInfo.Password || '');
      if (validPassword) {
        const { refresh_token, salt, token } = await getToken(
          username,
          loginInfo.Role ? 'Subscriber' : 'User',
        );
        return responseHandler({
          req,
          res,
          data: {
            UserId: loginInfo.UserId,
            UserName: username,
            role: loginInfo.Role ? 'Subscriber' : 'User',
            token,
            refresh_token,
            refresh_key: salt,
          },
          httpCode: HttpStatusCode.OK,
        });
      }
    }
    return responseHandler({
      req,
      res,
      data: { error: 'Invalid credentials' },
      httpCode: HttpStatusCode.UNAUTHORIZED,
    });
  } catch (err) {
    console.log('login err -', err);
    return responseHandler({
      req,
      res,
      data: { error: 'Invalid credentials' },
      httpCode: HttpStatusCode.UNAUTHORIZED,
    });
  }
};

const refTokenLogin = async (req, res) => {
  try {
    const { username, refresh_token, refresh_key } = req.body;
    const SECRET_KEY = process.env.SECRET_KEY;
    if (!refresh_token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decodedRefreshToken = Buffer.from(refresh_token, 'base64');
    const request = pool.request();
    const result = await request
      .input('Flag', 1)
      .input('UserName', username)
      .execute('Sazs_Pr_ValidateLogin');
    if (result.recordset) {
      if (result.recordset[0]?.Role && result.recordset[0]?.UserId) {
        let refreshId = username + SECRET_KEY;
        const hash = crypto.createHmac('sha512', refresh_key).update(refreshId).digest('base64');
        const expect_refresh_token = Buffer.from(hash);
        const isValidRefToken = crypto.timingSafeEqual(decodedRefreshToken, expect_refresh_token);

        if (isValidRefToken) {
          const token = jwt.sign({ username: username, role: 'Subscriber' }, SECRET_KEY, {
            expiresIn: '1d',
          });
          responseHandler({
            req,
            res,
            data: { token },
            httpCode: HttpStatusCode.OK,
          });
        } else {
          responseHandler({
            req,
            res,
            data: { error: 'Invalid refreshToken' },
            httpCode: HttpStatusCode.UNAUTHORIZED,
          });
        }
      }
      if (!result.recordset[0]?.Role && result.recordset[0]?.UserId) {
        let refreshId = username + SECRET_KEY;
        const hash = crypto.createHmac('sha512', refresh_key).update(refreshId).digest('base64');
        const expect_refresh_token = Buffer.from(hash);
        const isValidRefToken = crypto.timingSafeEqual(decodedRefreshToken, expect_refresh_token);
        if (isValidRefToken) {
          const token = jwt.sign({ username: username, role: 'User' }, SECRET_KEY, {
            expiresIn: '1d',
          });
          responseHandler({
            req,
            res,
            data: { token },
            httpCode: HttpStatusCode.OK,
          });
        } else {
          responseHandler({
            req,
            res,
            data: { error: 'Invalid refreshToken' },
            httpCode: HttpStatusCode.UNAUTHORIZED,
          });
        }
      }
    }
    if (username === process.env.USER_NAME) {
      let refreshId = username + SECRET_KEY;
      const hash = crypto.createHmac('sha512', refresh_key).update(refreshId).digest('base64');
      const expect_refresh_token = Buffer.from(hash);
      const isValidRefToken = crypto.timingSafeEqual(decodedRefreshToken, expect_refresh_token);
      if (isValidRefToken) {
        const token = jwt.sign({ username: username, role: 'Admin' }, SECRET_KEY, {
          expiresIn: '1d',
        });
        responseHandler({
          req,
          res,
          data: { token },
          httpCode: HttpStatusCode.OK,
        });
      } else {
        responseHandler({
          req,
          res,
          data: { error: 'Invalid refreshToken' },
          httpCode: HttpStatusCode.UNAUTHORIZED,
        });
      }
    }
  } catch (err) {
    console.log('autologin err -', err);
    return responseHandler({
      req,
      res,
      data: { error: 'Invalid credentials' },
      httpCode: HttpStatusCode.UNAUTHORIZED,
    });
  }
};

export default { login, refTokenLogin };
