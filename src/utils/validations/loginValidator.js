import Joi from 'joi';

// Joi schema for login endpoint
export const loginSchema = Joi.object({
  username: Joi.string().required(), // Need to add the email vaidation here
  password: Joi.string().required(),
});
