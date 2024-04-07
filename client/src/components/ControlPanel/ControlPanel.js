import { styled } from '@mui/material'
import ModelPanel from "./ModelPanel";

const ControlContainer = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    margin: '0',
    padding: '10px',
    width: '25%',
    height: 'auto',
    background: '#4c4c4c',
}))

export default function ControlPanel({...props}) {
    return (
        <ControlContainer>
            <ModelPanel />
        </ControlContainer>
    )
}
