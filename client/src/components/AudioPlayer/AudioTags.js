import { styled, Paper } from "@mui/material"

const TagContainer = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'column wrap',
    backgroundColor: '#4c4c4c',
    color: '#eeeeee',
    marginBottom: '80px',
    padding: '20px',
    width: 'auto'
}))

const TagName = styled('input')(() => ({
    display: "none"
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

export default function Tags({...props}) {
    return (
        <TagContainer>
            {props.tagList.map(tag => {
                return (
                    <form key={tag + 'TagForm'} onSubmit={props.onSelectTag}>
                        <TagName key={tag + 'TagName'} type="text" name={tag} />
                        <SubmitTag key={tag + 'SubmitTag'} type="submit" value={tag} />
                    </form>
                )
            })}
        </TagContainer>
    )
}