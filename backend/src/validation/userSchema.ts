import Joi from "joi";

export const userRegisterSchema = Joi.object({
  username: Joi.string().min(2).max(50).required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 2 characters",
      "string.max": "Username must be at most 50 characters"
    }),

  email: Joi.string().email().required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required"
    }),

  password: Joi.string().min(8)
    .pattern(new RegExp("(?=.*[A-Z])(?=.*\\d)")) // At least 1 uppercase letter and 1 number
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must contain at least one uppercase letter and one number"
    })
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required"
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
    })
});