import { Alert, Snackbar } from '@mui/material'
import { useContext, useState } from 'react'
import { AlertContext } from '../../contexts/alertContext'


type Props = {
    message: string,
    color: "error" | "warning" | "success" | "info",
    variant?: "filled" | "outlined"
}
function AlertBar({ message, color, variant }: Props) {
    const { setAlert } = useContext(AlertContext)
    const [display, setDisplay] = useState(Boolean(message))
    return (
        <Snackbar
            open={display}
            color={color}
            autoHideDuration={3000}
            onClose={() => {
                setAlert(undefined)
                setDisplay(false)
            }
            }
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            message={message}
        >
            <Alert variant={variant || "filled"} onClose={() => setDisplay(false)} severity={color} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>

    )
}

export default AlertBar