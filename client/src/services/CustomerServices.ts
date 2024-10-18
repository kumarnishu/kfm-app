import { GetCustomerForEditDto } from "../dtos/customer.dto";
import { apiClient } from "./utils/AxiosInterceptor";



export const CreateOrEditCustomer = async ({ id, body }: { id?: string, body: GetCustomerForEditDto }) => {
    if (id)
        return await apiClient.put(`customers/${id}`, body);
    return await apiClient.post("customers", body);
};



export const GetAllCustomers = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`customers/?hidden=${hidden}`)
}

export const GetCustomersForDropdown = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`dropdown/customers/?hidden=${hidden}`)
}


export const GetCustomerForEdit = async (id: string) => {
    return await apiClient.get(`customers/${id}`)
}


// block user
export const ToogleBlockCustomer = async (id: string) => {
    return await apiClient.patch(`toogle-block-customer/${id}`)
}



export const CreateCustomerFromExcel = async (body: FormData) => {
    return await apiClient.post("create-from-excel/customers", body);
};

export const DownloadExcelTemplateForCreateCustomers = async () => {
    return await apiClient.get("download/template/customers");
};