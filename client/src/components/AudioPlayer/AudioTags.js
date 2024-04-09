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



export default function ModelTagTable({ modelName, selectedTags, onTagAdded, onTagRemoved }) {
    const [availableTags, setAvailableTags] = useState([])
    const [showSelectedTags, setShowSelectedTags] = useState(true)

    // Fetch available tags from server
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

    const selectTag = (e) => {
        const tag = e.target.value;
        // Call the parent's onTagAdded method to truly add this tag
        onTagAdded(tag);
    };

    // This will filter the selected tags array and update it
    const handleRemoveTag = (tag) => {
        // Inform the parent component we desire to remove this tag.
        onTagRemoved(tag);
    };

    return (
        <TagContainer>
            <SelectedTags>
                {showSelectedTags ?
                    <TagsVisible>
                        <mui.KeyboardArrowDown onClick={() => setShowSelectedTags(!showSelectedTags)} />
                        <TagsDropdown>
                            {selectedTags.map((tag) => (
                                <Tag key={tag}>
                                    {tag}
                                    <CloseButton onClick={() => handleRemoveTag(tag)}>
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