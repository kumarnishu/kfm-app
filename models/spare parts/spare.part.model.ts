import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IMachine } from "../machines/machine.model"

export type ISparePart = {
    _id: string,
    name: string,
    partno: string,
    photo: Asset,
    compatible_machines: IMachine[]
    price: number,
    is_active: boolean,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const SparePartSchema = new mongoose.Schema<ISparePart, mongoose.Model<ISparePart, {}, {}>, {}>({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    partno: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    compatible_machines: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Machine'
        }
    ],
    photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    },
    price: {
        type: Number, default: 0
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

export const SparePart = mongoose.model<ISparePart, mongoose.Model<ISparePart, {}, {}>>("SparePart", SparePartSchema)