import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, SparePartChoiceActions } from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { CreateOrEditSparePart } from '../../../services/SparePartServices';
import { AlertContext } from '../../../contexts/alertContext';
import { GetSparePartDto, GetSparePartForEditDto } from '../../../dtos/spare.part.dto';


function CreateOrEditSparePartForm({ part }: { part?: GetSparePartForEditDto }) {
    const { mutate, isSuccess, isLoading, error } = useMutation
        <AxiosResponse<GetSparePartDto>, BackendError, { id?: string, body: GetSparePartForEditDto }>
        (CreateOrEditSparePart, {
            onSuccess: () => {
                queryClient.invalidateQueries('parts')
            }
        })
    const { setChoice } = useContext(ChoiceContext)
    const formik = useFormik({
        initialValues: {
            name: part ? part.name : "",
            partno: part ? part.partno : ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Required field'),
            partno: Yup.string()
                .required('Required field')
        }),
        onSubmit: (values) => {

            if (part && part._id)
                mutate({ id: part._id, body: values })
            else
                mutate({ body: values })
        }
    });
    const { setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (part) {
            formik.setValues(
                {
                    name: part.name,
                    partno: part.partno,
                })
        }
        else {
            formik.setValues(
                {
                    name: "",
                    partno: ""
                })
        }

    }, [part])


    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: SparePartChoiceActions.close_part })
            setAlert({ message: part ? "updated part" : "created new part", color: 'info' })

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
                            formik.touched.partno && formik.errors.partno ? true : false
                        }
                        id="partno"
                        label="Part No"
                        helperText={
                            formik.touched.partno && formik.errors.partno ? formik.errors.partno : ""
                        }
                        {...formik.getFieldProps('partno')}
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

export default CreateOrEditSparePartForm