import mongoose from "mongoose"
import { Asset } from "../users/user.model"
import { IMachine } from "../machines/machine.model"

export type ISpareParts = {
    _id: string,
    name: string,
    partno: string,
    photo: Asset,
    compatible_machines: IMachine[]
    price: number,
    is_active: Boolean,
    created_at: Date,
    updated_at: Date,
    created_by: ISpareParts,
    updated_by: ISpareParts
}


const SparePartsSchema = new mongoose.Schema<ISpareParts, mongoose.Model<ISpareParts, {}, {}>, {}>({
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

export const SpareParts = mongoose.model<ISpareParts, mongoose.Model<ISpareParts, {}, {}>>("SpareParts", SparePartsSchema)