import { NextFunction, Request, Response } from "express"
import { User } from "../models/users/user.model"
import isMongoId from "validator/lib/isMongoId"
import moment from "moment"
import { DropDownDto } from "../dtos/dropdown.dto"
import { CreateCustomerFromExcelDto, GetCustomerDto, GetCustomerForEditDto } from "../dtos/customer.dto"
import { Customer, ICustomer } from "../models/customer/customer.model"
import xlsx from "xlsx";
import SaveFileOnDisk from "../utils/SaveExcel"

export const CreateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        address
    } = req.body as GetCustomerForEditDto
    if (!name || !address) {
        return res.status(400).json({ message: "please fill all required fields" })
    }

    if (await Customer.findOne({ name: name.toLowerCase() }))
        return res.status(400).json({ message: "already exists this customer" })

    await new Customer({
        name: name, address,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    }).save()
    return res.status(201).json({ message: "success" })

}
export const UpdateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let customerTmp = await Customer.findById(id)
    if (!customerTmp)
        return res.status(404).json({ message: "customer not found" })

    const {
        name,
        address } = req.body as GetCustomerForEditDto
    if (!name || !address) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    if (customerTmp.name !== name.toLowerCase())
        if (await Customer.findOne({ name: name.toLowerCase() }))
            return res.status(400).json({ message: "already exists this customer" })
    customerTmp.name = name;
    customerTmp.updated_at = new Date();
    customerTmp.address = address;
    if (req.user)
        customerTmp.updated_by = req.user
    await customerTmp.save()
    return res.status(200).json({ message: "updated" })

}
export const ToogleBlockCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "customer id not valid" })
    let customer = await Customer.findById(id);
    if (!customer) {
        return res.status(404).json({ message: "customer not found" })
    }
    customer.is_active = !customer.is_active;
    await customer.save();
    return res.status(200).json({ message: "success" })
}

export const GetAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let customers: ICustomer[] = []
    let result: GetCustomerDto[] = []
    customers = await Customer.find({ is_active: showhidden == 'false' }).populate('created_by').populate('updated_by').sort('-created_at')

    for (let i = 0; i < customers.length; i++) {
        let customer = customers[i]
        let users = await User.find({ customer: customer._id }).sort('username')
        result.push({
            _id: customer._id,
            name: customer.name,
            is_active: customer.is_active,
            address: customer.address,
            users: users.length || 0,
            created_at: moment(customer.created_at).format("DD/MM/YYYY"),
            updated_at: moment(customer.updated_at).format("DD/MM/YYYY"),
            created_by: customer.created_by.username,
            updated_by: customer.updated_by.username
        })
    }
    return res.status(200).json(result)
}

export const GetCustomerForEdit = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id

    if (!isMongoId(id))
        return res.status(404).json({ message: "invalid id" })
    let customerTmp = await Customer.findById(id)
    if (!customerTmp)
        return res.status(404).json({ message: "customer not found" })

    let result: GetCustomerForEditDto = {
        _id: customerTmp._id,
        name: customerTmp.name,
        address: customerTmp.address
    }
    return res.status(200).json(result)
}

export const GetCustomersForDropdown = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let customers: ICustomer[] = []
    let result: DropDownDto[] = []
    customers = await Customer.find({ is_active: showhidden == 'false' }).populate('created_by').populate('updated_by').sort('-created_at')
    result = customers.map((c) => { return { id: c._id, label: c.name, value: c.name } })

    return res.status(200).json(result)
}

export const CreateCustomerFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: CreateCustomerFromExcelDto[] = []
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
        let workbook_response: CreateCustomerFromExcelDto[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }
        for (let i = 0; i < workbook_response.length; i++) {
            let customer = workbook_response[i]
            let name: string | null = customer.name
            let address: string | null = customer.address
            let validated = true

            //important
            if (!name) {
                validated = false
                statusText = "required name"
            }
            if (!address) {
                validated = false
                statusText = "required address"
            }

            if (await Customer.findOne({ name: name.trim().toLowerCase() })) {
                validated = false
                statusText = "customer already exists"
            }

            if (validated) {
                await new Customer({
                    name,
                    address,
                    created_by: req.user,
                    updated_by: req.user,
                    updated_at: new Date(Date.now()),
                    created_at: new Date(Date.now())
                }).save()
                statusText = "success"
            }
            result.push({
                ...customer,
                status: statusText
            })
        }
    }
    return res.status(200).json(result);
}

export const DownloadExcelTemplateForCreateCustomers = async (req: Request, res: Response, next: NextFunction) => {
    let customer: CreateCustomerFromExcelDto = {
        name: "abc footwear,delhi",
        address: "chawri bajar,delhi"
    }
    SaveFileOnDisk([customer])
    let fileName = "CreateCustomerTemplate.xlsx"
    return res.download("./file", fileName)
}