import { IMenu } from "../dtos/users/user.dto";

export function FetchAllPermissions() {
    let permissions: IMenu[] = [];
    let machineMenu: IMenu = {
        label: 'Machine',
        permissions: [{
            value: 'machine_menu',
            label: 'Machine Button'
        }],
        menues: [
            
            {
                label: 'Machine',
                permissions: [
                    {
                        value: 'machine_view',
                        label: 'view'
                    },
                    {
                        value: 'machine_create',
                        label: 'create'
                    },
                    {
                        value: 'machine_edit',
                        label: 'edit'
                    },
                    {
                        value: 'machine_delete',
                        label: 'delete'
                    },
                    {
                        value: 'machine_export',
                        label: 'export'
                    }
                ]
            }
        ]
    }
    let companyMenu: IMenu = {
        label: 'Company',
        permissions: [{
            value: 'company_menu',
            label: 'Company Button'
        }],
        menues: [

            {
                label: 'Company',
                permissions: [
                    {
                        value: 'company_view',
                        label: 'view'
                    },
                    {
                        value: 'company_create',
                        label: 'create'
                    },
                    {
                        value: 'company_edit',
                        label: 'edit'
                    },
                    {
                        value: 'company_delete',
                        label: 'delete'
                    },
                    {
                        value: 'company_export',
                        label: 'export'
                    }
                ]
            }
        ]
    }

    permissions.push(companyMenu)
    permissions.push(machineMenu)
    return permissions;
}