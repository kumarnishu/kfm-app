import { Fade, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '..'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { Block, Edit, Restore } from '@mui/icons-material'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, MachineChoiceActions } from '../contexts/dialogContext'
import PopUp from '../components/popup/PopUp'
import ExportToExcel from '../utils/ExportToExcel'
import { GetMachineDto } from '../dtos/machine.dto'
import { GetAllMachines } from '../services/MachineServices.ts'
import { UserContext } from '../contexts/userContext'
import CreateOrEditMachineDialog from '../components/dialogs/machine/CreateOrEditMachineDialog.tsx'
import ToogleMachineBlockDialog from '../components/dialogs/machine/ToogleMachineBlockDialog.tsx'
import { MachineExcelButton } from '../components/buttons/MachineExcelButton.tsx'

export default function MachinesPage() {
    const [hidden, setHidden] = useState(false)
    const [machine, setMachine] = useState<GetMachineDto>()
    const [machines, setMachines] = useState<GetMachineDto[]>([])
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetMachineDto[]>, BackendError>(["machines", hidden], async () => GetAllMachines({ hidden: hidden }))

    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const { user: LoggedInUser } = useContext(UserContext)
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const columns = useMemo<MRT_ColumnDef<GetMachineDto>[]>(
        //column definitions...
        () => machines && [
            {
                accessorKey: 'actions',
                header: '',
                maxSize: 50,
                Footer: <b></b>,
                Cell: ({ cell }) => <PopUp
                    element={
                        <Stack direction="row">
                            {
                                LoggedInUser?.assigned_permissions.includes('machine_edit') &&
                                <>
                                    <Tooltip title="edit">
                                        <IconButton
                                            color="success"
                                            size="medium"
                                            onClick={() => {
                                                setChoice({ type: MachineChoiceActions.create_or_edit_machine })
                                                setMachine(cell.row.original)
                                            }}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={cell.row.original.is_active ? "Block" : "UnBlock"}>
                                        <IconButton
                                            size="medium"
                                            onClick={() => {
                                                setChoice({ type: MachineChoiceActions.toogle_block_machine })
                                                setMachine(cell.row.original)

                                            }}
                                        >
                                            {cell.row.original.is_active ? <Block /> : <Restore />}
                                        </IconButton>
                                    </Tooltip>
                                </>
                            }



                        </Stack>} />

            },

            {
                accessorKey: 'is_active',
                header: 'Status',
                size: 120,
                Cell: (cell) => <>{cell.row.original.is_active ? "active" : "blocked"}</>,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150,
            },
            {
                accessorKey: 'model',
                header: 'Model',
                size: 200
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                size: 160
            },
            {
                accessorKey: 'created_by',
                header: 'Created By',
                size: 160
            },
        ],
        [machines],
        //end
    );



    const table = useMaterialReactTable({
        columns,
        data: machines, //10,000 rows       
        enableColumnResizing: true,
        columnFilterDisplayMode: 'popover',
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
            setMachines(data.data)
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
                    Machines
                </Typography>

                <Stack
                    direction="row"
                    gap={4}
                >
                    <MachineExcelButton />
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
                                LoggedInUser?.assigned_permissions.includes('machine_create') &&
                                < MenuItem onClick={() => {
                                    setChoice({ type: MachineChoiceActions.create_or_edit_machine })
                                    setAnchorEl(null)
                                    setMachine(undefined)
                                }}
                                >
                                    <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                        New Machine
                                    </Typography>
                                </MenuItem>}
                            {LoggedInUser?.assigned_permissions.includes('machine_view') && <MenuItem

                                onClick={() => {
                                    setHidden(!hidden)
                                    setAnchorEl(null)
                                }}
                            >
                                <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                    {hidden ? "Show Active" : "Show Inactive"}
                                </Typography>
                            </MenuItem>}
                            {LoggedInUser?.assigned_permissions.includes('machine_export') && <MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Users Data")}
                            >  <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                    Export All
                                </Typography></MenuItem>}
                            {LoggedInUser?.assigned_permissions.includes('machine_export') && <MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Users Data")}
                            >
                                <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                                    Export Selected</Typography>
                            </MenuItem>}
                        </Menu>
                        <CreateOrEditMachineDialog />
                    </>
                </Stack >
            </Stack >
            <MaterialReactTable table={table} />
            {
                machine ?
                    <>


                        <CreateOrEditMachineDialog id={machine._id} />
                        <ToogleMachineBlockDialog machine={machine} />
                    </>
                    : null
            }

        </>

    )

}
