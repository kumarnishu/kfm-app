import mongoose from "mongoose"

export type ICompany = {
    _id: string,
    name: string,
    address: string,
    is_active: Boolean,
    created_at: Date,
    updated_at: Date,
    created_by: ICompany,
    updated_by: ICompany
}


const CompanySchema = new mongoose.Schema<ICompany, mongoose.Model<ICompany, {}, {}>, {}>({
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
        ref: 'Company',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },

    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
})

export const Company = mongoose.model<ICompany, mongoose.Model<ICompany, {}, {}>>("Company", CompanySchema)