import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material'
import { useContext } from 'react'
import { Cancel } from '@mui/icons-material'
import { GetCompanyDto } from '../../../dtos/company/company.dto'
import { ChoiceContext, CompanyChoiceActions } from '../../../contexts/dialogContext'
import CreateOrEditCompanyForm from '../../forms/company/CreateOrEditCompanyForm'

function CreateOrEditCompanyDialog({ company }: { company?: GetCompanyDto }) {
    const { choice, setChoice } = useContext(ChoiceContext)

    return (
        <Dialog fullScreen={Boolean(window.screen.width < 500)}
            open={choice === CompanyChoiceActions.create_oredit_company  ? true : false}
        >
            <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                setChoice({ type: CompanyChoiceActions.close_company })
                
            }
            }>
                <Cancel fontSize='large' />
            </IconButton>
            <DialogTitle sx={{ minWidth: '350px' }} textAlign={"center"}>{!company ? "New Company" : "Edit Company"}</DialogTitle>
            <DialogContent>
                 <CreateOrEditCompanyForm company={company}/>
            </DialogContent>
        </Dialog>
    )
}

export default CreateOrEditCompanyDialog