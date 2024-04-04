import { styled, Paper } from '@mui/material'

const ModelContainer = styled(Paper)(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '10px',
    padding: '20px',
    width: 'auto',
    background: '#101014',
    color: '#eeeeee'
}))

const ModelPicker = styled('form')(() => ({
    marginLeft: 'auto',
    marginRight: 'auto'
}))

const InputModel = styled('input')(() => ({
    padding: '6px',
    outlineWidth: '0',
    border: 'none',
    borderBottom: '2px solid #eeeeee',
    background: 'none',
    color: '#eeeeee'
}))

export default function ModelPanel() {
    

    return (
        <ModelContainer>
            <ModelPicker action="ModelPanel.js" method="GET">
                <InputModel type="text" name="model" placeholder='Enter Model Name' />
            </ModelPicker>
        </ModelContainer>
    )
}