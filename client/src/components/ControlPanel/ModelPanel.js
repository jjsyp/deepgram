import { styled } from '@mui/material'

const ModelContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
    padding: '20px',
    width: '100%',
    background: '#4c4c4c'
}))

export default function ModelPanel() {
    return (
        <>
            <ModelContainer>
                <span>Model 1</span>
                <span>Model 1</span>
                <span>Model 1</span>
            </ModelContainer>
        </>
    )
}