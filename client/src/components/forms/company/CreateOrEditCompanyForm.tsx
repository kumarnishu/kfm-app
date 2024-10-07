import { Button, CircularProgress,  Divider,  Stack, TextField } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useEffect, useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as Yup from "yup"
import { queryClient } from '../../../main';
import AlertBar from '../../snacks/AlertBar';
import { Delete } from '@mui/icons-material';
import { GetCompanyDto } from '../../../dtos/company/company.dto';
import { createOrEditUserDto, GetUserDto } from '../../../dtos/users/user.dto';
import { BackendError } from '../../..';
import { CreateOrEditCompany, GetUsersOfACompany } from '../../../services/CompanyServices';
import { ChoiceContext, CompanyChoiceActions } from '../../../contexts/dialogContext';


function CreateOrEditCompanyForm({ company }: { company: GetCompanyDto }) {
    const [items, setItems] = useState<createOrEditUserDto[]>([])
    const [item, setItem] = useState<createOrEditUserDto>()
    const { data: usersData, isSuccess: isSucessUsers } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", company], async () => GetUsersOfACompany({ id: company._id }))

    const { mutate, isLoading, isSuccess, isError, error } = useMutation
        <AxiosResponse<string>, BackendError, {
            body: FormData,
            id?: string,
        }>
        (CreateOrEditCompany, {
            onSuccess: () => {
                queryClient.invalidateQueries('companies')
            }
        })


    const { setChoice } = useContext(ChoiceContext)

    const formik = useFormik<{
        company: string,
        address: string
    }>({
        initialValues: {
            company: company ? company.company : "",
            address: company ? company.address : ""
        },
        validationSchema: Yup.object({
            company: Yup.string().required('required field'),
            address: Yup.string().required('required field')
        }),
        onSubmit: (values) => {
            let body = {
                users: items,
                company: values.company,
                address: values.address
            }
            let formdata = new FormData()
            formdata.append("body", JSON.stringify(body))
            if (company)
                mutate({ id: company._id, body: formdata });
            else
                mutate({ body: formdata });
        }
    });

    const handleRemove = (itm: createOrEditUserDto) => {
        if (itm) {
            let tmp = items.filter((it) => { return it.username !== itm.username })
            setItems(tmp)
        }
    }
    const handleAdd = () => {
        let tmp = items;
        if (item && !items.find((it) => it.username === item.username)) {
            tmp.push(item)
            setItems(tmp)
            setItem(undefined)
        }
    }

    useEffect(() => {
        if (isSucessUsers && usersData) {
            setItems(usersData.data.map((u) => {
                return {
                    _id: u._id,
                    username: u.username,
                    email: u.email,
                    password: u.orginal_password,
                    mobile: u.mobile
                }
            }))
        }
    }, [isSucessUsers])

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: CompanyChoiceActions.close_company })

        }
    }, [isSuccess, setChoice])
    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack
                gap={2}
                pt={2}
            >
                {/* remarks */}
                <TextField
                    required
                    error={
                        formik.touched.company && formik.errors.company ? true : false
                    }
                    id="company"
                    label="Company"
                    fullWidth
                    helperText={
                        formik.touched.company && formik.errors.company ? formik.errors.company : ""
                    }
                    {...formik.getFieldProps('company')}
                />

                < TextField
                    error={
                        formik.touched.address && formik.errors.address ? true : false
                    }
                    required
                    id="address"
                    label="Address"
                    fullWidth
                    helperText={
                        formik.touched.address && formik.errors.address ? formik.errors.address : ""
                    }
                    {...formik.getFieldProps('address')}
                />



                {/* company items */}
                {!company && <Stack direction={'row'} gap={1}>
                    < TextField
                        variant='outlined'

                        id="username"
                        value={item ? item.username : ""}
                        onChange={(e) => {
                            if (e.target.value)
                                //@ts-ignore
                                setItem({
                                    ...item,
                                    username: e.target.value
                                })
                        }}
                        label="User name"
                        fullWidth
                    />
                    < TextField
                        variant='outlined'

                        type="mobile"
                        id="mobile"
                        value={item ? item.mobile : ""}
                        onChange={(e) => {
                            if (e.target.value)
                                //@ts-ignore
                                setItem({
                                    ...item,
                                    mobile: e.target.value
                                })
                        }}
                        label="Mobile"
                        fullWidth
                    />
                    < TextField
                        variant='outlined'

                        type="email"
                        id="email"
                        value={item ? item.email : ""}
                        onChange={(e) => {
                            if (e.target.value)
                                //@ts-ignore
                                setItem({
                                    ...item,
                                    email: e.target.value
                                })
                        }}
                        label="Email"
                        fullWidth
                    />
                    < TextField
                        variant='outlined'
                        id="password"
                        value={item ? item.password : ""}
                        onChange={(e) => {
                            if (e.target.value)
                                //@ts-ignore
                                setItem({
                                    ...item,
                                    password: e.target.value
                                })
                        }}
                        label="Password"
                        fullWidth
                    />
                    <Button size="small" variant='contained' onClick={handleAdd}>+</Button>
                    <Divider />

                </Stack>}
                
                <>
                    {items && items.map((it, index) => {
                        return <Stack key={index}>
                            <Stack direction={'row'} gap={1}>
                                < TextField
                                    focused
                                    required
                                    id="username"
                                    disabled
                                    value={it ? it.username : ""}
                                    label="User name"
                                    fullWidth
                                />
                                < TextField
                                    focused
                                    required
                                    type="mobile"
                                    id="mobile"
                                    value={it ? it.mobile : ""}
                                    disabled
                                    label="Mobile"
                                    fullWidth
                                />
                                < TextField
                                    focused
                                    required
                                    type="email"
                                    id="email"
                                    value={it ? it.email : ""}
                                    disabled
                                    label="Email"
                                    fullWidth
                                />
                                < TextField
                                    focused
                                    required
                                    id="password"
                                    value={it ? it.password : "passs"}
                                    label="Password"
                                    fullWidth
                                    disabled
                                />
                                {!company && <Button
                                    disabled={Boolean(isLoading)}
                                    size="small" variant='contained' onClick={() => handleRemove({ ...it, _id: String(index) })}><Delete /></Button>}
                            </Stack>
                        </Stack>
                    })}
                </>
                <Button variant="contained" color="primary" type="submit"
                    disabled={Boolean(isLoading)}
                    fullWidth>{Boolean(isLoading) ? <CircularProgress /> : !company ? "Submit" : "Update "}
                </Button>

            </Stack>

            {
                isError ? (
                    <>
                        {<AlertBar message={error?.response.data.message} color="error" />}
                    </>
                ) : null
            }
            {
                isSuccess ? (
                    <>
                        {!company ? <AlertBar message="new company created" color="success" /> : <AlertBar message="company updated" color="success" />}
                    </>
                ) : null
            }

        </form >
    )
}

export default CreateOrEditCompanyForm
