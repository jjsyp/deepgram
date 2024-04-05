import { Paper, styled } from "@mui/material"

const TagContainer = styled(Paper)(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '10px',
    padding: '20px',
    width: 'auto',
    background: '#101014'
}))

const TagForm = styled('form')(() => ({
    
}))

const TagName = styled('input')(() => ({
    display: 'none'
}))

const SubmitTag = styled('input')(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    padding: '6px',
    border: 'none',
    background: 'none',
    color: '#eeeeee',
    fontSize: '16px',
    '&:hover': {
        fontSize: '20px',
        padding: '10px',
        background: '#303034',
        transition: '200ms'
    },
    '&:not(hover)': {
        transition: '200ms'
    }
}))


export default function TagPanel({...props}) {
    return (
        <TagContainer>
            {props.tagList.map(tag => {
                return (
                    <TagForm key={tag + 'TagForm'} onSubmit={props.onTagSelect}>
                        <TagName key={tag + 'TagName'} type="text" name={tag} />
                        <SubmitTag key={tag + 'SubmitTag'} type="submit" value={tag} />
                    </TagForm>
                )
            })}
        </TagContainer>
    )
}