import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext } from 'react'
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { GetUserForEditDto } from '../../../dtos/user.dto'
import CreateOrEditUserForm from '../../forms/user/CreateOrEditUserForm'

function CreateOrEditUserDialog({ user }: { user?: GetUserForEditDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)

    return (
        <Dialog open={choice === UserChoiceActions.create_or_edit_user ? true : false}
            onClose={() => setChoice({ type: UserChoiceActions.close_user })}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => setChoice({ type: UserChoiceActions.close_user })}>
                <Cancel fontSize='large' />
            </IconButton>

            <DialogTitle textAlign="center" sx={{ minWidth: '350px' }}>{user ? "Update User" : "New User"}</DialogTitle>
            <DialogContent>
                {user ?
                    <CreateOrEditUserForm user={user} />
                    : null
                }
            </DialogContent>
        </Dialog >
    )
}

export default CreateOrEditUserDialog