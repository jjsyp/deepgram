import { styled } from '@mui/material'
import ModelPanel from "./ModelPanel";

const ControlContainer = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    margin: '0',
    padding: '10px',
    width: '25%',
    height: '100%',
    background: 'black',
}))

export default function ControlPanel() {
    return (
        <>
            <ControlContainer>
                <ModelPanel />
            </ControlContainer>
        </>
    )
}
