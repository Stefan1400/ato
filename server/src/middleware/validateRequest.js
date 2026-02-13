const { ZodError } = require("zod");

const validateRequest = (schema) => (req, res, next) => {
  try {
    const result = schema.parse(req.body);
    req.body = result;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: err.errors,
      });
    }

    next(err);
  }
};

module.exports = validateRequest;