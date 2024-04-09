import React, { useEffect, useState } from 'react'
import { styled, Paper } from "@mui/material"
import * as mui from '@mui/icons-material'

const TagContainer = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'row wrap',
    backgroundColor: '#4c4c4c',
    color: '#eeeeee',
    marginBottom: '80px',
    padding: '20px',
    width: 'auto'
}))

const SelectedTags = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'column wrap',
    padding: '6px',
    width: '50%',
    background: '#101014',
    color: '#eeeeee'
}))

const TagsHidden = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'row wrap',
    background: 'none',
    color: '#eeeeee'
}))

const TagsVisible = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'row wrap',
    background: 'none',
    color: '#eeeeee'
}))

const TagsDropdown = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'row wrap',
    background: '#101014',
    color: '#eeeeee'
}))

export default function Tags() {
    const [availableTags, setAvailableTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [showSelectedTags, setShowSelectedTags] = useState(true)

    // gets the full list of available tags from the server
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/tag-list')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP Error ' + response.status);
            }
            return response.json()
        })
        .then(data => {
            if (data.tags) {
                setAvailableTags(data.tags)
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
    }, [])


    function selectTag(e) {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)
        const tag = formData.get('tags')
        
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag])
        }
    }

    return (
        <TagContainer>
            <SelectedTags>
                {showSelectedTags ? 
                    <TagsVisible>
                        <mui.KeyboardArrowDown onClick={() => setShowSelectedTags(!showSelectedTags)} />
                        <TagsDropdown>
                            {selectedTags.map(tag => {
                                return <span key={tag + 'Dropdown'}>{tag}</span>
                            })}
                        </TagsDropdown>
                    </TagsVisible> 
                : 
                    <TagsHidden>
                        <mui.KeyboardArrowUp onClick={() => setShowSelectedTags(!showSelectedTags)} />
                        <span>Show Tags</span>
                    </TagsHidden>
                }
            </SelectedTags>
            <form onSubmit={selectTag}>
                <input type='submit' value='Add Tag' />
                <select name="tags">
                    {availableTags.map(tag => {
                        return <option key={tag + 'Available'} value={tag}>{tag}</option>
                    })}
                </select>
            </form>
        </TagContainer>
    )
}