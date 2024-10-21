import { IMenu } from "../dtos/user.dto";

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
    let partMenu: IMenu = {
        label: 'SparePart',
        permissions: [{
            value: 'part_menu',
            label: 'SparePart Button'
        }],
        menues: [

            {
                label: 'SparePart',
                permissions: [
                    {
                        value: 'part_view',
                        label: 'view'
                    },
                    {
                        value: 'part_create',
                        label: 'create'
                    },
                    {
                        value: 'part_edit',
                        label: 'edit'
                    },
                    {
                        value: 'part_delete',
                        label: 'delete'
                    },
                    {
                        value: 'part_export',
                        label: 'export'
                    }
                ]
            }
        ]
    }
    let customerMenu: IMenu = {
        label: 'Customer',
        permissions: [{
            value: 'customer_menu',
            label: 'Customer Button'
        }],
        menues: [

            {
                label: 'Customer',
                permissions: [
                    {
                        value: 'customer_view',
                        label: 'view'
                    },
                    {
                        value: 'customer_create',
                        label: 'create'
                    },
                    {
                        value: 'customer_edit',
                        label: 'edit'
                    },
                    {
                        value: 'customer_delete',
                        label: 'delete'
                    },
                    {
                        value: 'customer_export',
                        label: 'export'
                    }
                ]
            }
        ]
    }

    permissions.push(customerMenu)
    permissions.push(machineMenu)
    permissions.push(partMenu)
    return permissions;
}