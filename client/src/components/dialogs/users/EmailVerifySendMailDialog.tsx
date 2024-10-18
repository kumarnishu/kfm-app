import { Dialog,  DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext } from 'react'
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import SendEmailVerificationLinkForm from '../../forms/user/SendEmailVerificationLinkForm'
import { Cancel } from '@mui/icons-material'

function EmailVerifySendMailDialog() {
    const { choice, setChoice } = useContext(ChoiceContext)
    return (
        <Dialog open={choice === UserChoiceActions.send_email_verification_link ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>
            
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">Verify Your Email</DialogTitle>
            <DialogContent>
                <SendEmailVerificationLinkForm />
            </DialogContent>
            
        </Dialog>
    )
}

export default EmailVerifySendMailDialog