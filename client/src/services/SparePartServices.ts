import { GetSparePartForEditDto } from "../dtos/spare.part.dto";
import { apiClient } from "./utils/AxiosInterceptor";



export const CreateOrEditSparePart = async ({ id, body }: { id?: string, body: GetSparePartForEditDto }) => {
    if (id)
        return await apiClient.put(`parts/${id}`, body);
    return await apiClient.post("parts", body);
};



export const GetAllSpareParts = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`parts/?hidden=${hidden}`)
}

export const GetSparePartsForDropdown = async ({ hidden }: { hidden: boolean }) => {
    return await apiClient.get(`dropdown/parts/?hidden=${hidden}`)
}


export const GetSparePartForEdit = async (id: string) => {
    return await apiClient.get(`parts/${id}`)
}


// block user
export const ToogleBlockSparePart = async (id: string) => {
    return await apiClient.patch(`toogle-block-part/${id}`)
}



export const CreateSparePartFromExcel = async (body: FormData) => {
    return await apiClient.post("create-from-excel/parts", body);
};

export const DownloadExcelTemplateForCreateSpareParts = async () => {
    return await apiClient.get("download/template/parts");
};