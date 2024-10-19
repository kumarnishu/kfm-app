export type GetMachineForEditDto = {
    _id?: string,
    name: string,
    model: string,
}

export type CreateMachineFromExcelDto = {
    name: string,
    model: string,
    status?: string
}

export type GetMachineDto = {
    _id: string,
    name: string,
    model: string,
    photo: string,
    is_active: boolean,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
}




