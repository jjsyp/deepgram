import { styled, Paper } from '@mui/material'
import { useState } from 'react'

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
    const [modelName, setModelName] = useState('')

    function handleSubmit(event) {
        event.preventDefault()
    }

    return (
        <ModelContainer>
            <ModelPicker onSubmit={handleSubmit}>
                <InputModel 
                type="text" 
                name="model" 
                placeholder='Enter Model Name' 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)}/>
            </ModelPicker>
            <div>
                {modelName}
            </div>
        </ModelContainer>
    )
}