const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
});

const changePasswordSchema = z.object({
  current_password: z.string().min(6).max(72),
  new_password: z.string().min(6).max(72)
});

const forgotPasswordSchema = z.object({
  email: z.string().email().trim()
});

const resetPasswordSchema = z.object({
  token: z.string().min(20),
  new_password: z.string().min(6).max(72)
});

module.exports = { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};