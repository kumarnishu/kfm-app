import { Dialog, DialogContent, DialogTitle, Button, Typography, Stack, CircularProgress, IconButton } from '@mui/material'
import { AxiosResponse } from 'axios';
import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';
import { BackendError } from '../../..';
import { queryClient } from '../../../main';
import { Cancel } from '@mui/icons-material';
import AlertBar from '../../snacks/AlertBar';
import { ChoiceContext, CompanyChoiceActions } from '../../../contexts/dialogContext';
import { GetCompanyDto } from '../../../dtos/company/company.dto';
import { ToogleCompanyStatus } from '../../../services/CompanyServices';


function ToogleCompanyStatusDialog({ company }: { company: GetCompanyDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const { mutate, isLoading, isSuccess, error, isError } = useMutation
        <AxiosResponse<any>, BackendError, {id:string}>
        (ToogleCompanyStatus, {
            onSuccess: () => {
                queryClient.invalidateQueries('companies')
            }
        })

    useEffect(() => {
        if (isSuccess) {
            setChoice({ type: CompanyChoiceActions.close_company })
        }

    }, [isSuccess])

    return (
        <Dialog open={choice === CompanyChoiceActions.toogle_company_status  ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                    setChoice({ type: CompanyChoiceActions.close_company })
            }}>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign="center">
                Toogle Status
            </DialogTitle>
            {
                isError ? (
                    <AlertBar message={error?.response.data.message} color="error" />
                ) : null
            }
            {
                isSuccess ? (
                    <AlertBar message="success" color="success" />
                ) : null
            }
            <DialogContent>
                <Typography variant="h4" color="error">
                    Are you sure to change status of the company ?

                </Typography>
            </DialogContent>
            <Stack
                direction="row"
                gap={2}
                padding={2}
                width="100%"
            >
                <Button fullWidth variant="outlined" color="error"
                    onClick={() => {
                        mutate({id:company._id})
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Toogle"}
                </Button>
                <Button fullWidth variant="contained" color="info"
                    onClick={() => {
                        setChoice({ type: CompanyChoiceActions.close_company })
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress /> :
                        "Cancel"}
                </Button>
            </Stack >
        </Dialog >
    )
}

export default ToogleCompanyStatusDialog
