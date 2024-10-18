import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UserChoiceActions, ChoiceContext } from '../../../contexts/dialogContext';
import { UserContext } from '../../../contexts/userContext';
import { Login } from '../../../services/UserServices';
import { BackendError } from '../../..';
import { GetUserDto } from '../../../dtos/user.dto';
import { AlertContext } from '../../../contexts/alertContext';

function LoginForm() {
  const goto = useNavigate()
  const { mutate, data, isSuccess, isLoading, error } = useMutation
    <AxiosResponse<{ user: GetUserDto, token: string }>,
      BackendError,
      { username: string, password: string, multi_login_token?: string }
    >(Login)

  const { setChoice } = useContext(ChoiceContext)
  const { setUser } = useContext(UserContext)
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      multi_login_token: String(localStorage.getItem('multi_login_token'))
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required(),
      password: Yup.string()
        .required()
    }),
    onSubmit: (values: {
      username: string,
      password: string,
      multi_login_token?: string
    }) => {
      mutate(values)
    },
  });

  // passworrd handling
  const [visiblity, setVisiblity] = useState(false);
  const handlePasswordVisibility = () => {
    setVisiblity(!visiblity);
  };
  const handleMouseDown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
  };

  const { setAlert } = useContext(AlertContext)

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.data.user)
      setChoice({ type: UserChoiceActions.close_user })
      setAlert({ message: "logged in ...", color: "success" })
      goto("/", { replace: true })

    }
    if (error) {
      setAlert({ message: error.response.data.message, color: 'error' })
    }
  }, [isSuccess, data, error])


  return (
    <>
     <form onSubmit={formik.handleSubmit}>

        <Stack
          direction="column"
          p={2}
          gap={2}
          sx={{ minWidth: '300px' }}
        >
          <TextField
            variant="outlined"
            focused
            fullWidth
            required
            error={
              formik.touched.username && formik.errors.username ? true : false
            }
            id="username"
            label="Username or Email"
            helperText={
              formik.touched.username && formik.errors.username ? formik.errors.username : ""
            }
            {...formik.getFieldProps('username')}
          />
          <TextField
            variant="outlined"
            focused
            required
            error={
              formik.touched.password && formik.errors.password ? true : false
            }
            id="password"
            label="Password"
            fullWidth
            helperText={
              formik.touched.password && formik.errors.password ? formik.errors.password : ""
            }
            type={visiblity ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handlePasswordVisibility}
                    onMouseDown={(e) => handleMouseDown(e)}
                  >
                    {visiblity ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...formik.getFieldProps('password')}
          />

          <Button size="large" variant="contained"
            disabled={Boolean(isLoading)}
            type="submit" fullWidth>{Boolean(isLoading) ? <CircularProgress /> : "Login"}
          </Button>
        </Stack>
      </form></>
  )
}

export default LoginForm
