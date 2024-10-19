import { Avatar, Fade, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '..'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { Assignment, Block, DeviceHubOutlined, Edit, GroupAdd, GroupRemove, Key, KeyOffOutlined, RemoveCircle, Restore } from '@mui/icons-material'
import { UserContext } from '../contexts/userContext'
import { Menu as MenuIcon } from '@mui/icons-material';
import { DownloadFile } from '../utils/DownloadFile'
import AssignPermissionsToUsersDialog from '../components/dialogs/users/AssignSimilarPermissionsToMultipleUsersDialog'
import { ChoiceContext, UserChoiceActions } from '../contexts/dialogContext'
import PopUp from '../components/popup/PopUp'
import CreateOrEditUserDialog from '../components/dialogs/users/CreateOrEditUserDialog'
import ToogleMultiDeviceLoginDialog from '../components/dialogs/users/ToogleMultiDeviceLoginDialog'
import UpdatePasswordDialog from '../components/dialogs/users/UpdatePasswordDialog'
import ChangePasswordFromAdminDialog from '../components/dialogs/users/ChangePasswordFromAdminDialog'
import AssignUsersUnderManagerDialog from '../components/dialogs/users/AssignUsersUnderManagerDialog'
import AssignPermissionsToOneUserDialog from '../components/dialogs/users/AssignPermissionsToOneUserDialog'
import ExportToExcel from '../utils/ExportToExcel'
import { GetUserDto } from '../dtos/user.dto'
import { GetAllUsers } from '../services/UserServices'
import ToogleBlockDialog from '../components/dialogs/users/ToogleBlockDialog'
import ToogleAdminDialog from '../components/dialogs/users/ToogleAdminDialog'
import { UserExcelButtons } from '../components/buttons/UserExcelButtons'

export default function UsersPage() {
    const [hidden, setHidden] = useState(false)
    const [user, setUser] = useState<GetUserDto>()
    const [users, setUsers] = useState<GetUserDto[]>([])
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", hidden], async () => GetAllUsers({ hidden: hidden, permission: undefined, show_assigned_only: false }))

    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const { user: LoggedInUser } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const columns = useMemo<MRT_ColumnDef<GetUserDto>[]>(
        //column definitions...
        () => users && [
            {
                accessorKey: 'actions',
                header: '',
                maxSize: 50,
                Cell: ({ cell }) => <PopUp
                    element={
                        <Stack direction="row">

                            {/* edit icon */}
                            {LoggedInUser?._id === cell.row.original._id ?
                                <Tooltip title="edit">
                                    <IconButton
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.create_or_edit_user })
                                            setUser(cell.row.original)
                                        }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip> :
                                <Tooltip title="edit">
                                    <IconButton
                                        disabled={cell.row.original?.created_by === cell.row.original._id}
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.create_or_edit_user })
                                            setUser(cell.row.original)
                                        }}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            }
                            {/* assign user */}
                            {LoggedInUser?._id === cell.row.original._id ?


                                <Tooltip title="assign users">
                                    <IconButton
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.assign_users })
                                            setUser(cell.row.original)
                                        }}>
                                        <Assignment />
                                    </IconButton>
                                </Tooltip> :
                                <Tooltip title="assign users">
                                    <IconButton
                                        disabled={cell.row.original?.created_by === cell.row.original._id}
                                        color="success"
                                        size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.assign_users })
                                            setUser(cell.row.original)
                                        }}>
                                        <Assignment />
                                    </IconButton>
                                </Tooltip>}
                            {/* admin icon */}
                            {LoggedInUser?.created_by === cell.row.original.username ?
                                null
                                :
                                <>
                                    {cell.row.original.is_admin ?
                                        < Tooltip title="Remove admin"><IconButton size="medium"
                                            disabled={cell.row.original?.created_by === cell.row.original._id}
                                            color="error"
                                            onClick={() => {
                                                setChoice({ type: UserChoiceActions.toogle_admin })
                                                setUser(cell.row.original)

                                            }}>
                                            <GroupRemove />
                                        </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="make admin"><IconButton size="medium"
                                            disabled={cell.row.original?.created_by === cell.row.original._id}
                                            onClick={() => {
                                                setChoice({ type: UserChoiceActions.toogle_admin })
                                                setUser(cell.row.original)

                                            }}>
                                            <GroupAdd />
                                        </IconButton>
                                        </Tooltip>}
                                </>
                            }
                            {/* multi login */}

                            {LoggedInUser?.created_by === cell.row.original._id ?
                                null :
                                <>
                                    {
                                        cell.row.original.is_multi_login ?
                                            <Tooltip title="Block multi login"><IconButton
                                                size="medium"
                                                color="error"
                                                disabled={cell.row.original?.created_by === cell.row.original._id}
                                                onClick={() => {
                                                    setChoice({ type: UserChoiceActions.toogle_multi_device_login })
                                                    setUser(cell.row.original)

                                                }}
                                            >
                                                <DeviceHubOutlined />
                                            </IconButton>
                                            </Tooltip> :
                                            <Tooltip title="Reset multi login">
                                                <IconButton
                                                    disabled={cell.row.original?.created_by === cell.row.original._id}
                                                    size="medium"
                                                    onClick={() => {
                                                        setChoice({ type: UserChoiceActions.toogle_multi_device_login })
                                                        setUser(cell.row.original)

                                                    }}
                                                >
                                                    <Restore />
                                                </IconButton>
                                            </Tooltip>
                                    }
                                </>
                            }
                            {/*  block login */}
                            {LoggedInUser?.created_by === cell.row.original._id ?
                                null :
                                <>
                                    {cell.row.original?.is_active ?
                                        <Tooltip title="block"><IconButton
                                            size="medium"
                                            disabled={cell.row.original?.created_by === cell.row.original._id}
                                            onClick={() => {
                                                setChoice({ type: UserChoiceActions.toogle_block_user })
                                                setUser(cell.row.original)

                                            }}
                                        >
                                            <Block />
                                        </IconButton>
                                        </Tooltip>
                                        :
                                        < Tooltip title="unblock">
                                            <IconButton
                                                color="warning"
                                                disabled={cell.row.original?.created_by === cell.row.original._id}
                                                size="medium"
                                                onClick={() => {
                                                    setChoice({ type: UserChoiceActions.toogle_block_user })
                                                    setUser(cell.row.original)

                                                }}>
                                                <RemoveCircle />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </>
                            }

                            {LoggedInUser?.created_by === cell.row.original._id ?
                                null
                                :
                                <Tooltip title="Change Password for this user">
                                    <IconButton
                                        disabled={cell.row.original?.created_by === cell.row.original._id} size="medium"
                                        onClick={() => {
                                            setChoice({ type: UserChoiceActions.change_password_from_admin })
                                            setUser(cell.row.original)

                                        }}>
                                        <Key />
                                    </IconButton>
                                </Tooltip>
                            }
                            <Tooltip title="Change Permissions for this user">
                                <IconButton
                                    color="info"
                                    onClick={() => {
                                        setChoice({ type: UserChoiceActions.assign_permissions })
                                        setUser(cell.row.original)

                                    }}>
                                    <KeyOffOutlined />
                                </IconButton>
                            </Tooltip>

                        </Stack>} />

            },

            {
                accessorKey: 'dp',
                header: 'DP',
                size: 50,
                Cell: (cell) => <Avatar
                    title="double click to download"
                    sx={{ width: 16, height: 16 }}
                    onDoubleClick={() => {
                        if (cell.row.original.dp && cell.row.original.dp) {
                            DownloadFile(cell.row.original.dp, "profile")
                        }
                    }}

                    alt="display picture" src={cell.row.original && cell.row.original.dp} />
            },
            {
                accessorKey: 'username',
                header: 'Name',
                size: 150,
            },
            {
                accessorKey: 'customer',
                header: 'Customer',
                size: 220,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 150,
                Cell: (cell) => <>{cell.row.original.email}</>,
            },
            {
                accessorKey: 'mobile',
                header: 'Mobile',
                size: 150,
                Cell: (cell) => <>{cell.row.original.mobile}</>,
            },
            {
                accessorKey: 'is_admin',
                header: 'Role',
                size: 150,
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                size: 150,

            },
            {
                accessorKey: 'orginal_password',
                header: 'Password',
                size: 150
            },
            {
                accessorKey: 'assigned_permissions',
                header: 'Permissions',
                size: 150,
                Cell: (cell) => <>{cell.row.original.assigned_permissions.length || 0}</>
            },

            {
                accessorKey: 'is_multi_login',
                header: 'Multi Device',
                size: 150,
                Cell: (cell) => <>{cell.row.original.is_multi_login ? "Allowed" : "Blocked"}</>
            },
            {
                accessorKey: 'assigned_users',
                header: 'Assigned Users',
                size: 150,
                Cell: (cell) => <>{cell.row.original.assigned_users || 0}</>
            },
            {
                accessorKey: 'last_login',
                header: 'Last Active',
                size: 150,
                Cell: (cell) => <>{cell.row.original.last_login || ""}</>
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                size: 150,
                Cell: (cell) => <>{cell.row.original.created_at || ""}</>
            },
            {
                accessorKey: 'created_by',
                header: 'Created By',
                size: 150,
                Cell: (cell) => <>{cell.row.original.created_by || ""}</>
            }

        ],
        [users],
        //end
    );



    const table = useMaterialReactTable({
        columns,
        data: users, //10,000 rows       
        enableColumnResizing: true,
        columnFilterDisplayMode: "popover",
        enableColumnVirtualization: true, enableStickyFooter: true,
        muiTableFooterRowProps: () => ({
            sx: {
                backgroundColor: 'whitesmoke',
                color: 'white',
                fontSize: '14px'
            }
        }),
        muiTableContainerProps: (table) => ({
            sx: { height: table.table.getState().isFullScreen ? 'auto' : '400px' }
        }),
        muiTableHeadRowProps: () => ({
            sx: {
                backgroundColor: 'whitesmoke',
                color: 'white',
                border: '1px solid lightgrey;',
                fontSize: '13px'
            },
        }),
        muiTableBodyCellProps: () => ({
            sx: {
                border: '1px solid lightgrey;',
                fontSize: '13px'
            },
        }),
        muiPaginationProps: {
            rowsPerPageOptions: [100, 200, 500, 1000],
            shape: 'rounded',
            variant: 'outlined',
        },
        initialState: {
            density: 'compact', pagination: { pageIndex: 0, pageSize: 100 }, showGlobalFilter: true
        },
        enableGrouping: true,
        enableRowSelection: true,
        manualPagination: false,
        enablePagination: true,
        enableRowNumbers: true,
        enableColumnPinning: true,
        enableTableFooter: true,
        enableRowVirtualization: true,
        onSortingChange: setSorting,
        state: { isLoading, sorting }
    });

    useEffect(() => {
        if (isSuccess && data) {
            setUsers(data.data)
        }
    }, [isSuccess, data])


    return (
        <>
            <Stack
                spacing={2}
                padding={1}
                direction="row"
                justifyContent="space-between"

            >
                <Typography
                    variant={'h6'}
                    component={'h1'}
                    sx={{ pl: 1 }}
                >
                    Users
                </Typography>

                <Stack
                    direction="row"
                    gap={4}
                >
                    <UserExcelButtons />
                    {/* user menu */}
                    <>
                        <IconButton size="small" color="primary"
                            onClick={(e) => setAnchorEl(e.currentTarget)
                            }
                            sx={{ border: 2, borderRadius: 3, marginLeft: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)
                            }
                            TransitionComponent={Fade}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            sx={{ borderRadius: 2 }}
                        >
                            {

                                <MenuItem onClick={() => {
                                    setChoice({ type: UserChoiceActions.create_or_edit_user })
                                    setAnchorEl(null)
                                    setUser(undefined)
                                }}
                                >
                                    <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                        New User
                                    </Typography>
                                </MenuItem>}


                            <MenuItem

                                onClick={() => {
                                    setChoice({ type: UserChoiceActions.close_user })
                                    if (!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()) {
                                        alert("select some users")
                                    }
                                    else {
                                        setChoice({ type: UserChoiceActions.bulk_assign_permissions })
                                    }
                                    setAnchorEl(null)
                                }}
                            >
                                <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                    Assign Permissions
                                </Typography>
                            </MenuItem>
                            <MenuItem

                                onClick={() => {
                                    setHidden(!hidden)
                                    setAnchorEl(null)
                                }}
                            >
                                <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                    {hidden ? "Show Active" : "Show Inactive"}
                                </Typography>
                            </MenuItem>


                            <MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Users Data")}
                            >  <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                    Export All
                                </Typography></MenuItem>
                            <MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Users Data")}
                            >
                                <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                    Export Selected</Typography>
                            </MenuItem>
                        </Menu>
                        <CreateOrEditUserDialog />
                        <AssignPermissionsToUsersDialog user_ids={table.getSelectedRowModel().rows.map((I) => { return I.original._id })} />
                    </>
                </Stack >
            </Stack >
            <MaterialReactTable table={table} />
            {
                user ?
                    <>

                        <ToogleMultiDeviceLoginDialog user={user} />
                        <UpdatePasswordDialog />
                        <CreateOrEditUserDialog id={user._id} />
                        <ToogleBlockDialog user={user} />
                        <ToogleAdminDialog user={user} />
                        <ChangePasswordFromAdminDialog id={user._id} />
                        <AssignUsersUnderManagerDialog id={user._id} />
                        <AssignPermissionsToOneUserDialog user={user} />
                    </>
                    : null
            }

        </>

    )

}
