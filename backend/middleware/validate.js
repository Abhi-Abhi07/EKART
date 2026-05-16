// Request schema validation middleware using Zod.

import { ZodError } from "zod";
import { fail } from "../utils/apiResponse.js";

/**
 * Validates request payload sections (body/params/query) using zod schemas.
 * @param {{body?: import("zod").ZodSchema, params?: import("zod").ZodSchema, query?: import("zod").ZodSchema}} schemas
 * @returns {import("express").RequestHandler}
 */
export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params);
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query);
    }
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(
        fail("Validation failed", {
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        }),
      );
    }
    return next(error);
  }
};
