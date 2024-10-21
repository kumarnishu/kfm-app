import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, MachineChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { CreateOrEditMachine } from '../../../services/MachineServices';
import { AlertContext } from '../../../contexts/alertContext';
import { GetMachineDto, GetMachineForEditDto } from '../../../dtos/machine.dto';


function CreateOrEditMachineForm({ machine }: { machine?: GetMachineForEditDto }) {
    const { mutate, isSuccess, isLoading, error } = useMutation
        <AxiosResponse<GetMachineDto>, BackendError, { id?: string, body: GetMachineForEditDto }>
        (CreateOrEditMachine, {
            onSuccess: () => {
                queryClient.invalidateQueries('machines')
            }
        })
    const { setChoice } = useContext(ChoiceContext)
    const formik = useFormik({
        initialValues: {
            name: machine ? machine.name : "",
            model: machine ? machine.model : ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            model: Yup.string()
                .required('Required field')
        }),
        onSubmit: (values) => {

            if (machine && machine._id)
                mutate({ id: machine._id, body: values })
            else
                mutate({ body: values })
        }
    });
    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (machine) {
            formik.setValues(
                {
                    name: machine.name,
                    model: machine.model,
                })
        }
        else {
            formik.setValues(
                {
                    name: "",
                    model: ""
                })
        }

    }, [machine])


    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: MachineChoiceActions.close_machine })
            setAlert({ message: machine ? "updated machine" : "created new machine", color: 'info' })

        }
        if (error) {
            setAlert({ message: error.response.data.message, color: 'error' })
        }
    }, [isSuccess, error])

    return (
        <>
            <form onSubmit={formik.handleSubmit} >

                <Stack
                    direction="column"
                    gap={2}
                    pt={2}
                >
                    <TextField


                        fullWidth
                        required
                        error={
                            formik.touched.name && formik.errors.name ? true : false
                        }
                        id="name"
                        label="Name"
                        helperText={
                            formik.touched.name && formik.errors.name ? formik.errors.name : ""
                        }
                        {...formik.getFieldProps('name')}
                    />
                    < TextField
                        fullWidth
                        required
                        error={
                            formik.touched.model && formik.errors.model ? true : false
                        }
                        id="model"
                        label="Model"
                        helperText={
                            formik.touched.model && formik.errors.model ? formik.errors.model : ""
                        }
                        {...formik.getFieldProps('model')}
                    />

                    < Button variant="contained" color="primary" type="submit"
                        disabled={Boolean(isLoading)}
                        fullWidth > {Boolean(isLoading) ? < CircularProgress /> : "Submit"
                        } </Button>
                </Stack>
            </form>
        </>
    )
}

export default CreateOrEditMachineForm