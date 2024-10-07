import { apiClient } from "./utils/AxiosInterceptor";


export const CreateOrEditCompany = async ({ id, body }: { id?: string, body: FormData }) => {
    if (id)
        return await apiClient.put(`companies/${id}`, body);
    return await apiClient.post("companies", body);
};
export const GetCompanies = async ({ hidden }: { hidden: string }) => {
    return await apiClient.get(`companies/?hidden=${hidden}`);
};

export const ToogleCompanyStatus = async ({ id }: { id: string }) => {
    return await apiClient.patch(`companies/${id}`);
};

export const GetUsersOfACompany = async ({ id }: { id?: string }) => {
    return await apiClient.get(`company/users/${id}`)
}

export const GetCompaniesForDropDown = async () => {
    return await apiClient.get(`companies/dropdown`)
}


