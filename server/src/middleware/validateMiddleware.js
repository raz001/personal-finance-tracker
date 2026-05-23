import { validationResult } from "express-validator";

/**
 * Reads express-validator results and short-circuits with 422 if any field failed.
 * Place this after your validation rule arrays in the route definition.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    return res.status(422).json({ message });
  }

  next();
};
