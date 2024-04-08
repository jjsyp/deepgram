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
        //test fucntion, be sure to remove hard coded model name and replace with user input
        let response = await fetch(process.env.REACT_APP_API_URL + "/modeldata", { //endpoint may change after a blueprint controller is assigned a prefix route
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",     //credentials are required for the server to identify the user and store in apporpriate session
            body: JSON.stringify({ model_name: "asteria" }) //hard coded model name for testing, replace with user input
        });

        if (response.ok) {
            let result = await response.json();
            //console.log(result.audio_file);  //uncomment to see the base64 string of the audio file in the console, use to debug if audio is not playing
            // handle the audio_file
            playAudio(result.audio_file);//play the audio file
        } else {
            console.log('HTTP-Error: ' + response.status); //log the error status
            let error = await response.json();      
            console.log(error);
            // handle error
        }
    }

    async function playAudio(base64String) {  //function to play the audio file
        const binary_string = atob(base64String); //atob is a built in function to code the base64 string to binary which is needed to play the audio
        const len = binary_string.length;
        const bytes = new Uint8Array(len);  //create a new array of 8-bit unsigned integers
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);     //convert the binary string to a character code
        }
    
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();    //create a new audio context
    
        audioContext.decodeAudioData(bytes.buffer, function (buffer) {     //decode the audio data
            var source = audioContext.createBufferSource();         //create a new buffer source for the audio context
            source.buffer = buffer;                                 //set the buffer to the audio file
            source.connect(audioContext.destination);                //connect the audio context to the destination
            source.start(0);                                   //start the audio                 
        }, function (e) {                           //error handling
            // Log the error message to console
            console.error("Error with decoding audio data" + e.err); 
        });
    }

    async function sendToDatabase() {
        try {
            let response = await fetch(process.env.REACT_APP_API_URL + "/database", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
    
            if(!response.ok) {
                alert(`HTTP error! status: ${response.status}`);
            } else {
                alert('Data sent successfully!');
            }
        } catch(error) {
            console.error('Error:', error);
        }
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

            <button id="database" onClick={sendToDatabase}>DataBase</button>
        </>
    );
};
