// Cart route definitions for item CRUD operations.

import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { addToCart, getCart, removeFromCart, updateQuantity } from "../controllers/cartController.js";
import { validate } from "../middleware/validate.js";
import { cartProductSchema, cartRemoveSchema, updateQuantitySchema } from "../validations/cartValidation.js";

const router = express.Router();

router.get("/get", isAuthenticated, getCart);
router.post("/add", isAuthenticated, validate({ body: cartProductSchema }), addToCart);
router.put(
  "/update",
  isAuthenticated,
  validate({ body: updateQuantitySchema }),
  updateQuantity,
);
router.delete("/remove", isAuthenticated, validate({ body: cartRemoveSchema }), removeFromCart);


export default router