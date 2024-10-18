import { NextFunction, Request, Response } from 'express';
import { uploadFileToCloud } from '../utils/uploadFile.util';
import { deleteToken, sendUserToken } from '../middlewares/auth.middleware';
import { Asset, IUser, User } from '../models/users/user.model';
import isMongoId from "validator/lib/isMongoId";
import isEmail from "validator/lib/isEmail";
import isNumeric from "validator/lib/isNumeric";
import { destroyFile } from "../utils/destroyFile.util";
import { sendEmail } from '../utils/sendEmail.util';
import { FetchAllPermissions } from '../utils/fillAllPermissions';
import { AssignPermissionToOneUserDto, AssignSimilarPermissionToMultipleUsersDto, AssignUsersDto, CreateUserFromExcelDto, GetUserDto, GetUserForEditDto, IMenu, LoginDto, ResetPasswordDto, SendOrVerifyEmailDto, UpdatePasswordDto, UpdateProfileDto } from '../dtos/user.dto';
import moment from 'moment';
import { DropDownDto } from '../dtos/dropdown.dto';
import xlsx from "xlsx";
import SaveFileOnDisk from '../utils/SaveExcel';
import { Customer } from '../models/customer/customer.model';


export const GetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let perm = req.query.permission
    let show_assigned_only = req.query.show_assigned_only
    let result: GetUserDto[] = []
    let users: IUser[] = [];

    if (show_assigned_only == 'true') {
        let ids = req.user?.assigned_users.map((id) => { return id._id })
        users = await User.find({ is_active: showhidden == 'false', _id: { $in: ids } }).populate("created_by").populate("updated_by").populate("customer").populate('assigned_users').sort('-last_login')
    }
    else {
        users = await User.find({ is_active: showhidden == 'false' }).populate("created_by").populate("updated_by").populate("customer").populate('assigned_users').sort('-last_login')
    }
    if (perm) {
        users = users.filter((u) => { return u.assigned_permissions.includes(String(perm)) })
    }
    result = users.map((u) => {
        return {
            _id: u._id,
            username: u.username,
            email: u.email,
            mobile: u.mobile,
            customer: u.customer ? u.customer.name : "",
            dp: u.dp?.public_url || "",
            orginal_password: u.orginal_password,
            is_admin: u.is_admin,
            email_verified: u.email_verified,
            mobile_verified: u.mobile_verified,
            is_active: u.is_active,
            last_login: moment(u.last_login).format("lll"),
            is_multi_login: u.is_multi_login,
            assigned_users: u.assigned_users.map((u) => {
                return u.username
            }).toString(),
            assigned_permissions: u.assigned_permissions,
            created_at: moment(u.created_at).format("DD/MM/YYYY"),
            updated_at: moment(u.updated_at).format("DD/MM/YYYY"),
            created_by: u.created_by.username,
            updated_by: u.updated_by.username
        }
    })
    return res.status(200).json(result)
}

export const GetUsersForDropdown = async (req: Request, res: Response, next: NextFunction) => {
    let showhidden = req.query.hidden
    let perm = req.query.permission
    let show_assigned_only = req.query.show_assigned_only
    let result: DropDownDto[] = []
    let users: IUser[] = [];

    if (show_assigned_only == 'true') {
        let ids = req.user?.assigned_users.map((id) => { return id._id })
        users = await User.find({ is_active: showhidden == 'false', _id: { $in: ids } }).populate("created_by").populate("updated_by").populate("customer").populate('assigned_users').sort('-last_login')
    }
    else {
        users = await User.find({ is_active: showhidden == 'false' }).populate("created_by").populate("updated_by").populate("customer").populate('assigned_users').sort('-last_login')
    }
    if (perm) {
        users = users.filter((u) => { return u.assigned_permissions.includes(String(perm)) })
    }
    result = users.map((u) => {
        return {
            id: u._id,
            label: u.username,
            value: u.username
        }
    })
    return res.status(200).json(result)
}

export const GetProfile = async (req: Request, res: Response, next: NextFunction) => {
    let result: GetUserDto | null = null;
    const user = await User.findById(req.user?._id).populate("created_by").populate("customer").populate("updated_by").populate('assigned_users')
    if (user)
        result = {
            _id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            customer: user.customer && user.customer.name || "",
            dp: user.dp?.public_url || "",
            orginal_password: user.orginal_password,
            is_admin: user.is_admin,
            email_verified: user.email_verified,
            mobile_verified: user.mobile_verified,
            is_active: user.is_active,
            last_login: moment(user.last_login).calendar(),
            is_multi_login: user.is_multi_login,
            assigned_users: user.assigned_users.map((u) => {
                return user.username
            }).toString(),
            assigned_permissions: user.assigned_permissions,
            created_at: moment(user.created_at).format("DD/MM/YYYY"),
            updated_at: moment(user.updated_at).format("DD/MM/YYYY"),
            created_by: user.created_by.username,
            updated_by: user.updated_by.username
        }
    res.status(200).json({ user: result, token: req.cookies.accessToken })
}

export const GetAssignedUsersForEdit = async (req: Request, res: Response, next: NextFunction) => {
    let result: string[] = [];
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id).populate('created_by')
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let users = await User.find({ _id: id })
    result = users.map((u) => { return u._id })

    res.status(200).json(result)
}
export const GetUserForEdit = async (req: Request, res: Response, next: NextFunction) => {
    let result: GetUserForEditDto | null = null;
    const user = await User.findById(req.user?._id).populate("created_by").populate("customer").populate("updated_by").populate('assigned_users')
    if (user)
        result = {
            _id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            customer: user.customer && user.customer._id || "",
            password: user.orginal_password,
        }
    res.status(200).json(result)
}
export const SignUp = async (req: Request, res: Response, next: NextFunction) => {
    let result: GetUserDto | null = null;
    let users = await User.find()
    if (users.length > 0)
        return res.status(400).json({ message: "not allowed" })

    let { username, email, password, mobile } = req.body as GetUserForEditDto
    // validations
    if (!username || !email || !password || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    if (!isEmail(email))
        return res.status(400).json({ message: "please provide valid email" });
    if (await User.findOne({ username: username.toLowerCase().trim() }))
        return res.status(403).json({ message: `${username} already exists` });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
        return res.status(403).json({ message: `${email} already exists` });
    if (await User.findOne({ mobile: mobile }))
        return res.status(403).json({ message: `${mobile} already exists` });

    let dp: Asset = undefined
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            dp = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }


    let owner = new User({
        username,
        password,
        email,
        mobile,
        is_admin: true,
        dp

    })
    owner.updated_by = owner
    owner.created_by = owner
    owner.created_at = new Date()
    owner.updated_at = new Date()
    sendUserToken(res, owner.getAccessToken())
    await owner.save()
    owner = await User.findById(owner._id).populate("created_by").populate("customer").populate('assigned_users').populate("updated_by") || owner
    let token = owner.getAccessToken()
    result = {
        _id: owner._id,
        username: owner.username,
        email: owner.email,
        mobile: owner.mobile,
        dp: owner.dp?.public_url || "",
        orginal_password: owner.orginal_password,
        is_admin: owner.is_admin,
        customer: "",
        email_verified: owner.email_verified,
        mobile_verified: owner.mobile_verified,
        is_active: owner.is_active,
        last_login: moment(owner.last_login).calendar(),
        is_multi_login: owner.is_multi_login,
        assigned_users: owner.assigned_users.map((u) => {
            return owner.username
        }).toString(),
        assigned_permissions: owner.assigned_permissions,
        created_at: moment(owner.created_at).format("DD/MM/YYYY"),
        updated_at: moment(owner.updated_at).format("DD/MM/YYYY"),
        created_by: owner.created_by.username,
        updated_by: owner.updated_by.username,
    }
    res.status(201).json({ user: result, token: token })
}

export const NewUser = async (req: Request, res: Response, next: NextFunction) => {
    let { username, email, password, mobile, customer } = req.body as GetUserForEditDto;
    // validations
    if (!username || !email || !password || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    if (!isEmail(email))
        return res.status(400).json({ message: "please provide valid email" });
    if (await User.findOne({ username: username.toLowerCase().trim() }))
        return res.status(403).json({ message: `${username} already exists` });
    if (await User.findOne({ email: email.toLowerCase().trim() }))
        return res.status(403).json({ message: `${email} already exists` });
    if (await User.findOne({ mobile: mobile }))
        return res.status(403).json({ message: `${mobile} already exists` });

    let dp: Asset = undefined
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc)
            dp = doc
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }


    let user = new User({
        username,
        password,
        email,
        mobile,
        is_admin: false,
        dp

    })

    if (req.user) {
        user.created_by = req.user
        user.updated_by = req.user

    }
    user.created_at = new Date()
    user.updated_at = new Date()

    await user.save()
    if (customer) {
        await User.findByIdAndUpdate(user._id, { customer })
    }
    res.status(201).json({ message: "success" })
}


export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, multi_login_token } = req.body as LoginDto
    if (!username)
        return res.status(400).json({ message: "please enter username or email" })
    if (!password)
        return res.status(400).json({ message: "please enter password" })

    let user = await User.findOne({
        username: String(username).toLowerCase().trim(),
    }).select("+password").populate("created_by").populate("customer").populate('assigned_users').populate("updated_by")

    if (!user) {
        user = await User.findOne({
            mobile: String(username).toLowerCase().trim(),
        }).select("+password").populate("created_by").populate("customer").populate('assigned_users').populate("updated_by")

    }
    if (!user) {
        user = await User.findOne({
            email: String(username).toLowerCase().trim(),
        }).select("+password").populate("created_by").populate("customer").populate('assigned_users').populate("updated_by")
        if (user)
            if (!user.email_verified)
                return res.status(403).json({ message: "please verify email id before login" })
    }
    if (!user)
        return res.status(403).json({ message: "Invalid username or password" })
    if (!user.is_active)
        return res.status(401).json({ message: "you are blocked, contact admin" })
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
        return res.status(403).json({ message: "Invalid username or password" })
    if (user.created_by._id !== user._id) {
        if (!user.is_multi_login && user.multi_login_token && user.multi_login_token !== multi_login_token)
            return res.status(403).json({ message: "Sorry ! You are already logged in on an another device,contact administrator" })
        if (!user.is_multi_login && !user.multi_login_token)
            user.multi_login_token = multi_login_token
    }

    sendUserToken(res, user.getAccessToken())
    user.last_login = new Date()
    let token = user.getAccessToken()
    user.orginal_password = password;
    await user.save();
    let result: GetUserDto | null = {
        _id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        dp: user.dp?.public_url || "",
        orginal_password: user.orginal_password,
        is_admin: user.is_admin,
        customer: user.customer ? user.customer.name : "",
        email_verified: user.email_verified,
        mobile_verified: user.mobile_verified,
        is_active: user.is_active,
        last_login: moment(user.last_login).calendar(),
        is_multi_login: user.is_multi_login,
        assigned_users: user.assigned_users.map((u) => {
            return u.username
        }).toString(),
        assigned_permissions: user.assigned_permissions,
        created_at: moment(user.created_at).format("DD/MM/YYYY"),
        updated_at: moment(user.updated_at).format("DD/MM/YYYY"),
        created_by: user.created_by.username,
        updated_by: user.updated_by.username
    }
    res.status(200).json({ user: result, token: token })
}

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    let coToken = req.cookies.accessToken
    let AuthToken = req.headers.authorization && req.headers.authorization.split(" ")[1]
    if (coToken)
        await deleteToken(res, coToken);
    if (AuthToken)
        await deleteToken(res, AuthToken);
    res.status(200).json({ message: "logged out" })
}

export const AssignUsersUnderManager = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { ids } = req.body as AssignUsersDto
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let users: IUser[] = []
    for (let i = 0; i < ids.length; i++) {
        let user = await User.findById(ids[i])
        if (user)
            users.push(user)
    }

    user.assigned_users = users
    if (req.user) {
        user.updated_by = user
    }
    await user.save();
    res.status(200).json({ message: "assigned users successfully" });
}


export const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id).populate('created_by')
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let { email, username, mobile, customer } = req.body as GetUserForEditDto;
    if (!username || !email || !mobile)
        return res.status(400).json({ message: "fill all the required fields" });
    //check username
    if (username !== user.username) {
        if (await User.findOne({ username: String(username).toLowerCase().trim() }))
            return res.status(403).json({ message: `${username} already exists` });
    }
    // check mobile
    if (mobile != user.mobile) {
        if (await User.findOne({ mobile: mobile }))
            return res.status(403).json({ message: `${mobile} already exists` });
    }
    //check email
    if (email !== user.email) {
        if (await User.findOne({ email: String(email).toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
    }

    //handle dp
    let dp = user.dp;
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })

        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (user.dp?._id)
                await destroyFile(user.dp._id)
            dp = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }
    let mobileverified = user.mobile_verified
    let emaileverified = user.email_verified
    let com = user.customer && user.customer._id;
    if (customer)
        com = customer
    if (email !== user.email)
        emaileverified = false
    if (mobile !== user.mobile)
        mobileverified = false
    await User.findByIdAndUpdate(user.id, {
        username,
        email,
        mobile,
        customer: com,
        email_verified: emaileverified,
        mobile_verified: mobileverified,
        dp,
        updated_at: new Date(),
        updated_by: user
    })
    return res.status(200).json({ message: "user updated" })
}

export const UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
    let user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    let { email, mobile } = req.body as UpdateProfileDto
    if (!email || !mobile) {
        return res.status(400).json({ message: "please fill required fields" })
    }

    if (mobile != user.mobile) {
        if (await User.findOne({ mobile: mobile }))
            return res.status(403).json({ message: `${mobile} already exists` });
    }
    if (email !== user.email) {
        if (await User.findOne({ email: String(email).toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
    }

    let dp = user.dp;
    if (req.file) {
        const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
        const storageLocation = `users/media`;
        if (!allowedFiles.includes(req.file.mimetype))
            return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
        if (req.file.size > 20 * 1024 * 1024)
            return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })

        const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
        if (doc) {
            if (user.dp?._id)
                await destroyFile(user.dp?._id)
            dp = doc
        }
        else {
            return res.status(500).json({ message: "file uploading error" })
        }
    }

    await User.findByIdAndUpdate(user.id, {
        email,
        mobile,
        dp,
        updated_at: new Date(),
        updated_by: user
    })
    return res.status(200).json({ message: "profile updated" })
}

export const UpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword, confirmPassword } = req.body as UpdatePasswordDto
    if (!oldPassword || !newPassword || !confirmPassword)
        return res.status(400).json({ message: "please fill required fields" })
    if (confirmPassword == oldPassword)
        return res.status(403).json({ message: "new password should not be same to the old password" })
    if (newPassword !== confirmPassword)
        return res.status(403).json({ message: "new password and confirm password not matched" })
    let user = await User.findById(req.user?._id).select("+password")
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched)
        return res.status(401).json({ message: "Old password is incorrect" })
    user.password = newPassword;
    user.updated_by = user
    await user.save();
    res.status(200).json({ message: "password updated" });
}

export const ChangePasswordFromAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, confirmPassword } = req.body as ResetPasswordDto
    if (!newPassword || !confirmPassword)
        return res.status(400).json({ message: "please fill required fields" })
    if (newPassword !== confirmPassword)
        return res.status(403).json({ message: "new password and confirm password not matched" })
    let id = req.params.id
    if (!isMongoId(id)) {
        return res.status(404).json({ message: "user id not valid" })
    }
    let user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    user.password = newPassword;
    user.updated_by = user
    await user.save();
    res.status(200).json({ message: "password updated" });
}


export const ToogleAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    if (user.created_by._id.valueOf() === id)
        return res.status(403).json({ message: "not allowed contact developer" })
    user.is_admin = !user.is_admin
    if (req.user) {
        user.updated_by = user
    }
    await user.save();
    res.status(200).json({ message: "success" });
}



export const ToogleMultiDeviceLogin = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    user.is_multi_login = !user.is_multi_login
    if (user.is_multi_login)
        user.multi_login_token = null
    if (req.user)
        user.updated_by = req.user
    await user.save();
    res.status(200).json({ message: "success" });
}

export const ToogleBlockUser = async (req: Request, res: Response, next: NextFunction) => {
    //update role of user
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: "user id not valid" })
    let user = await User.findById(id).populate('created_by')
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }

    if (user.created_by._id.valueOf() === id)
        return res.status(403).json({ message: "not allowed contact developer" })
    if (String(user._id) === String(req.user?._id))
        return res.status(403).json({ message: "not allowed this operation here, because you may block yourself" })
    user.is_active = !user.is_active
    if (req.user) {
        user.updated_by = user
    }
    await user.save();
    res.status(200).json({ message: "success" });
}

export const SendMailForResetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as SendOrVerifyEmailDto
    if (!email) return res.status(400).json({ message: "please provide email id" })
    const userEmail = String(email).toLowerCase().trim();
    if (!isEmail(userEmail))
        return res.status(400).json({ message: "provide a valid email" })
    let user = await User.findOne({ email: userEmail }).populate('created_by')

    if (user) {
        if (String(user._id) !== String(user.created_by._id))
            return res.status(403).json({ message: "not allowed this service" })
    }
    if (!user)
        return res.status(404).json({ message: "you have no account with this email id" })
    const resetToken = await user.getResetPasswordToken();
    await user.save();
    const resetPasswordUrl = `${process.env.HOST}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n valid for 15 minutes only \n\n\n\nIf you have not requested this email then, please ignore it.`;
    const options = {
        to: user.email,
        subject: `Bo Agarson Password Recovery`,
        message: message,
    };
    let response = await sendEmail(options);
    if (response) {
        return res.status(200).json({
            message: `Email sent to ${user.email} successfully`,
        })
    }
    else {
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await user.save();
        return res.status(500).json({ message: "email could not be sent, something went wrong" })
    }
}
export const ResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    let resetPasswordToken = req.params.token;
    const { newPassword, confirmPassword } = req.body as ResetPasswordDto;
    if (!newPassword || !confirmPassword)
        return res.status(400).json({ message: "Please fill all required fields " })
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "passwords do not matched" })
    let user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user)
        return res.status(403).json({ message: "Reset Password Token is invalid or has been expired" })

    user.password = req.body.newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    res.status(200).json({ message: "password updated" });
}
export const SendEmailVerificationLink = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as SendOrVerifyEmailDto
    if (!email)
        return res.status(400).json({ message: "please provide your email id" })
    const userEmail = String(email).toLowerCase().trim();
    if (!isEmail(userEmail))
        return res.status(400).json({ message: "provide a valid email" })
    const user = await User.findOne({ email: userEmail })
    if (!user)
        return res.status(404).json({ message: "you have no account with this email id" })
    const verifyToken = await user.getEmailVerifyToken();
    await user.save();
    const emailVerficationUrl = `${process.env.HOST}/email/verify/${verifyToken}`


    const message = `Your email verification link is :- \n\n ${emailVerficationUrl} \n\n valid for 15 minutes only \n\nIf you have not requested this email then, please ignore it.`;
    const options = {
        to: user.email,
        subject: `Bo Agarson Email Verification`,
        message,
    };

    let response = await sendEmail(options);
    if (response) {
        return res.status(200).json({
            message: `Email sent to ${user.email} successfully`,
        })
    }
    else {
        user.emailVerifyToken = null;
        user.emailVerifyExpire = null;
        await user.save();
        return res.status(500).json({ message: "email could not be sent, something went wrong" })
    }
}
export const VerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const emailVerifyToken = req.params.token;
    let user = await User.findOne({
        emailVerifyToken,
        emailVerifyExpire: { $gt: Date.now() },
    });
    if (!user)
        return res.status(403).json({ message: "Email verification Link  is invalid or has been expired" })
    user.email_verified = true;
    user.emailVerifyToken = null;
    user.emailVerifyExpire = null;
    await user.save();
    res.status(200).json({
        message: `congrats ${user.email} verification successful`
    });
}
export const AssignPermissionsToOneUser = async (req: Request, res: Response, next: NextFunction) => {
    const { permissions, user_id } = req.body as AssignPermissionToOneUserDto

    if (permissions && permissions.length === 0)
        return res.status(400).json({ message: "please select one permission " })
    if (!user_id)
        return res.status(400).json({ message: "please select  user" })

    let user = await User.findById(user_id)
    if (user) {
        user.assigned_permissions = permissions
        await user.save();
    }

    return res.status(200).json({ message: "successfull" })
}

export const AssignSimilarPermissionToMultipleUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { permissions, user_ids } = req.body as AssignSimilarPermissionToMultipleUsersDto

    if (permissions && permissions.length === 0)
        return res.status(400).json({ message: "please select one permission " })
    if (user_ids && user_ids.length === 0)
        return res.status(400).json({ message: "please select one user" })
    user_ids.forEach(async (i) => {
        let user = await User.findById(i)
        if (user) {
            user.assigned_permissions = permissions
            await user.save();
        }
    })

    return res.status(200).json({ message: "successfull" })
}


export const GetAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
    let permissions: IMenu[] = [];
    permissions = FetchAllPermissions();
    return res.status(200).json(permissions)
}

export const CreateUserFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    let result: CreateUserFromExcelDto[] = []
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
        let workbook_response: CreateUserFromExcelDto[] = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook_sheet[0]]
        );
        if (workbook_response.length > 3000) {
            return res.status(400).json({ message: "Maximum 3000 records allowed at one time" })
        }
        for (let i = 0; i < workbook_response.length; i++) {
            let user = workbook_response[i]
            let username: string | null = user.username
            let email: string | null = user.email
            let password: string | null = user.password
            let customer: string | null = user.customer
            let mobile: string | null = user.mobile

            let validated = true

            //important
            if (!mobile) {
                validated = false
                statusText = "required mobile"
            }
            if (!email) {
                validated = false
                statusText = "required email"
            }
            if (!isEmail(email)) {
                validated = false
                statusText = "invalid email"
            }
            if (!password) {
                validated = false
                statusText = "required password"
            }
            if (mobile && String(mobile).length !== 10) {
                validated = false
                statusText = "mobile must be of 10 digits"
            }
            if (!isNumeric(mobile)) {
                validated = false
                statusText = "invalid mobile"
            }

            if (mobile && String(mobile).length !== 10) {
                validated = false
                statusText = "invalid mobile"
            }

            if (await User.findOne({ username: username.trim().toLowerCase() })) {
                validated = false
                statusText = "username already exists"
            }
            if (await User.findOne({ email: email.trim().toLowerCase() })) {
                validated = false
                statusText = "email already exists"
            }
            if (await User.findOne({ mobile: mobile.trim().toLowerCase() })) {
                validated = false
                statusText = "mobile already exists"
            }
            if (validated) {
                await new User({
                    username,
                    email,
                    password,
                    mobile,
                    created_by: req.user,
                    updated_by: req.user,
                    updated_at: new Date(Date.now()),
                    created_at: new Date(Date.now())
                }).save()
                statusText = "success"
            }
            result.push({
                ...user,
                status: statusText
            })
        }
    }
    return res.status(200).json(result);
}

export const DownloadExcelTemplateForCreateUsers = async (req: Request, res: Response, next: NextFunction) => {
    let user: CreateUserFromExcelDto = {
        username: "abc",
        email: "abc@gmail.com",
        password: "h348397efie",
        customer: 'abc footwear',
        mobile: '7070705878',
    }
    let customers: { name: string }[] = (await Customer.find({ is_active: true })).map((c) => { return { name: c.name } })
    SaveFileOnDisk([user], customers)
    let fileName = "CreateUserTemplate.xlsx"
    return res.download("./file", fileName)
}

