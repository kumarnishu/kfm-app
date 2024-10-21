import { GetMachineForEditDto } from "../dtos/machine.dto";
import { apiClient } from "./utils/AxiosInterceptor";



export const CreateOrEditMachine = async ({ id, body }: { id?: string, body: GetMachineForEditDto }) => {
    if (id)
        return await apiClient.put(`machines/${id}`, body);
    return await apiClient.post("machines", body);
};



export const GetAllMachines = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`machines/?hidden=${hidden}`)
}

export const GetMachinesForDropdown = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`dropdown/machines/?hidden=${hidden}`)
}


export const GetMachineForEdit = async (id: string) => {
    return await apiClient.get(`machines/${id}`)
}


// block user
export const ToogleBlockMachine = async (id: string) => {
    return await apiClient.patch(`toogle-block-machine/${id}`)
}



export const CreateMachineFromExcel = async (body: FormData) => {
    return await apiClient.post("create-from-excel/machines", body);
};

export const DownloadExcelTemplateForCreateMachines = async () => {
    return await apiClient.get("download/template/machines");
};