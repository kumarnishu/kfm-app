import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import moment from "moment"
import { DropDownDto } from "../dtos/dropdown.dto"
import { CreateSparePartFromExcelDto, GetSparePartDto, GetSparePartForEditDto } from "../dtos/spare.part.dto"
import xlsx from "xlsx";
import SaveFileOnDisk from "../utils/SaveExcel"
import { ISparePart, SparePart } from "../models/spare parts/spare.part.model"
import { Machine } from "../models/machines/machine.model"

export const CreateSparePart = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        partno
    } = req.body as GetSparePartForEditDto
    if (!name || !partno) {
        return res.status(400).json({ message: "please fill all required fields" })
    }

    if (await SparePart.findOne({ name: name.toLowerCase() }))
        return res.status(400).json({ message: "already exists this part" })

    await new SparePart({
        name, partno,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json({ message: "success" })

}
export const UpdateSparePart = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let partTmp = await SparePart.findById(id)
    if (!partTmp)
        return res.status(404).json({ message: "part not found" })
    let body = JSON.parse(req.body.body)
    const {
        name,
        partno } = body as GetSparePartForEditDto
    if (!name || !partno) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    if (partTmp.name !== name.toLowerCase())
        if (await SparePart.findOne({ name: name.toLowerCase() }))
            return res.status(400).json({ message: "already exists this part" })
    partTmp.name = name;
    partTmp.updated_at = new Date();
    partTmp.partno = partno;
    if (req.user)
        partTmp.updated_by = req.user

    return res.status(200).json({ message: "updated" })

}
export const ToogleBlockSparePart = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "part id not valid" })
    let part = await SparePart.findById(id);
    if (!part) {
        return res.status(404).json({ message: "part not found" })
    }
    part.is_active = !part.is_active;
    await part.save();
    return res.status(200).json({ message: "success" })
}

export const GetAllSpareParts = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let parts: ISparePart[] = []
    let result: GetSparePartDto[] = []
    parts = await SparePart.find({ is_active: showhidden == 'false' }).populate('compatible_machines').populate('created_by').populate('updated_by').sort('-created_at')

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i]
        result.push({
            _id: part._id,
            name: part.name,
            partno: part.partno,
            photos: part.photos ? part.photos.map((u) => { return u?.public_url || "" }) : [""],
            compatible_machines: part.compatible_machines && part.compatible_machines.map((m) => { return m.name }).toString(),
            is_active: part.is_active,
            created_at: moment(part.created_at).format("DD/MM/YYYY"),
            updated_at: moment(part.updated_at).format("DD/MM/YYYY"),
            created_by: part.created_by.username,
            updated_by: part.updated_by.username
        })
    }
    return res.status(200).json(result)
}

export const GetSparePartForEdit = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let partTmp = await SparePart.findById(id)
    if (!partTmp)
        return res.status(404).json({ message: "part not found" })

    let result: GetSparePartForEditDto = {
        _id: partTmp._id,
        name: partTmp.name,
        partno: partTmp.partno
    }
    return res.status(200).json(result)
}

export const GetSparePartsForDropdown = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let parts: ISparePart[] = []
    let result: DropDownDto[] = []
    parts = await SparePart.find({ is_active: showhidden == 'false' }).populate('created_by').populate('updated_by').sort('-created_at')
    result = parts.map((c) => { return { id: c._id, label: c.name, value: c.name } })

    return res.status(200).json(result)
}

export const CreateSparePartFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: CreateSparePartFromExcelDto[] = []
    let statusText: string = ""
    if (!req.file)
        return res.status(400).json({
            message: "please provide an Excel file",
        });
    if (req.file) {
        const allowedFiles = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only excel and csv are allowed to upload` })
        if (req.file.size > 100 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :100mb` })
        const workbook = xlsx.read(req.file.buffer);
        let workbook_sheet = workbook.SheetNames;
        let workbook_response: CreateSparePartFromExcelDto[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }
        for (let i = 0; i < workbook_response.length; i++) {
            let part = workbook_response[i]
            let name: string | null = part.name
            let partno: string | null = part.partno
            let compatible_machines: string | null = part.compatible_machines
            let validated = true

            //important
            if (!name) {
                validated = false
                statusText = "required name"
            }
            if (!partno) {
                validated = false
                statusText = "required partno"
            }

            if (await SparePart.findOne({ name: name.trim().toLowerCase() })) {
                validated = false
                statusText = "part already exists"
            }
            if (await SparePart.findOne({ partno: partno.trim().toLowerCase() })) {
                validated = false
                statusText = "part with this partno already exists"
            }
            let machines: string[] = [];
            let machineids: string[] = [];
            if (compatible_machines) {
                machines = compatible_machines.split(",");
                for (let i = 0; i < machines.length; i++) {
                    let machine = await Machine.findOne({ name: machines[i] })
                    if (machine)
                        machineids.push(machine._id)
                }
            }
            if (validated) {
                await new SparePart({
                    name,
                    partno,
                    compatible_machines: machineids,
                    created_by: req.user,
                    updated_by: req.user,
                    updated_at: new Date(Date.now()),
                    created_at: new Date(Date.now())
                }).save()
                statusText = "success"
            }
            result.push({
                ...part,
                status: statusText
            })
        }
    }
    return res.status(200).json(result);
}

export const DownloadExcelTemplateForCreateSpareParts = async (req: Request, res: Response, next: NextFunction) => {
    let part: CreateSparePartFromExcelDto = {
        name: "part1",
        partno: "part124",
        compatible_machines: "m1,m2"
    }
    SaveFileOnDisk([part])
    let fileName = "CreateSparePartTemplate.xlsx"
    return res.download("./file", fileName)
}

export const UploadSparePartPhotos = async (req: Request, res: Response, next: NextFunction) => {

}