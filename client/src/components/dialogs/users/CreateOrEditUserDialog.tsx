import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { GetUserForEditDto } from '../../../dtos/user.dto'
import CreateOrEditUserForm from '../../forms/user/CreateOrEditUserForm'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { GetUserForEdit } from '../../../services/UserServices'

function CreateOrEditUserDialog({ id }: { id?: string }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [user, setUser] = useState<GetUserForEditDto>()

    const { data } = useQuery<AxiosResponse<GetUserForEditDto>, BackendError>(["users", id], async () => GetUserForEdit(id || "fakeid"))

    useEffect(() => {
        if (data) {
            setUser(data.data)
        }
        else
            setUser(undefined)
    }, [data])
    return (
        <>
            <Dialog open={choice === UserChoiceActions.create_or_edit_user ? true : false}
                onClose={() => {
                    setChoice({ type: UserChoiceActions.close_user })
                }}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                    setChoice({ type: UserChoiceActions.close_user })
                }}>
                    <Cancel fontSize='large' />
                </IconButton>

                <DialogTitle textAlign="center" sx={{ minWidth: '350px' }}>{user ? "Update User" : "New User"}</DialogTitle>
                <DialogContent>
                    <CreateOrEditUserForm user={user} />
                </DialogContent>
            </Dialog >
        </>
    )
}

export default CreateOrEditUserDialog