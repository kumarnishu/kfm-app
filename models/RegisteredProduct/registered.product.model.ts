import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IMachine } from "../machines/machine.model"
import { ICompany } from "../companies/company.model"

export type IRegisteredProduct = {
    _id: string,
    slno: string,
    machine: IMachine,
    customer: ICompany,
    warrantyUpto: Date,
    isInstalled: boolean,
    InstallationDate: Date,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const RegisteredProductSchema = new mongoose.Schema<IRegisteredProduct, mongoose.Model<IRegisteredProduct, {}, {}>, {}>({
    slno: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    warrantyUpto: Date,
    isInstalled: { type: Boolean, default: false },
    InstallationDate: Date,
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },

    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const RegisteredProduct = mongoose.model<IRegisteredProduct, mongoose.Model<IRegisteredProduct, {}, {}>>("RegisteredProduct", RegisteredProductSchema)