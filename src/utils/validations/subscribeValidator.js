import joi from 'joi';
import responseHandler from '../responseHandler.js';
import { HttpStatusCode } from '../constants.js';

const validation = joi.object({
  subscriberCode: joi.string().trim(true).required(),
  subscriberName: joi.string().trim(true).required(),
  shortName: joi.string().trim(true).required(),
  email: joi.string().email().trim(true).required(),
  cityId: joi.string().trim(true).required(),
  gstNo: joi.string().trim(true).required(),
  pointOfContact: joi.string().trim(true).required(),
  password: joi
    .string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required(),
  ConfirmPassword: joi.ref('password'),
  startDate: joi.string().allow('').optional(),
  endDate: joi.string().allow('').optional(),
  avatar: joi.string().allow({}).optional(),
  isActive: joi.string().trim(true).required(),
});

const subscriberValidation = async (req, res, next) => {
  try {
    const { error, value } = validation.validate(req.body);
    if (error) {
      responseHandler({
        req,
        res,
        data: { message: error?.details[0]?.message },
        httpCode: HttpStatusCode.BAD_REQUEST,
      });
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
  }
};
export default subscriberValidation;
