import express from "express";
import multer from "multer";

import { GetProfile, Login, Logout, NewUser, ResetPassword, SignUp, UpdateProfile, UpdateUser, VerifyEmail, GetAllPermissions, GetAllUsers, GetUserForEdit, ToogleAdmin, ToogleMultiDeviceLogin, ToogleBlockUser, AssignUsersUnderManager, ChangePasswordFromAdmin, UpdatePassword, SendEmailVerificationLink, SendMailForResetPasswordLink, AssignSimilarPermissionToMultipleUsers, AssignPermissionsToOneUser, CreateUserFromExcel, DownloadExcelTemplateForCreateUsers, GetUsersForDropdown, GetAssignedUsersForEdit } from "../controllers/user.controller";
import { isAdmin, isAuthenticatedUser, isProfileAuthenticated, } from "../middlewares/auth.middleware";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.post("/signup", upload.single("dp"), SignUp)
router.route("/users").get(isAuthenticatedUser, GetAllUsers)
    .post(isAuthenticatedUser, upload.single("dp"), NewUser)
router.get("/dropdown/users", isAuthenticatedUser, GetUsersForDropdown)
router.route("/users/:id")
    .put(isAuthenticatedUser, upload.single("dp"), UpdateUser)
    .get(isAuthenticatedUser, GetUserForEdit)
router.patch("/toogle-admin/:id", isAuthenticatedUser, isAdmin, ToogleAdmin)
router.patch("/toogle-multi-device-login/:id", isAuthenticatedUser, isAdmin, ToogleMultiDeviceLogin)
router.patch("/toogle-block-user/:id", isAuthenticatedUser, isAdmin, ToogleBlockUser)
router.post("/login", Login)
router.post("/logout", Logout)
router.patch("/assign-users/:id", isAuthenticatedUser, AssignUsersUnderManager)
router.route("/profile")
    .get(isProfileAuthenticated, GetProfile)
    .put(isAuthenticatedUser, upload.single("dp"), UpdateProfile)
router.route("/password/change-from-admin/:id").patch(isAuthenticatedUser, ChangePasswordFromAdmin)
router.route("/password/update").patch(isAuthenticatedUser, UpdatePassword)
router.post("/send/email/verifcation-link", isAuthenticatedUser, SendEmailVerificationLink)
router.patch("/email/verify/:token", VerifyEmail)
router.post("/send/email/password-reset-link", SendMailForResetPasswordLink)
router.patch("/password/reset/:token", ResetPassword)
router.route("/permissions").get(isAuthenticatedUser, GetAllPermissions).post(isAuthenticatedUser, AssignSimilarPermissionToMultipleUsers)
router.route("/permissions/one").post(isAuthenticatedUser, AssignPermissionsToOneUser)
router.route("/create-from-excel/users")
    .post(isAuthenticatedUser, CreateUserFromExcel)
router.get("/download/template/users", upload.single("excel"), isAuthenticatedUser, DownloadExcelTemplateForCreateUsers)
router.get("/assigned/users/edit/:id", isAuthenticatedUser, GetAssignedUsersForEdit)

export default router;