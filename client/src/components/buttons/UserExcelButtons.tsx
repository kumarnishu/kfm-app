import { AxiosResponse } from "axios"
import { BackendError } from "../.."
import { useMutation } from "react-query"
import { CreateUserFromExcel } from "../../services/UserServices"
import { useContext, useEffect, useState } from "react"
import { AlertContext } from "../../contexts/alertContext"
import { Button, CircularProgress, Stack } from "@mui/material"
import { Download, Upload } from "@mui/icons-material"
import styled from "styled-components"
import { saveAs } from 'file-saver';
import ExportToExcel from "../../utils/ExportToExcel"


const FileInput = styled.input`
background:none;
color:blue;
`


export function UserExcelButtons() {
    const { data, mutate, isLoading, isSuccess, error } = useMutation
        <AxiosResponse<any[]>, BackendError, FormData>
        (CreateUserFromExcel)
    const { setAlert } = useContext(AlertContext)
    const [file, setFile] = useState<File | null>(null)



    function HandleExport() {
        saveAs(`/api/v1/download/template/users`)
    }


    function handleFile() {
        if (file) {
            let formdata = new FormData()
            formdata.append('excel', file)
            mutate(formdata)
        }
    }
    useEffect(() => {
        if (file) {
            handleFile()
        }
    }, [file])

    useEffect(() => {
        if (isSuccess) {
            if (data.data.length > 0)
                ExportToExcel(data.data, "output.xlsx")
        }
    }, [isSuccess, data])



    useEffect(() => {
        if (isSuccess) {
            setAlert({ message: `Uploaded Successfuly`, color: 'info' })
        }
        if (error) {
            setAlert({ message: error.response.data.message, color: 'error' })
        }

    }, [isSuccess, error])

    return (
        <Stack direction={'row'} gap={1}>
            <>

                {
                    isLoading ?
                        <CircularProgress />
                        :
                        <>
                            <Button
                                component="label"
                                variant="contained"
                            >
                                <Upload />
                                <FileInput
                                    id="upload_input"
                                    hidden
                                    type="file" required name="file" onChange={
                                        (e: any) => {
                                            if (e.currentTarget.files) {
                                                setFile(e.currentTarget.files[0])
                                            }
                                        }}>
                                </FileInput >
                            </Button>
                        </>
                }
            </>
            <Button variant="outlined" startIcon={<Download />} onClick={() => HandleExport()}> Template</Button>
        </Stack>

    )
}