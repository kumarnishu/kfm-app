import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { CustomerChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import { ToogleBlockCustomer } from '../../../services/CustomerServices';
import { GetCustomerDto } from '../../../dtos/customer.dto';
import { AlertContext } from '../../../contexts/alertContext';


function ToogleCustomerBlockDialog({ customer }: { customer: GetCustomerDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (ToogleBlockCustomer, {
            onSuccess: () => {
                queryClient.invalidateQueries('customers')
            }
        })

    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: CustomerChoiceActions.close_customer })
            setAlert({ message: `${customer.is_active ? `Blocked customer ` : 'Activated customer '} successfully`, color: 'info' })

        }
        if (error) {
            setAlert({ message: error.response.data.message, color: 'error' })
        }
    }, [isSuccess, error])

    return (
        <Dialog open={choice === CustomerChoiceActions.toogle_block_customer ? true : false}
            onClose={() => setChoice({ type: CustomerChoiceActions.close_customer })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: CustomerChoiceActions.close_customer })}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                {customer.is_active ? `Block Customer ` : 'Activate Customer '}
            </DialogTitle>


            <DialogContent>
                <Typography variant="body1" color="error">

                    {`Warning ! This will ${customer.is_active ? `Block ` : 'Unblock '} this customer`}
                </Typography>
            </DialogContent>
            <Stack
                direction="column"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {
                        setChoice({ type: CustomerChoiceActions.toogle_block_customer })
                        mutate(customer._id)
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Submit"}
                </Button>

            </Stack >
        </Dialog >
    )
}

export default ToogleCustomerBlockDialog
