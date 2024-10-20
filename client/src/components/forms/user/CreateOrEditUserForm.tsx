import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import { GetUserDto, GetUserForEditDto } from '../../../dtos/user.dto';
import { DropDownDto } from '../../../dtos/dropdown.dto';
import { CreateOrEditUser } from '../../../services/UserServices';
import { GetCustomersForDropdown } from '../../../services/CustomerServices';
import { AlertContext } from '../../../contexts/alertContext';


function CreateOrEditUserForm({ user }: { user?: GetUserForEditDto }) {
  const { mutate, isLoading, isSuccess, error } = useMutation
    <AxiosResponse<GetUserDto>, BackendError, { id?: string, body: FormData }>
    (CreateOrEditUser, {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    })
  const { data: customers } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>("customers", async () => GetCustomersForDropdown({ hidden: false }))

  const { setChoice } = useContext(ChoiceContext)
  const formik = useFormik({
    initialValues: {
      username: user ? user.username : "",
      email: user ? user.email : "",
      mobile: user ? String(user.mobile) : "",
      customer: user ? user.customer : "",
      dp: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Required field')
        .min(4, 'Must be 4 characters or more')
        .max(30, 'Must be 30 characters or less'),
      mobile: Yup.string()
        .required('Required field')
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits'),
      customer: Yup.string()
      ,
      email: Yup.string()
        .email('provide a valid email id')
        .required('Required field'),

      dp: Yup.mixed<File>()
        .test("size", "size is allowed only less than 10mb",
          file => {
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(file.size <= 20 * 1024 * 1024)
            return true
          }
        )
        .test("type", " allowed only .jpg, .jpeg, .png, .gif images",
          file => {
            const Allowed = ["image/png", "image/jpg", "image/jpeg", "image/png", "image/gif"]
            if (file)
              if (!file.size) //file not provided
                return true
              else
                return Boolean(Allowed.includes(file.type))
            return true
          }
        )
    }),
    onSubmit: (values) => {
      let formdata = new FormData()
      formdata.append("username", values.username)
      formdata.append("email", values.email)
      formdata.append("mobile", values.mobile)
      if (values.customer)
        formdata.append("customer", values.customer)
      formdata.append("dp", values.dp)
      if (user && user._id)
        mutate({ id: user._id, body: formdata })
      else
        mutate({ body: formdata })
    }
  });
  const { setAlert } = useContext(AlertContext)

  useEffect(() => {
    if (user) {
      formik.setValues(
        {
          username: user.username,
          email: user.email,
          mobile: String(user.mobile),
          customer: user.customer,
          dp: "",
        })
    }
    else {
      formik.setValues(
        {
          username: "",
          email: "",
          mobile: "",
          customer: "",
          dp: "",
        })
    }

  }, [user])


  useEffect(() => {
    if (isSuccess) {
      setChoice({ type: UserChoiceActions.close_user })
      setAlert({ message: user ? "updated user" : "created new user", color: 'info' })

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
              formik.touched.username && formik.errors.username ? true : false
            }
            id="username"
            label="Username"
            helperText={
              formik.touched.username && formik.errors.username ? formik.errors.username : ""
            }
            {...formik.getFieldProps('username')}
          />
          <TextField

            type="number"
            fullWidth
            required
            error={
              formik.touched.mobile && formik.errors.mobile ? true : false
            }
            id="mobile"
            label="Mobile"
            helperText={
              formik.touched.mobile && formik.errors.mobile ? formik.errors.mobile : ""
            }
            {...formik.getFieldProps('mobile')}
          />
          <TextField


            required
            fullWidth
            error={
              formik.touched.email && formik.errors.email ? true : false
            }
            id="email"
            label="Email"
            helperText={
              formik.touched.email && formik.errors.email ? formik.errors.email : ""
            }
            {...formik.getFieldProps('email')}
          />
          < TextField
            select
            SelectProps={{
              native: true
            }}
            focused
            error={
              formik.touched.customer && formik.errors.customer ? true : false
            }
            id="customer"
            helperText={
              formik.touched.customer && formik.errors.customer ? formik.errors.customer : ""
            }
            {...formik.getFieldProps('customer')}
            label="Company"
            fullWidth
          >
            <option key={'00'} value={undefined}>
              Select
            </option>
            {
              customers && customers.data && customers.data.map((customer, index) => {
                return (<option key={index} value={customer && customer.id}>
                  {customer.label}
                </option>)
              })
            }
          </TextField>
          <TextField
            fullWidth
            error={
              formik.touched.dp && formik.errors.dp ? true : false
            }
            helperText={
              formik.touched.dp && formik.errors.dp ? String(formik.errors.dp) : ""
            }
            label="Display Picture"
            focused

            type="file"
            name="dp"
            onBlur={formik.handleBlur}
            onChange={(e) => {
              e.preventDefault()
              const target: Target = e.currentTarget
              let files = target.files
              if (files) {
                let file = files[0]
                formik.setFieldValue("dp", file)
              }
            }}
          />
          <Button variant="contained" color="primary" type="submit"
            disabled={Boolean(isLoading)}
            fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Submit"}</Button>
        </Stack>
      </form>
    </>
  )
}

export default CreateOrEditUserForm