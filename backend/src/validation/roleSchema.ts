import Joi from "joi";

export const createRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50).required()
    .messages({
      "string.empty": "Role name is required",
      "string.min": "Role name must be at least 2 characters",
      "string.max": "Role name must be at most 50 characters"
    }),

  description: Joi.string().max(255).optional()
    .messages({
      "string.max": "Description must be at most 255 characters"
    })
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional()
    .messages({
      "string.min": "Role name must be at least 2 characters",
      "string.max": "Role name must be at most 50 characters"
    }),

  description: Joi.string().max(255).optional()
    .messages({
      "string.max": "Description must be at most 255 characters"
    })
});
