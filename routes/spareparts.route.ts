import express from "express";
import multer from "multer";

import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CreateSparePart, CreateSparePartFromExcel, DownloadExcelTemplateForCreateSpareParts, GetAllSpareParts, GetSparePartForEdit, GetSparePartsForDropdown, ToogleBlockSparePart, UpdateSparePart, UploadSparePartPhotos } from "../controllers/spare.parts.controller";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.route("/parts")
    .post(isAuthenticatedUser, CreateSparePart)
    .get(isAuthenticatedUser, GetAllSpareParts)
router.get("/dropdown/parts", isAuthenticatedUser, GetSparePartsForDropdown)
router.route("/parts/:id")
    .put(isAuthenticatedUser, UpdateSparePart).get(GetSparePartForEdit)
router.patch("/toogle-block-part", isAuthenticatedUser, ToogleBlockSparePart)
router.route("/create-from-excel/parts")
    .post(isAuthenticatedUser, CreateSparePartFromExcel)
router.get("/download/template/parts", isAuthenticatedUser, DownloadExcelTemplateForCreateSpareParts)
router.route("/upload/part-photos")
    .post(isAuthenticatedUser, upload.array('media', 4), UploadSparePartPhotos)
export default router;