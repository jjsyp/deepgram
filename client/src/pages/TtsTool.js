import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material'
import ControlPanel from '../components/ControlPanel/ControlPanel';
import Navbar from '../components/Navbar/Navbar'
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';


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

    async function createModel() {

        let response = await fetch(process.env.REACT_APP_API_URL + "/modeldata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ model_name: "asteria" })
        });

        if (response.ok) {
            let result = await response.json();
            //console.log(result.audio_file);
            // handle the audio_file
            playAudio(result.audio_file);
        } else {
            console.log('HTTP-Error: ' + response.status);
            let error = await response.json();
            console.log(error);
            // handle error
        }
    }

    async function playAudio(base64String) {
        const binary_string = atob(base64String);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
    
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
        audioContext.decodeAudioData(bytes.buffer, function (buffer) {
            var source = audioContext.createBufferSource(); 
            source.buffer = buffer;
            source.connect(audioContext.destination); 
            source.start(0);
        }, function (e) {
            // Log the error message to console
            console.error("Error with decoding audio data" + e.err); 
        });
    }

    return (
        <>
            <Navbar user={userEmail} />
            <TtsToolContainer>
                <ControlPanel />
                <Workspace>
                    {models.map(model => {
                        return (
                            <AudioPlayer
                                key={model.name}
                                src={model.src}>
                                {model.name}
                            </AudioPlayer>
                        )
                    })}
                </Workspace>
            </TtsToolContainer>

            <button id="modelName" onClick={createModel}>Click</button>
        </>
    );
};
