// Order route definitions including payment and reporting endpoints.

import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js"
import { createOrder, getAllOrdersAdmin, getMyOrder, getSalesData, getUserOrders, verifyPayment } from "../controllers/orderController.js"
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validations/orderValidation.js";

const router = express.Router(); 

router.post("/create-order",isAuthenticated, validate({ body: createOrderSchema }), createOrder)
router.post('/verify-payment',isAuthenticated,verifyPayment)
router.get('/my-order',isAuthenticated,getMyOrder)
router.get('/all',isAuthenticated,isAdmin,getAllOrdersAdmin)
router.get('/user-order/:userId',isAuthenticated,isAdmin,getUserOrders)
router.get('/sales',isAuthenticated,isAdmin,getSalesData) 


export default router
