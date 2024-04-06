import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { styled } from '@mui/material'
import Logout from '../oauth/Logout';
import ControlPanel from '../components/ControlPanel/ControlPanel';
import Navbar from '../components/Navbar/Navbar'
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import asteria from '../asteria_file.mp3'


const TtsToolContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch'
}))

const Workspace = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
}))

/**
 * TtsTool component, a functional component that has state values userEmail 
 * and it fetches the user details when the component first mounts and 
 * sets the userEmail value
 * @returns {React.Element} The rendered React element which display the 
 * logged in user's email and has a Logout button.
 */
export default function TtsTool() {
    // State variable for holding user's email
    const [userEmail, setUserEmail] = useState('');

    const [models, setModels] = useState([])
    const [tagPanelList, setTagPanelList] = useState([])
    const [audioTags, setAudioTags] = useState([])

    // Navigation hook for programmatically navigating with react router
    const navigate = useNavigate();
  
    /**
     * useEffect hook called when the component first mounts, it makes an API call 
     * to fetch user details and updates userEmail state variable. If the call fails, 
     * it redirects to the home page.
     */
    useEffect(() => { 
        fetch(process.env.REACT_APP_API_URL + '/api/auth/user', { credentials: 'include' })
            .then(response => {
                // If HTTP Status is not 200 OK, throw an error
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                // Convert response body to JSON
                return response.json();
            })
            .then(data => {
                // If data contains email attribute, set it as userEmail
                if (data.email) {
                    setUserEmail(data.email);
                } else {
                    // If data doesn't contain email, navigate to home ('/')
                    navigate('/');
                }
            })
            .catch((error) => {
                // Log error and navigate to home
                console.error('Fetch error:', error);
                navigate('/');
            });
        // Empty dependency array means this effect runs once when the component mounts.
    }, []);


    // This one is for the model populating the audio players
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/data/get-model-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP Error ' + response.status);
            }
            return response.json()
        })
        .then(data => {
            if (data.modelName && data.audio) {
                setModels([...models, {
                    name: data.modelName,
                    src: data.audio
                }])
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
    }, [])


    // This one gets the tag list for the control panel
    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/data/tag-list')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP Error ' + response.status);
            }
            return response.json()
        })
        .then(data => {
            if (data.tags) {
                setTagPanelList(data.tags)
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
    }, [])

    // called when a tag is selected from the tag panel
    function selectTag(event) {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)

        console.log("A tag was selected from the tag panel!")
        for (const item of formData) {
            console.log(item)
            setAudioTags([...audioTags, item[0]])
        }
    }

    // called when the tag is removed from the audio panel
    function removeTag(event) {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)

        const newAudioTags = audioTags

        console.log("A tag wants to be removed from the audio player!")
        for (const item of formData) {
            console.log(item)
            const index = newAudioTags.indexOf(item[0])
            newAudioTags.splice(index, 1)
            setAudioTags(newAudioTags)
        }
    }
  
    return (
        <>
            <Navbar user={userEmail}/>
            <TtsToolContainer>
                <ControlPanel tagList={tagPanelList} onTagSelect={selectTag} />
                <Workspace>
                    {/* Make sure to add functionality to change login button to 
                    logout in the Navbar tag to replace this */}
                    {/* <Logout /> */}
                    {models.map(model => {
                        return (
                            <AudioPlayer 
                            key={model.name}
                            src={model.src}
                            tagList={audioTags}
                            onTagSelect={removeTag}>
                                {model.name}
                            </AudioPlayer>
                        )
                    })}
                </Workspace>
            </TtsToolContainer>
        </>
    );
  };
