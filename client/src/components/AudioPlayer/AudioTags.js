import React, { useEffect, useState } from 'react'
import "./audiotags.css";


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
        <div className="tag_container">
            <div className="selected_tags">
                    {selectedTags.map((tag) => (
                        <div className="tag_background" key={tag}>
                            {tag}
                            <div className="close_button" onClick={() => handleRemoveTag(tag)}>
                                x
                            </div>
                        </div>
                    ))}
            </div>
            <form>
                <div>
                    <select name="tags" value={dropdownTag} onChange={selectTag}>
                        <option key="default" value="">Select a tag</option>
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
        </div>
    )
}