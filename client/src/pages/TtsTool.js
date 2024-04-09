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

    // New state variable for model selection
    const [allModels, setAllModels] = useState([]);
    const [currentModel, setCurrentModel] = useState('');
    const [chosenModels, setChosenModels] = useState([]);

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
        fetch(process.env.REACT_APP_API_URL + '/model-list', { credentials: 'include' }) // replace '/model-list-endpoint' with the actual endpoint for fetching model names
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response.json();
            })
            .then(data => setAllModels(data.models))
            .catch(error => console.error('Fetch error:', error));
        // Empty dependency array means this effect runs once when the component mounts.
    }, []);

    useEffect(() => {
        console.log(chosenModels);
    }, [chosenModels]);
    
    //function to handle the model selection
    async function handleModelSelection(e) {
        const newModel = e.target.value;

        // Call createModel function with selected model's name
        const createdModel = await createModel(newModel);
        

        // Add the new model and its audio file to the chosenModels array 
        // and remove it from allModels
        setChosenModels([...chosenModels, { name: newModel, audio: createdModel.audio_file }]);
        console.log(chosenModels);
        setAllModels(allModels.filter(model => model !== newModel));

        // Reset currentModel to empty string
        setCurrentModel('');
    }

    async function createModel(modelName) {
        let response = await fetch(process.env.REACT_APP_API_URL + "/modeldata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ model_name: modelName })
        });

        if (response.ok) {
            let result = await response.json();
            playAudio(result.audio_file);
<<<<<<< HEAD
            return result; 
=======
            let audioBase64 = `data:audio/mp3;base64,${result.audio_file}`; // adding prefix
            return audioBase64; // return the base64 string
>>>>>>> unified_testing_playaudio
        } else {
            console.log('HTTP-Error: ' + response.status);
            let error = await response.json();
            console.log(error);
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

            if (!response.ok) {
                alert(`HTTP error! status: ${response.status}`);
            } else {
                alert('Data sent successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <>
          <Navbar user={userEmail} />
          <div className="chosen-models">
            Select a model:
            <select value={currentModel} onChange={handleModelSelection}>
              <option value="">Select a model</option>
              {allModels.map((model, index) =>
                <option key={index} value={model}>{model}</option>
              )}
            </select>
            <div className="chosen-models">
<<<<<<< HEAD
              Chosen Models: {chosenModels.map(model => model.name).join(', ')}
=======
                Select a model:
                <select value={currentModel} onChange={handleModelSelection}>
                    <option value="">Select a model</option>
                    {allModels.map((model, index) =>
                        <option key={index} value={model}>{model}</option>
                    )}
                </select>
                <div className="chosen-models">
                    Chosen Models: {chosenModels.map(model => model.name).join(', ')}
                </div>
                <button onClick={sendToDatabase}>Send to Database</button>
                {
                    chosenModels.map((model, i) =>
                        <AudioPlayer key={i} src={model.audio_file}>
                            {model.name}
                        </AudioPlayer>
                    )
                }
>>>>>>> unified_testing_playaudio
            </div>
            <button onClick={sendToDatabase}>Send to Database</button>
            {
              chosenModels.map((model, i) => {
                // Convert base64 to ArrayBuffer
                const byteCharacters = atob(model.audio);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
      
                // Create blob from ArrayBuffer
                const blob = new Blob([byteArray], { type: "audio/mpeg" });
                const blobUrl = URL.createObjectURL(blob);
      
                return (
                  <AudioPlayer key={i} src={blobUrl}>
                    {model.name}
                  </AudioPlayer>
                );
              })
            }
          </div>
        </>
      );
};
