import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { ChoiceContext, CustomerChoiceActions} from '../../../contexts/dialogContext';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { CreateOrEditCustomer } from '../../../services/CustomerServices';
import { AlertContext } from '../../../contexts/alertContext';
import { GetCustomerDto, GetCustomerForEditDto } from '../../../dtos/customer.dto';


function CreateOrEditCustomerForm({ customer }: { customer?: GetCustomerForEditDto }) {
  const { mutate, isLoading, isSuccess, error } = useMutation
    <AxiosResponse<GetCustomerDto>, BackendError, { id?: string, body: GetCustomerForEditDto }>
    (CreateOrEditCustomer, {
      onSuccess: () => {
        queryClient.invalidateQueries('customers')
      }
    })
  const { setChoice } = useContext(ChoiceContext)
  const formik = useFormik({
    initialValues: {
      name: customer ? customer.name : "",
      address: customer ? customer.address : ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Required field'),
      address: Yup.string()
        .required('Required field')
    }),
    onSubmit: (values) => {

      if (customer && customer._id)
        mutate({ id: customer._id, body: values })
      else
        mutate({ body: values })
    }
  });
  const { setAlert } = useContext(AlertContext)

  useEffect(() => {
    if (customer) {
      formik.setValues(
        {
          name: customer.name,
          address: customer.address,
        })
    }
    else {
      formik.setValues(
        {
          name: "",
          address: ""
        })
    }

  }, [customer])


  useEffect(() => {
    if (isSuccess) {
      setChoice({ type: CustomerChoiceActions.close_customer })
      setAlert({ message: customer ? "updated customer" : "created new customer", color: 'info' })

    }
    if (error) {
      setAlert({ message: error.response.data.message, color: 'error' })
    }
  }, [isSuccess, error])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>

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
          <TextField
            fullWidth
            required
            error={
              formik.touched.address && formik.errors.address ? true : false
            }
            id="address"
            label="Address"
            helperText={
              formik.touched.address && formik.errors.address ? formik.errors.address : ""
            }
            {...formik.getFieldProps('address')}
          />
         
          <Button variant="contained" color="primary" type="submit"
            disabled={Boolean(isLoading)}
            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}</Button>
        </Stack>
      </form>
    </>
  )
}

export default CreateOrEditCustomerForm