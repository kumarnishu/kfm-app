import express from "express";
import multer from "multer";

import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CreateMachine, CreateMachineFromExcel, DownloadExcelTemplateForCreateMachines, GetAllMachines, GetMachineForEdit, GetMachinesForDropdown, ToogleBlockMachine, UpdateMachine, UploadMachinePhoto } from "../controllers/machine.controller";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.route("/machines")
    .post(isAuthenticatedUser, CreateMachine)
    .get(isAuthenticatedUser, GetAllMachines)
router.get("/dropdown/machines", isAuthenticatedUser, GetMachinesForDropdown)
router.route("/machines/:id")
    .put(isAuthenticatedUser, UpdateMachine).get(GetMachineForEdit)
router.patch("/toogle-block-machine/:id", isAuthenticatedUser, ToogleBlockMachine)
router.route("/create-from-excel/machines")
    .post(isAuthenticatedUser, CreateMachineFromExcel)
router.get("/download/template/machines", upload.single("excel"), isAuthenticatedUser, DownloadExcelTemplateForCreateMachines)
router.route("/upload/machine-photos")
    .post(isAuthenticatedUser, upload.single('photo'), UploadMachinePhoto)
export default router;