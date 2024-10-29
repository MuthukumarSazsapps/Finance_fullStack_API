// middleware/authenticate.js

import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../controllers/login.js';

const authenticateMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'You are Unauthorized' });
    }
    const decoded = jwt.verify(JSON.parse(token), process.env.SECRET_KEY);
    req.decoded = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden', message: error });
  }
};

export default authenticateMiddleware;
