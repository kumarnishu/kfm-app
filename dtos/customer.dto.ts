export type GetCustomerForEditDto = {
    _id?:string,
    name: string,
    address: string,
}

export type CreateCustomerFromExcelDto = {
    name: string,
    address: string,
    status?:string
}


export type GetCustomerDto = {
    _id: string,
    name: string,
    address: string,
    is_active: boolean,
    users: number,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string
}




