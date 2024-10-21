import { NextFunction, Request, Response } from "express"
import isMongoId from "validator/lib/isMongoId"
import moment from "moment"
import { DropDownDto } from "../dtos/dropdown.dto"
import { CreateMachineFromExcelDto, GetMachineDto, GetMachineForEditDto } from "../dtos/machine.dto"
import xlsx from "xlsx";
import SaveFileOnDisk from "../utils/SaveExcel"
import { IMachine, Machine } from "../models/machines/machine.model"

export const CreateMachine = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        model
    } = req.body as GetMachineForEditDto
    if (!name || !model) {
        return res.status(400).json({ message: "please fill all required fields" })
    }

    if (await Machine.findOne({ name: name.toLowerCase() }))
        return res.status(400).json({ message: "already exists this machine" })

    await new Machine({
        name, model,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json({ message: "success" })

}
export const UpdateMachine = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let machineTmp = await Machine.findById(id)
    if (!machineTmp)
        return res.status(404).json({ message: "machine not found" })
    const {
        name,
        model } = req.body as GetMachineForEditDto
    if (!name || !model) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    if (machineTmp.name !== name.toLowerCase())
        if (await Machine.findOne({ name: name.toLowerCase() }))
            return res.status(400).json({ message: "already exists this machine" })
    machineTmp.name = name;
    machineTmp.updated_at = new Date();
    machineTmp.model = model;
    if (req.user)
        machineTmp.updated_by = req.user
    await machineTmp.save()
    return res.status(200).json({ message: "updated" })

}
export const ToogleBlockMachine = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "machine id not valid" })
    let machine = await Machine.findById(id);
    if (!machine) {
        return res.status(404).json({ message: "machine not found" })
    }
    machine.is_active = !machine.is_active;
    await machine.save();
    return res.status(200).json({ message: "success" })
}

export const GetAllMachines = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let machines: IMachine[] = []
    let result: GetMachineDto[] = []
    machines = await Machine.find({ is_active: showhidden == 'false' }).populate('created_by').populate('updated_by').sort('-created_at')

    for (let i = 0; i < machines.length; i++) {
        let machine = machines[i]
        result.push({
            _id: machine._id,
            name: machine.name,
            model: machine.model,
            photo: machine.photo?.public_url || "",
            is_active: machine.is_active,
            created_at: moment(machine.created_at).format("DD/MM/YYYY"),
            updated_at: moment(machine.updated_at).format("DD/MM/YYYY"),
            created_by: machine.created_by.username,
            updated_by: machine.updated_by.username
        })
    }
    return res.status(200).json(result)
}

export const GetMachineForEdit = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    if (!isMongoId(id)) {
        return res.status(404).json({ message: "invalid id" })
    }
    let machineTmp = await Machine.findById(id)
    if (!machineTmp)
        return res.status(404).json({ message: "machine not found" })

    let result: GetMachineForEditDto = {
        _id: machineTmp._id,
        name: machineTmp.name,
        model: machineTmp.model
    }
    return res.status(200).json(result)
}

export const GetMachinesForDropdown = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let machines: IMachine[] = []
    let result: DropDownDto[] = []
    machines = await Machine.find({ is_active: showhidden == 'false' }).populate('created_by').populate('updated_by').sort('-created_at')
    result = machines.map((c) => { return { id: c._id, label: c.name, value: c.name } })

    return res.status(200).json(result)
}

export const CreateMachineFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: CreateMachineFromExcelDto[] = []
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
        let workbook_response: CreateMachineFromExcelDto[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }
        for (let i = 0; i < workbook_response.length; i++) {
            let machine = workbook_response[i]
            let name: string | null = machine.name
            let model: string | null = machine.model
            let validated = true

            //important
            if (!name) {
                validated = false
                statusText = "required name"
            }
            if (!model) {
                validated = false
                statusText = "required model"
            }

            if (await Machine.findOne({ name: name.trim().toLowerCase() })) {
                validated = false
                statusText = "machine already exists"
            }
            if (await Machine.findOne({ model: model.trim().toLowerCase() })) {
                validated = false
                statusText = "machine with this model already exists"
            }

            if (validated) {
                await new Machine({
                    name,
                    model,
                    created_by: req.user,
                    updated_by: req.user,
                    updated_at: new Date(Date.now()),
                    created_at: new Date(Date.now())
                }).save()
                statusText = "success"
            }
            result.push({
                ...machine,
                status: statusText
            })
        }
    }
    return res.status(200).json(result);
}

export const DownloadExcelTemplateForCreateMachines = async (req: Request, res: Response, next: NextFunction) => {
    let machine: CreateMachineFromExcelDto = {
        name: "m1,delhi",
        model: "m124"
    }
    SaveFileOnDisk([machine])
    let fileName = "CreateMachineTemplate.xlsx"
    return res.download("./file", fileName)
}

export const UploadMachinePhoto = async (req: Request, res: Response, next: NextFunction) => {

}