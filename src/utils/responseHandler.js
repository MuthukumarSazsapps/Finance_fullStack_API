import { HttpStatusCode } from './constants.js';

const responseHandler = ({ req, res, data, httpCode }) => {
  const success = [HttpStatusCode.OK, HttpStatusCode.CREATED].includes(httpCode); // Need to check other sucess codes
  if (success) {
    res.status(httpCode).send(data);
  } else {
    res.status(httpCode).send(data);
  }
};
export default responseHandler;
