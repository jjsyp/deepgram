import React, { useEffect, useState } from 'react'
import { styled, Paper } from "@mui/material"
import * as mui from '@mui/icons-material'

//main container
const TagContainer = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'row wrap',
    backgroundColor: '#4c4c4c',
    color: '#eeeeee',
    marginBottom: '50px',
    padding: '10px',
    width: '100%',
    borderBottomLeftRadius: '10px',  // This rounds the top-left corner
    borderBottomRightRadius: '10px',  // This rounds the top-right corner
}))

// The outer container for the currently selected tags
const SelectedTags = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'column wrap',
    padding: '3px',
    width: '60%',
    background: '#101014',
    color: '#eeeeee'
}))

//the inner container for the currently selected tags
const TagsDropdown = styled(Paper)(() => ({
    display: 'flex',
    flexFlow: 'row wrap',
    background: '#101014',
    color: '#eeeeee'
}))

//the background block behind the tag text
const Tag = styled(Paper)(() => ({
    margin: '5px',
    padding: '5px',
    position: 'relative',
    display: 'inline-block',
    padding: '5px 25px 5px 5px',
    height: 'auto',
    backgroundColor: '#FFA500', // adjust as needed
}))

// Close button for removing tags
const CloseButton = styled(Paper)(() => ({
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '1px 5px',
    backgroundColor: '#ff0000', // adjust as needed
    color: '#ffffff', // adjust as needed
    cursor: 'pointer'
}))

const DropdownContainer = styled(Paper)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '40%',  // Adjust accordingly for your needs. 
    background: '#101014',  // Same background as other components.
}))



export default function ModelTagTable({ modelName, selectedTags, onTagAdded, onTagRemoved }) {
    const [availableTags, setAvailableTags] = useState([])
    const [dropdownTag, setDropdownTag] = useState("")
    const selectableTags = availableTags.filter(tag => !selectedTags.includes(tag));
    const [selectedScore, setSelectedScore] = useState("");

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
                    setAvailableTags(data.tags.sort())
                }
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }, [])

    const selectTag = (e) => {
        const tag = e.target.value;
        onTagAdded(tag);
        setDropdownTag("");
        setAvailableTags(availableTags.filter(t => t !== tag).sort());
    };

    // This will filter the selected tags array and update it
    const handleRemoveTag = (tag) => {
        onTagRemoved(tag);
        setAvailableTags([...availableTags, tag].sort()); // Add removed tag back to available tags
    };

    const selectScore = (e) => {
        const score = e.target.value;
        setSelectedScore(score);
    };

    return (
        <TagContainer>
            <SelectedTags>
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
            </SelectedTags>
            <form>
                <div style={{ marginRight: '20px' }}>
                    <select name="tags" value={dropdownTag} onChange={selectTag}>
                        <option key="default-tag" value="">Select a tag</option>
                        {selectableTags.map(tag =>
                            <option key={tag + 'Available'} value={tag}>{tag}</option>
                        )}
                    </select>
                </div>
                <div>
                    <select name="numbers" value={selectedScore} onChange={selectScore}>
                        <option key="default-number" value="">Rate Model</option>
                        <option key="no-rating" value="No Rating">No Rating</option>
                        {[...Array(11).keys()].map(num =>
                            <option key={num} value={num}>{num}</option>
                        )}
                    </select>
                </div>
            </form>
        </TagContainer>
    )
}