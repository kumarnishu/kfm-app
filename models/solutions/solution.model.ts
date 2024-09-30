import mongoose from "mongoose"
import { Asset, IUser } from "../users/user.model"
import { IProblem } from "../problems/problem.model"

export type ISolution = {
    _id: string,
    description: string,
    problem: IProblem,
    photo: Asset,
    video: Asset,
    created_at: Date,
    updated_at: Date,
    created_by: IUser,
    updated_by: IUser
}


const SolutionSchema = new mongoose.Schema<ISolution, mongoose.Model<ISolution, {}, {}>, {}>({
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
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

export const Solution = mongoose.model<ISolution, mongoose.Model<ISolution, {}, {}>>("Solution", SolutionSchema)