import joi from 'joi';
import responseHandler from '../responseHandler.js';
import { HttpStatusCode } from '../constants.js';

const validation = joi.object({
  subMenuName: joi.string().trim(true).required(),
  menuName: joi.string().trim(true).required(),
  path: joi.string().trim(true).required(),
  icon: joi.string().allow({}).optional(),
  status: joi.string().required(),
});

const subMenuValidation = async (req, res, next) => {
  const { error, value } = validation.validate(req.body);
  if (error) {
    responseHandler({
      req,
      res,
      data: { message: error?.details[0]?.message },
      httpCode: HttpStatusCode.BAD_REQUEST,
    });
  } else {
    next();
  }
};
export default subMenuValidation;
