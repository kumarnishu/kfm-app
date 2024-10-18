import { Dialog,  DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext} from 'react'
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import ResetPasswordSendMailForm from '../../forms/user/SendMailForResetPasswordLinkForm'
import { Cancel } from '@mui/icons-material'

function ResetPasswordSendMailDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)

    return (
        <Dialog open={choice === UserChoiceActions.send_password_reset_link ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>
            
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">Reset Password  </DialogTitle>
            <DialogContent>
                <ResetPasswordSendMailForm />
            </DialogContent>
        </Dialog>
    )
}

export default ResetPasswordSendMailDialog