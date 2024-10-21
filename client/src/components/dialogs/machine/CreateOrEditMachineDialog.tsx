import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { MachineChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { GetMachineForEditDto } from '../../../dtos/machine.dto'
import CreateOrEditMachineForm from '../../forms/machine/CreateOrEditMachineForm'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { GetMachineForEdit } from '../../../services/MachineServices'

function CreateOrEditMachineDialog({ id }: { id?: string }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [machine, setMachine] = useState<GetMachineForEditDto>()

    const { data } = useQuery<AxiosResponse<GetMachineForEditDto>, BackendError>(["machines", id], async () => GetMachineForEdit(id || "fakeid"))

    useEffect(() => {
        if (data) {
            setMachine(data.data)
        }
        else
            setMachine(undefined)
    }, [data])
    return (
        <>
        <Dialog open= { choice === MachineChoiceActions.create_or_edit_machine ? true : false
}
onClose = {() => {
    setChoice({ type: MachineChoiceActions.close_machine })
}}
            >
    <IconButton style={ { display: 'inline-block', position: 'absolute', right: '0px' } } color = "error" onClick = {() => {
    setChoice({ type: MachineChoiceActions.close_machine })
}}>
    <Cancel fontSize='large' />
        </IconButton>

        < DialogTitle textAlign = "center" sx = {{ minWidth: '350px' }}> { machine? "Update Machine": "New Machine" } </DialogTitle>
            < DialogContent >
            <CreateOrEditMachineForm machine={ machine } />
                </DialogContent>
                </Dialog >
                </>
    )
}

export default CreateOrEditMachineDialog