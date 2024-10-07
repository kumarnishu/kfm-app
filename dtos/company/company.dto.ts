import { DropDownDto } from "../common/dropdown.dto"
import { createOrEditUserDto } from "../users/user.dto"

export type createOrEditCompanyDto = {
   company:string,
   address:string,
   users:createOrEditUserDto[]
}

export type GetCompanyDto={
    _id:string,
    company:string,
    address:string,
    is_active:boolean,
    users:number,
    created_at: string,
    updated_at: string,
    created_by: DropDownDto,
    updated_by: DropDownDto
}




