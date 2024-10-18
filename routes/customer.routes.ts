import express from "express";
import multer from "multer";

import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CreateCustomer, CreateCustomerFromExcel, DownloadExcelTemplateForCreateCustomers, GetAllCustomers, GetCustomerForEdit, GetCustomersForDropdown, ToogleBlockCustomer, UpdateCustomer } from "../controllers/customer.controller";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.route("/customers")
    .post(isAuthenticatedUser, CreateCustomer)
    .get(isAuthenticatedUser, GetAllCustomers)
router.get("/dropdown/customers", isAuthenticatedUser, GetCustomersForDropdown)
router.route("/customers/:id")
    .put(isAuthenticatedUser, UpdateCustomer).get(GetCustomerForEdit)
router.patch("/toogle-block-customer", isAuthenticatedUser, ToogleBlockCustomer)
router.route("/create-from-excel/customers")
    .post(isAuthenticatedUser,  CreateCustomerFromExcel)
router.get("/download/template/customers", isAuthenticatedUser, DownloadExcelTemplateForCreateCustomers)

export default router;