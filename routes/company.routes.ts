import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";
import { Createcompany, ToogleCompanyStatus, GetAllCompanies, GetAllCompaniesForDropDown, Updatecompany, GetUsersOfACompany } from "../controllers/company.controller";

const router = express.Router()

router.route("/companies").get(isAuthenticatedUser, GetAllCompanies).post(isAuthenticatedUser, upload.single('none'), Createcompany)
router.route("/companies/:id").put(isAuthenticatedUser, upload.single('none'), Updatecompany).patch(isAuthenticatedUser, ToogleCompanyStatus)
router.route("/companies/dropdown")
    .get(isAuthenticatedUser, GetAllCompaniesForDropDown)
router.get("/company/users/:id", isAuthenticatedUser, GetUsersOfACompany)
export default router