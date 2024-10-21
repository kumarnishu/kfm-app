import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { MachineChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import { ToogleBlockMachine } from '../../../services/MachineServices';
import { GetMachineDto } from '../../../dtos/machine.dto';
import { AlertContext } from '../../../contexts/alertContext';


function ToogleMachineBlockDialog({ machine }: { machine: GetMachineDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (ToogleBlockMachine, {
            onSuccess: () => {
                queryClient.invalidateQueries('machines')
            }
        })

    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: MachineChoiceActions.close_machine })
            setAlert({ message: `${machine.is_active ? `Blocked machine ` : 'Activated machine '} successfully`, color: 'info' })

        }
        if (error) {
            setAlert({ message: error.response.data.message, color: 'error' })
        }
    }, [isSuccess, error])

    return (
        <Dialog open= { choice === MachineChoiceActions.toogle_block_machine ? true : false
}
onClose = {() => setChoice({ type: MachineChoiceActions.close_machine })}
        >
    <IconButton style={ { display: 'inline-block', position: 'absolute', right: '0px' } } color = "error" onClick = {() => setChoice({ type: MachineChoiceActions.close_machine })}>
        <Cancel fontSize='large' />
            </IconButton>

            < DialogTitle sx = {{ minWidth: '350px' }} textAlign = "center" >
                { machine.is_active ? `Block Machine ` : 'Activate Machine ' }
                </DialogTitle>


                < DialogContent >
                <Typography variant="body1" color = "error" >

                    {`Warning ! This will ${machine.is_active ? `Block ` : 'Unblock '} this machine`}
</Typography>
    </DialogContent>
    < Stack
direction = "column"
gap = { 2}
padding = { 2}
width = "100%"
    >
    <Button fullWidth variant = "outlined" color = "error"
onClick = {() => {
    setChoice({ type: MachineChoiceActions.toogle_block_machine })
    mutate(machine._id)
}}
disabled = { isLoading }
    >
    { isLoading?<CircularProgress /> :
"Submit"}
</Button>

    </Stack >
    </Dialog >
    )
}

export default ToogleMachineBlockDialog
