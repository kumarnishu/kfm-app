import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { SparePartChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import { ToogleBlockSparePart } from '../../../services/SparePartServices';
import { GetSparePartDto } from '../../../dtos/spare.part.dto';
import { AlertContext } from '../../../contexts/alertContext';


function ToogleSparePartBlockDialog({ part }: { part: GetSparePartDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (ToogleBlockSparePart, {
            onSuccess: () => {
                queryClient.invalidateQueries('parts')
            }
        })

    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: SparePartChoiceActions.close_part })
            setAlert({ message: `${part.is_active ? `Blocked part ` : 'Activated part '} successfully`, color: 'info' })

        }
        if (error) {
            setAlert({ message: error.response.data.message, color: 'error' })
        }
    }, [isSuccess, error])

    return (
        <Dialog open= { choice === SparePartChoiceActions.toogle_block_part ? true : false
}
onClose = {() => setChoice({ type: SparePartChoiceActions.close_part })}
        >
    <IconButton style={ { display: 'inline-block', position: 'absolute', right: '0px' } } color = "error" onClick = {() => setChoice({ type: SparePartChoiceActions.close_part })}>
        <Cancel fontSize='large' />
            </IconButton>

            < DialogTitle sx = {{ minWidth: '350px' }} textAlign = "center" >
                { part.is_active ? `Block SparePart ` : 'Activate SparePart ' }
                </DialogTitle>


                < DialogContent >
                <Typography variant="body1" color = "error" >

                    {`Warning ! This will ${part.is_active ? `Block ` : 'Unblock '} this part`}
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
    setChoice({ type: SparePartChoiceActions.toogle_block_part })
    mutate(part._id)
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

export default ToogleSparePartBlockDialog
