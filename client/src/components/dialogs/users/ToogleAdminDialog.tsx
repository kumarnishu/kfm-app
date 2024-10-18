import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import { ToogleAdmin } from '../../../services/UserServices';
import { GetUserDto } from '../../../dtos/user.dto';
import { AlertContext } from '../../../contexts/alertContext';


function ToogleAdminDialog({ user }: { user: GetUserDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error } = useMutation
        <AxiosResponse<any>, BackendError, string>
        (ToogleAdmin, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })

    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: UserChoiceActions.close_user })
            setAlert({ message: `${user.is_admin ? `Removed Admin Role ` : 'Provided Admin Role '} successfully`, color: 'success' })

        }
        if (error) {
            setAlert({ message: error.response.data.message, color: 'error' })
        }
    }, [isSuccess, error])

    return (
        <Dialog open={choice === UserChoiceActions.toogle_admin ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                {user.is_admin ? `Remove Admin Role ` : 'Provide Admin Role '}
            </DialogTitle>


            <DialogContent>
                <Typography variant="body1" color="error">

                    {`Warning ! This will ${user.is_admin ? `Remove Admin Role ` : 'Provide Admin Role '}  for this user`}
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
                        setChoice({ type: UserChoiceActions.toogle_admin })
                        mutate(user._id)
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

export default ToogleAdminDialog
