import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { SparePartChoiceActions, ChoiceContext } from '../../../contexts/dialogContext'
import { Cancel } from '@mui/icons-material'
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import { BackendError } from '../../..'
import { GetSparePartForEdit } from '../../../services/SparePartServices'
import { GetSparePartForEditDto } from '../../../dtos/spare.part.dto'
import CreateOrEditSparePartForm from '../../forms/parts/CreateOrEditSparePartForm'

function CreateOrEditSparePartDialog({ id }: { id?: string }) {
    const { choice, setChoice } = useContext(ChoiceContext)
    const [part, setSparePart] = useState<GetSparePartForEditDto>()

    const { data } = useQuery<AxiosResponse<GetSparePartForEditDto>, BackendError>(["parts", id], async () => GetSparePartForEdit(id || "fakeid"))

    useEffect(() => {
        if (data) {
            setSparePart(data.data)
        }
        else
            setSparePart(undefined)
    }, [data])
    return (
        <>
            <Dialog open={choice === SparePartChoiceActions.create_or_edit_part ? true : false
            }
                onClose={() => {
                    setChoice({ type: SparePartChoiceActions.close_part })
                }}
            >
                <IconButton style={{ display: 'inline-block', position: 'absolute', right: '0px' }} color="error" onClick={() => {
                    setChoice({ type: SparePartChoiceActions.close_part })
                }}>
                    <Cancel fontSize='large' />
                </IconButton>

                < DialogTitle textAlign="center" sx={{ minWidth: '350px' }}> {part ? "Update SparePart" : "New SparePart"} </DialogTitle>
                < DialogContent >
                    <CreateOrEditSparePartForm part={part} />
                </DialogContent>
            </Dialog >
        </>
    )
}

export default CreateOrEditSparePartDialog