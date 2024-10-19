export type GetSparePartForEditDto = {
    _id?: string,
    name: string,
    partno: string,
}

export type CreateSparePartFromExcelDto = {
    name: string,
    partno: string,
    compatible_machines: string,
    status?: string
}

export type GetSparePartDto = {
    _id: string,
    name: string,
    partno: string,
    photo: string,
    compatible_machines: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
}




