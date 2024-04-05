import { styled, Paper } from "@mui/material"

const TagContainer = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'row wrap',
    backgroundColor: '#4c4c4c',
    color: '#eeeeee',
    marginBottom: '80px',
    padding: '20px',
    width: 'auto'
}))

export default function Tags({...props}) {
    return (
        <TagContainer>
            {props.tagList.map(tag => {
                return (
                    <div key={tag}>{tag}</div>
                )
            })}
        </TagContainer>
    )
}