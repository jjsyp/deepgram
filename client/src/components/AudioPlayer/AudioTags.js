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

const Tag = styled(Paper)(() => ({
    margin: '5px',
    padding: '5px',
    position: 'relative',
    display: 'inline-block',
    height: 'auto',
    backgroundColor: '#FFA500', // adjust as needed
}))

const CloseButton = styled(Paper)(() => ({
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff0000', // adjust as needed
    color: '#ffffff', // adjust as needed
    cursor: 'pointer'
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
        const tag = e.target.value;
    
        if (tag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        e.target.value = "";  // reset the dropdown to the no-selection state
    }
    function handleRemoveTag(index) {
        setSelectedTags(selectedTags.filter((tag, i) => i !== index));
    }

    return (
        <TagContainer>
            <SelectedTags>
                {showSelectedTags ?
                    <TagsVisible>
                        <mui.KeyboardArrowDown onClick={() => setShowSelectedTags(!showSelectedTags)} />

                        <TagsDropdown>
                            {selectedTags.map((tag, index) => (
                                <Tag key={tag + 'Dropdown'}>
                                    {tag}
                                    <CloseButton onClick={() => handleRemoveTag(index)}>
                                        x
                                    </CloseButton>
                                </Tag>
                            ))}
                        </TagsDropdown>
                    </TagsVisible>
                    :
                    <TagsHidden>
                        <mui.KeyboardArrowUp onClick={() => setShowSelectedTags(!showSelectedTags)} />
                        <span>Show Tags</span>
                    </TagsHidden>
                }
            </SelectedTags>
            <form>
                <select name="tags" onChange={selectTag}>
                    {availableTags.map(tag => {
                        return <option key={tag + 'Available'} value={tag}>{tag}</option>
                    })}
                </select>
            </form>
        </TagContainer>
    )
}