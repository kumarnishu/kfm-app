import mongoose from "mongoose"
import { IUser } from "../users/user.model"
import { IRegisteredProduct } from "../RegisteredProduct/registered.product.model"

export type IServiceRequest = {
    _id: string,
    description: string,
    registered_product: IRegisteredProduct,
    paymentMode: string,
    paymentDate: Date,
    payable_amount: Number,
    paid_amount: Number,
    engineer: IUser,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const ServiceRequestSchema = new mongoose.Schema<IServiceRequest, mongoose.Model<IServiceRequest, {}, {}>, {}>({
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    paymentMode: {
        type: String,
        trim: true,
        lowercase: true,
    },
    payable_amount: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    registered_product:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisteredProduct',
        required: true
    },
    paymentDate: Date,
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    engineer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

export const ServiceRequest = mongoose.model<IServiceRequest, mongoose.Model<IServiceRequest, {}, {}>>("ServiceRequest", ServiceRequestSchema)