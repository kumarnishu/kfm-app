import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext } from 'react';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import UpdateUserPasswordForm from '../../forms/user/ChangePasswordFromAdminForm';
import { Cancel } from '@mui/icons-material';


function ChangePasswordFromAdminDialog({ id }: { id: string }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <>
            <Dialog open={choice === UserChoiceActions.change_password_from_admin ? true : false}
                onClose={() => setChoice({ type: UserChoiceActions.close_user })}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                    <Cancel fontSize='large' />
                </IconButton>
                <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">Change Password</DialogTitle>
                <DialogContent>
                    <UpdateUserPasswordForm id={id} />
                </DialogContent>
            </Dialog >
        </>
    )
}

export default ChangePasswordFromAdminDialog
