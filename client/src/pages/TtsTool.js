import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar'
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import ModelTagTable from '../components/AudioPlayer/AudioTags';
import '../styles.css';


/**
 * TtsTool component, a functional component that has state values userEmail 
 * and it fetches the user details when the component first mounts and 
 * sets the userEmail value
 * @returns {React.Element} The rendered React element which display the 
 * logged in user's email and has a Logout button.
 */
export default function TtsTool() {
    // Initialize initial states
    const initialAudioStates = [];
    const initialTagStates = {};

    // State variable for holding user's email
    const [userEmail, setUserEmail] = useState('');


    // New state variable for model selection
    const [allModels, setAllModels] = useState([]);
    const [currentModel, setCurrentModel] = useState('');
    const [chosenModels, setChosenModels] = useState([]);
    const [tagDictionary, setTagDictionary] = useState(initialTagStates);
    const [audioPlayerStates, setAudioPlayerStates] = useState(initialAudioStates);
    const [selectedScores, setSelectedScores] = useState({});

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


    //function to handle the model selection
    async function handleModelSelection(e) {
        const newModel = e.target.value;

        // Call createModel function with selected model's name
        const createdModel = await createModel(newModel);


        // Add the new model and its audio file to the chosenModels array 
        // and remove it from allModels
        setChosenModels([...chosenModels, { name: newModel, audio: createdModel.audio_file }]);
        setAllModels(allModels.filter(model => model !== newModel));

        // Add a new audio player state
        setAudioPlayerStates(audioPlayerStates => [...audioPlayerStates, true]); // New audio player is visible 

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

            return result;
        } else {
            console.log('HTTP-Error: ' + response.status);
            let error = await response.json();
            console.log(error);
        }
    }


    async function sendToDatabase() {
        try {
            // Map over all chosen models and create an array of model-tag pairs
            const modelTags = chosenModels.map(model => {
                const potentialScore = parseInt(selectedScores[model.name], 10);
                return {
                    modelName: model.name,
                    tags: tagDictionary[model.name] || [], // Retrieve tags for this model from `tagDictionary`
                    score: isNaN(potentialScore) ? -1 : potentialScore
                };
            });

            let response = await fetch(process.env.REACT_APP_API_URL + "/database", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelTags }), // Send modelTags to server
                credentials: "include",
            });

            if (!response.ok) {
                alert(`HTTP error! status: ${response.status}`);
            } else {
                alert('Data sent successfully!');
                // Get a copy of the chosen models' names before clearing them
                const oldModelNames = chosenModels.map(model => model.name);
                setChosenModels([]);
                setAudioPlayerStates(initialAudioStates);
                setTagDictionary(initialTagStates);

                // Add the old models back to the allModels array again
                setAllModels(prev => [...prev, ...oldModelNames]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //function that sends all information to the database but retains the current models, resets the tags, and loads new audio
    async function saveAndKeep() {
        try {
            // Map over all chosen models and create an array of model-tag pairs
            const modelTags = chosenModels.map(model => {
                const potentialScore = parseInt(selectedScores[model.name], 10);
                return {
                    modelName: model.name,
                    tags: tagDictionary[model.name] || [], // Retrieve tags for this model from `tagDictionary`
                    score: isNaN(potentialScore) ? -1 : potentialScore
                };
            });

            console.log(modelTags);
            let response = await fetch(process.env.REACT_APP_API_URL + "/database", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelTags }), // Send modelTags to server
                credentials: "include",
            });

            if (!response.ok) {
                alert(`HTTP error! status: ${response.status}`);
            } else {
                alert('Data sent successfully!');
                // Get a copy of the chosen models' names before clearing them
                const oldModelNames = chosenModels.map(model => model.name);
                //keep the current choosen models and their respective audio tables and tag tables
                setChosenModels([]);
                setAudioPlayerStates(initialAudioStates);
                setTagDictionary(initialTagStates);
                setSelectedScores({});


                //iterate over the chosen models and create a new audio file for each model
                for (let i = 0; i < oldModelNames.length; i++) {
                    const newModel = oldModelNames[i];
                    const createdModel = await createModel(newModel);
                    setChosenModels(prevModels => [...prevModels, { name: newModel, audio: createdModel.audio_file }]);
                    setAudioPlayerStates(prevStates => [...prevStates, true]);

                }

            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleTagAdded = (model, tag) => {
        setTagDictionary(prevDict => ({
            ...prevDict,
            [model]: [...(prevDict[model] || []), tag]
        }));
    };

    const handleTagRemoved = (model, tag) => {
        setTagDictionary(prevDict => ({
            ...prevDict,
            [model]: (prevDict[model] || []).filter(existingTag => existingTag !== tag)
        }));
    };

    function handleRemove(modelName) {
        setChosenModels(prevModels => prevModels.filter(model => model.name !== modelName));

        // Add here: remove tag selections for this model
        setTagDictionary(prevTags => {
            const newTags = { ...prevTags };
            delete newTags[modelName];
            return newTags;
        });

        setAllModels(prevModels => [...prevModels, modelName]);
    }

    //function to handle score selection
    const handleScoreChanged = (model, score) => {
        setSelectedScores({
            ...selectedScores,
            [model]: score,
        });
    };

    return (
        <>
            <Navbar user={userEmail} />
            <div className="main-container">
                <div className="left-column">
                    <div className="select-models">Choose a model</div>
                    <select value={currentModel} onChange={handleModelSelection}>
                        <option value="">Select a model</option>
                        {allModels.map((model, index) =>
                            <option key={index} value={model}>{model}</option>
                        )}
                    </select>
                    <div className="chosen-models">
                        Chosen Models:
                        {chosenModels.map(model => (
                            <div key={model.name}>{model.name}</div>
                        ))}
                    </div>
                    <button onClick={sendToDatabase}>Send to Database</button>
                    <br></br>
                    <br></br>
                    <button onClick={saveAndKeep}>Save and Keep</button>
                </div>
                <div className="right-column">
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

                            // Check if audio player state at this index is not false before rendering
                            if (audioPlayerStates[i]) {
                                return (
                                    <div key={i}>
                                        <AudioPlayer src={blobUrl}>
                                            {model.name}
                                            <button
                                                className="remove-btn"
                                                onClick={() => handleRemove(model.name)}>X</button>
                                        </AudioPlayer>
                                        <ModelTagTable
                                            modelName={model.name}
                                            selectedTags={tagDictionary[model.name] || []}
                                            onTagAdded={(tag) => handleTagAdded(model.name, tag)}
                                            onTagRemoved={(tag) => handleTagRemoved(model.name, tag)}
                                            onScoreChanged={(score) => handleScoreChanged(model.name, score)}
                                        />
                                    </div>
                                );
                            }
                            return null;  // Return null if audioPlayerStates[i] is false.
                        })
                    }
                </div>
            </div>
        </>
    );
}