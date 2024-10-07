import { NextFunction, Request, Response } from "express"
import { createOrEditCompanyDto, GetCompanyDto } from "../dtos/company/company.dto"
import { Company, ICompany } from "../models/companies/company.model"
import { User } from "../models/users/user.model"
import isEmail from "validator/lib/isEmail"
import isMongoId from "validator/lib/isMongoId"
import moment from "moment"
import { DropDownDto } from "../dtos/common/dropdown.dto"
import { createOrEditUserDto } from "../dtos/users/user.dto"

export const Createcompany = async (req: Request, res: Response, next: NextFunction) => {
    let body = JSON.parse(req.body.body)
    const {
        company,
        address,
        users } = body as createOrEditCompanyDto
    if (!company || !address) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    let companyTmp;

    if (await Company.findOne({ name: company.toLowerCase() }))
        return res.status(400).json({ message: "already exists this company" })

    for (let i = 0; i < users.length; i++) {
        let username = users[i].username;
        let email = users[i].email
        let password = users[i].password
        let mobile = users[i].mobile
        // validations
        if (!username || !email || !password || !mobile)
            return res.status(400).json({ message: `fill all the required fields for${username}` });
        if (!isEmail(email))
            return res.status(400).json({ message: "please provide valid email" });
        if (await User.findOne({ username: username.toLowerCase().trim() }))
            return res.status(403).json({ message: `${username} already exists` });
        if (await User.findOne({ email: email.toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
        if (await User.findOne({ mobile: mobile }))
            return res.status(403).json({ message: `${mobile} already exists` });
    }

    companyTmp = new Company({
        name: company, address,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user,
        updated_by: req.user
    })


    for (let i = 0; i < users.length; i++) {
        let username = users[i].username;
        let email = users[i].email
        let password = users[i].password
        let mobile = users[i].mobile
        await new User({
            username,
            password,
            email,
            orginal_password: password,
            mobile,
            company: companyTmp._id,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
    }
    await companyTmp.save()
    return res.status(201).json({ message: "success" })

}

export const Updatecompany = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    let companyTmp = await Company.findById(id)
    if (!companyTmp)
        return res.status(404).json({ message: "company not found" })
    let body = JSON.parse(req.body.body)
    const {
        company,
        address } = body as createOrEditCompanyDto
    if (!company || !address) {
        return res.status(400).json({ message: "please fill all required fields" })
    }
    if (companyTmp.name !== company.toLowerCase())
        if (await Company.findOne({ name: company.toLowerCase() }))
            return res.status(400).json({ message: "already exists this company" })
    companyTmp.name = company;
    companyTmp.updated_at = new Date();
    companyTmp.address = address;
    if (req.user)
        companyTmp.updated_by = req.user

    return res.status(200).json({ message: "updated" })

}
export const ToogleCompanyStatus = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(403).json({ message: "company id not valid" })
    let company = await Company.findById(id);
    if (!company) {
        return res.status(404).json({ message: "company not found" })
    }
    company.is_active = !company.is_active;
    await company.save();
    return res.status(200).json({ message: "company status changed successfully" })
}

export const GetUsersOfACompany = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "lead id not valid" })
    let company = await Company.findById(id);
    if (!company) {
        return res.status(404).json({ message: "company not found" })
    }
    let users = await User.find({ company: id }).sort('username')
    let result: createOrEditUserDto[] = []
    result = users.map((u) => {
        return {
            _id: u._id,
            username: u.username,
            email: u.email,
            password: u.orginal_password,
            mobile: u.mobile
        }
    })
    return res.status(200).json(result)
}
export const GetAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let companies: ICompany[] = []
    let result: GetCompanyDto[] = []
    companies = await Company.find({ is_active: showhidden == 'false' }).populate('created_by').populate('updated_by').sort('-created_at')

    for (let i = 0; i < companies.length; i++) {
        let company = companies[i]
        let users = await User.find({ company: company._id }).sort('username')
        result.push({
            company: company.name,
            _id: company._id,
            is_active: Boolean(company.is_active),
            address: company.address,
            users: users.length || 0,
            created_at: moment(company.created_at).format("DD/MM/YYYY"),
            updated_at: moment(company.updated_at).format("DD/MM/YYYY"),
            created_by: { id: company.created_by._id, label: company.created_by.username, value: company.created_by.username },
            updated_by: { id: company.updated_by._id, label: company.updated_by.username, value: company.updated_by.username },
        })
    }
    return res.json(result)
}
export const GetAllCompaniesForDropDown = async (req: Request, res: Response, next: NextFunction) => {

    let companies: ICompany[] = []
    let result: DropDownDto[] = []
    companies = await Company.find({ is_active: true }).populate('created_by').populate('updated_by').sort('-created_at')
    result = companies.map((c) => { return { id: c._id, label: c.name, value: c.name } })

    return res.json(result)
}