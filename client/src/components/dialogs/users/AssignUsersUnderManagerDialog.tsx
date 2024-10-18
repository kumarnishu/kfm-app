import { Dialog, DialogContent, DialogTitle, Typography, IconButton, Stack, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel, } from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { Cancel } from '@mui/icons-material';
import { AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { useFormik } from 'formik';
import * as Yup from "yup"
import { toTitleCase } from '../../../utils/TitleCase';
import { DropDownDto } from '../../../dtos/dropdown.dto';
import { AssignUsersUnderManager, GetAllUsersForDropDown, GetAssignedUsersForEdit } from '../../../services/UserServices';
import { AlertContext } from '../../../contexts/alertContext';


function AssignUsersUnderManagerDialog({ id }: { id: string }) {
    const [users, setUsers] = useState<DropDownDto[]>()

    const { data: assigned_users, isSuccess: isAssignedUserSuccess } = useQuery<AxiosResponse<string[]>, BackendError>(["users", id], async () => GetAssignedUsersForEdit(id))

    const { data, isSuccess: isUserSuccess } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("users", async () => GetAllUsersForDropDown({ hidden: false }))
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            id: string,
            body: {
                ids: string[]
            }
        }>
        (AssignUsersUnderManager, {
            onSuccess: () => {
                queryClient.invalidateQueries('users')
            }
        })
    const formik = useFormik<{
        ids: string[]
    }>({
        initialValues: {
            ids: []
        },
        validationSchema: Yup.object({
            ids: Yup.array()
                .required('field')
        }),
        onSubmit: (values: {
            ids: string[]
        }) => {
            mutate({
                id: id,
                body: {
                    ids: values.ids
                }
            })
            queryClient.invalidateQueries('users')
        }
    });

    useEffect(() => {
        if (isUserSuccess && data) {
            setUsers(data?.data)
        }
    }, [isUserSuccess, data])

    useEffect(() => {
        if (isAssignedUserSuccess && assigned_users) {
            formik.setValues({ ...formik.values, ids: assigned_users.data })
        }
    }, [assigned_users])

    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: UserChoiceActions.close_user })
            setAlert({ message: "selected users assigned under manager successfully", color: 'success' })

        }
        if (error) {
            setAlert({ message: error.response.data.message, color: 'error' })
        }
    }, [isSuccess, error])
    return (
        <Dialog
            fullWidth
            open={choice === UserChoiceActions.assign_users ? true : false}
            onClose={() => {
                setChoice({ type: UserChoiceActions.close_user })
            }}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => { setChoice({ type: UserChoiceActions.close_user }) }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Assign Users
            </DialogTitle>
            <DialogContent>
                <Stack
                    gap={2}
                >
                    <Typography variant="body1" color="error">
                        {`Warning ! This will assign ${formik.values.ids.length} users to the selected user.`}

                    </Typography>
                    <Button onClick={() => formik.setValues({ ids: [] })}>Remove Selection</Button>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl fullWidth sx={{ pt: 2 }}>
                            <InputLabel id="users" sx={{ mt: 1 }}>Select Users</InputLabel>
                            <Select
                                multiple
                                id="users"
                                fullWidth
                                size='small'
                                {...formik.getFieldProps('ids')}
                            >

                                {users && users.map((user, index) => (
                                    <MenuItem

                                        key={index}
                                        value={user.id}
                                    >
                                        {toTitleCase(user.label)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button style={{ padding: 10, marginTop: 10 }} variant="contained" color="primary" type="submit"
                            disabled={Boolean(isLoading)}
                            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Assign"}
                        </Button>
                    </form>


                </Stack>

            </DialogContent>
        </Dialog >
    )
}

export default AssignUsersUnderManagerDialog