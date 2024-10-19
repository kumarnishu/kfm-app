import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { CustomerChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { GetCustomerForEditDto } from '../../../dtos/customer.dto'
import CreateOrEditCustomerForm from '../../forms/customer/CreateOrEditCustomerForm'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { GetCustomerForEdit } from '../../../services/CustomerServices'

function CreateOrEditCustomerDialog({ id }: { id?: string }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [customer, setCustomer] = useState<GetCustomerForEditDto>()

    const { data } = useQuery<AxiosResponse<GetCustomerForEditDto>, BackendError>(["customers", id], async () => GetCustomerForEdit(id || "fakeid"))

    useEffect(() => {
        if (data) {
            setCustomer(data.data)
        }
        else
            setCustomer(undefined)
    }, [data])
    return (
        <>
            <Dialog open={choice === CustomerChoiceActions.create_or_edit_customer ? true : false}
                onClose={() => {
                    setChoice({ type: CustomerChoiceActions.close_customer })
                }}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                    setChoice({ type: CustomerChoiceActions.close_customer })
                }}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle textAlign="center" sx={{ minWidth: '350px' }}>{customer ? "Update Customer" : "New Customer"}</DialogTitle>
                <DialogContent>
                    <CreateOrEditCustomerForm customer={customer} />
                </DialogContent>
            </Dialog >
        </>
    )
}

export default CreateOrEditCustomerDialog