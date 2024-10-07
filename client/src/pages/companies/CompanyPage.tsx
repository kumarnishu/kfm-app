import { Fade, IconButton, LinearProgress, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '../..'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { onlyUnique } from '../../utils/UniqueArray'
import { Block, Edit, Restore } from '@mui/icons-material'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, CompanyChoiceActions } from '../../contexts/dialogContext'
import PopUp from '../../components/popup/PopUp'
import ExportToExcel from '../../utils/ExportToExcel'
import { GetCompanyDto } from '../../dtos/company/company.dto'
import CreateOrEditCompanyDialog from '../../components/dialogs/company/CreateOrEditCompanyDialog'
import ToogleCompanyStatusDialog from '../../components/dialogs/company/ToogleCompanyStatusDialog'
import { GetCompanies } from '../../services/CompanyServices'

export default function CompanyPage() {
    const [company, setCompany] = useState<GetCompanyDto>()
    const [hidden, setHidden] = useState('false')
    const [companies, setCompanies] = useState<GetCompanyDto[]>([])
    const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetCompanyDto[]>, BackendError>(["companies", hidden], async () => GetCompanies({ hidden: hidden }))
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const { setChoice } = useContext(ChoiceContext)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const columns = useMemo<MRT_ColumnDef<GetCompanyDto>[]>(
        //column definitions...
        () => companies && [
            {
                accessorKey: 'actions',
                header: '',
                maxSize: 50,
                Footer: <b></b>,
                Cell: ({ cell }) => <PopUp
                    element={
                        <Stack direction="row">

                            {/* edit icon */}

                            <Tooltip title="edit">
                                <IconButton
                                    color="success"
                                    size="medium"
                                    onClick={() => {
                                        setChoice({ type: CompanyChoiceActions.create_oredit_company })
                                        setCompany(cell.row.original)
                                    }}>
                                    <Edit />
                                </IconButton>
                            </Tooltip>



                            <Tooltip title="Toogle Status"><IconButton
                                size="medium"
                                color="error"
                                disabled={cell.row.original?.created_by.id === cell.row.original._id}
                                onClick={() => {
                                    setChoice({ type: CompanyChoiceActions.toogle_company_status })
                                    setCompany(cell.row.original)

                                }}
                            >
                                {cell.row.original.is_active ? <Block /> : <Restore />}
                            </IconButton>
                            </Tooltip>



                        </Stack>} />

            },


            {
                accessorKey: 'company',
                header: 'Company',
                size: 350,
                filterVariant: 'multi-select',
                filterSelectOptions: companies && companies.map((i) => { return i.company }).filter(onlyUnique)
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                size: 200,
                filterVariant: 'multi-select',
                Cell: (cell) => <>{cell.row.original.is_active ? "Active" : "Inactive"}</>,
                filterSelectOptions: data && companies.map((i) => {
                    if (i.is_active) return "Active"
                    return "Inactive"
                }).filter(onlyUnique)
            },

            {
                accessorKey: 'address',
                header: 'Address',
                size: 320,
                filterVariant: 'multi-select',
                Cell: (cell) => <>{cell.row.original.address}</>,
                filterSelectOptions: data && companies.map((i) => {
                    return i.address || ""
                }).filter(onlyUnique)
            },
            {
                accessorKey: 'users',
                header: 'Users',
                size: 150,
                Cell: (cell) => <>{cell.row.original.users || 0}</>
            },
        ],
        [companies],
        //end
    );



    const table = useMaterialReactTable({
        columns,
        data: companies, //10,000 rows       
        enableColumnResizing: true,
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
            density: 'compact', pagination: { pageIndex: 0, pageSize: 100 }
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
        state: { sorting }
    });

    useEffect(() => {
        if (isSuccess && data) {
            setCompanies(data.data)
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
                    Companies
                </Typography>

                <Stack
                    direction="row"
                >

                    <Stack direction={'row'} alignItems={'center'}>
                        <input type='checkbox' onChange={(e) => {
                            if (e.target.checked) {
                                setHidden('true')
                            }
                            else
                                setHidden('false')
                        }} /> <span style={{ paddingLeft: '5px' }}>Blocked</span>
                    </Stack >
                    {/* company menu */}
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
                                    setChoice({ type: CompanyChoiceActions.create_oredit_company })
                                    setAnchorEl(null)
                                    setCompany(undefined)
                                }}
                                >New Company</MenuItem>}

                            <MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Exported Data")}
                            >Export All</MenuItem>
                            <MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Exported Data")}
                            >Export Selected</MenuItem>
                        </Menu>
                        <CreateOrEditCompanyDialog company={company} />
                    </>
                </Stack >
            </Stack >
            {
                isLoading && <LinearProgress />
            }

            {!isLoading && data && <MaterialReactTable table={table} />}
            {
                company ?
                    <>

                        <ToogleCompanyStatusDialog company={company} />
                    </>
                    : null
            }
        </>

    )

}
