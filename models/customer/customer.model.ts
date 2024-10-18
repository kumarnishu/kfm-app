import mongoose from "mongoose"
import { IUser } from "../users/user.model"

export type ICustomer = {
    _id: string,
    name: string,
    address: string,
    is_active: boolean,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const CustomerSchema = new mongoose.Schema<ICustomer, mongoose.Model<ICustomer, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    address: {
        type: String,
        trim: true,
        lowercase: true,
    },
    is_active: {
        type: Boolean,
        default: true,
        required: true
    },
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

export const Customer = mongoose.model<ICustomer, mongoose.Model<ICustomer, {}, {}>>("Customer", CustomerSchema)