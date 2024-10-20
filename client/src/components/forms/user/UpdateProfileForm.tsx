import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import * as Yup from "yup"
import { UpdateProfile } from '../../../services/UserServices';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { useContext, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { BackendError, Target } from '../../..';
import { queryClient } from '../../../main';
import { GetUserDto, UpdateProfileDto } from '../../../dtos/user.dto';
import { AlertContext } from '../../../contexts/alertContext';


function UpdateProfileForm({ user }: { user: UpdateProfileDto }) {
  const { mutate, isLoading, isSuccess,  error } = useMutation
    <AxiosResponse<GetUserDto>, BackendError, FormData>
    (UpdateProfile, {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    })
  const { setChoice } = useContext(ChoiceContext)

  const formik = useFormik({
    initialValues: {
      email: user.email,
      mobile: String(user.mobile),
      dp: ""
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .required('Required field')
        .min(10, 'Must be 10 digits')
        .max(10, 'Must be 10 digits'),
      email: Yup.string()
        .email('provide a valid email id')
        .required('Required field')
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
      formdata.append("email", values.email)
      formdata.append("mobile", values.mobile)
      formdata.append("dp", values.dp)
      mutate(formdata)
    }
  });
  const { setAlert } = useContext(AlertContext)

  useEffect(() => {
    if (isSuccess) {
      setChoice({ type: UserChoiceActions.close_user })
      setAlert({ message: "Updated profile successfully", color: "success" })

    }
    if (error) {
      setAlert({ message: error.response.data.message, color: 'error' })
    }
  }, [isSuccess, error])

  return (
    <form onSubmit={formik.handleSubmit}>

      <Stack
        direction="column"
        gap={2}
        pt={2}>
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
        <TextField

          type="number"
          required
          fullWidth
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
  )
}

export default UpdateProfileForm
