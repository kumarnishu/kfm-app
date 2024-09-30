import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IServiceRequest } from "../service requests/service.request.model"

export type IProblem = {
    _id: string,
    description: string,
    servicerequest: IServiceRequest,
    photo: Asset,
    video:Asset,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const ProblemSchema = new mongoose.Schema<IProblem, mongoose.Model<IProblem, {}, {}>, {}>({
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    servicerequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRequest',
        required: true
    },
    photo: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
    },
    video: {
        _id: { type: String },
        filename: { type: String },
        public_url: { type: String },
        content_type: { type: String },
        size: { type: String },
        bucket: { type: String },
        created_at: Date
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

export const Problem = mongoose.model<IProblem, mongoose.Model<IProblem, {}, {}>>("Problem", ProblemSchema)