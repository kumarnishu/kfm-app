import { Fade, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { BackendError } from '..'
import { MaterialReactTable, MRT_ColumnDef, MRT_SortingState, useMaterialReactTable } from 'material-react-table'
import { Block, Edit, Restore } from '@mui/icons-material'
import { Menu as MenuIcon } from '@mui/icons-material';
import { ChoiceContext, CustomerChoiceActions } from '../contexts/dialogContext'
import PopUp from '../components/popup/PopUp'
import ExportToExcel from '../utils/ExportToExcel'
import { GetCustomerDto } from '../dtos/customer.dto'
import { GetAllCustomers } from '../services/CustomerServices'
import { UserContext } from '../contexts/userContext'
import CreateOrEditCustomerDialog from '../components/dialogs/customer/CreateOrEditCustomerDialog'
import ToogleCustomerBlockDialog from '../components/dialogs/customer/ToogleCustomerBlockDialog'
import { CustomerExcelButton } from '../components/buttons/CustomerExcelButton'

export default function CustomersPage() {
  const [hidden, setHidden] = useState(false)
  const [customer, setCustomer] = useState<GetCustomerDto>()
  const [customers, setCustomers] = useState<GetCustomerDto[]>([])
  const { data, isSuccess, isLoading } = useQuery<AxiosResponse<GetCustomerDto[]>, BackendError>(["customers", hidden], async () => GetAllCustomers({ hidden: hidden }))

  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const { user: LoggedInUser } = useContext(UserContext)
  const { setChoice } = useContext(ChoiceContext)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const columns = useMemo<MRT_ColumnDef<GetCustomerDto>[]>(
    //column definitions...
    () => customers && [
      {
        accessorKey: 'actions',
        header: '',
        maxSize: 50,
        Footer: <b></b>,
        Cell: ({ cell }) => <PopUp
          element={
            <Stack direction="row">
              {
                LoggedInUser?.assigned_permissions.includes('customer_edit') &&
                <>
                  <Tooltip title="edit">
                    <IconButton
                      color="success"
                      size="medium"
                      onClick={() => {
                        setChoice({ type: CustomerChoiceActions.create_or_edit_customer })
                        setCustomer(cell.row.original)
                      }}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={cell.row.original.is_active ? "Block" : "UnBlock"}>
                    <IconButton
                      size="medium"
                      onClick={() => {
                        setChoice({ type: CustomerChoiceActions.toogle_block_customer })
                        setCustomer(cell.row.original)

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
        accessorKey: 'address',
        header: 'Address',
        size: 320
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
    [customers],
    //end
  );



  const table = useMaterialReactTable({
    columns,
    data: customers, //10,000 rows       
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
      setCustomers(data.data)
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
          Customers
        </Typography>

        <Stack
          direction="row"
          gap={4}
        >
          <CustomerExcelButton />
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
                LoggedInUser?.assigned_permissions.includes('customer_create') &&
                < MenuItem onClick={() => {
                  setChoice({ type: CustomerChoiceActions.create_or_edit_customer })
                  setAnchorEl(null)
                  setCustomer(undefined)
                }}
                >
                  <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                    New Customer
                  </Typography>
                </MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('customer_view') && <MenuItem

                onClick={() => {
                  setHidden(!hidden)
                  setAnchorEl(null)
                }}
              >
                <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                  {hidden ? "Show Active" : "Show Inactive"}
                </Typography>
              </MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('customer_export') && <MenuItem onClick={() => ExportToExcel(table.getRowModel().rows.map((row) => { return row.original }), "Users Data")}
              >  <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                  Export All
                </Typography></MenuItem>}
              {LoggedInUser?.assigned_permissions.includes('customer_export') && <MenuItem disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} onClick={() => ExportToExcel(table.getSelectedRowModel().rows.map((row) => { return row.original }), "Users Data")}
              >
                <Typography style={{ paddingLeft: '2px', fontSize: 16 }} variant='h6' color={'error'}>
                  Export Selected</Typography>
              </MenuItem>}
            </Menu>
            <CreateOrEditCustomerDialog />
          </>
        </Stack >
      </Stack >
      <MaterialReactTable table={table} />
      {
        customer ?
          <>


            <CreateOrEditCustomerDialog id={customer._id} />
            <ToogleCustomerBlockDialog customer={customer} />
          </>
          : null
      }

    </>

  )

}
