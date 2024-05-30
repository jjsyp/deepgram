import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar'
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import ModelTagTable from '../components/AudioPlayer/AudioTags';
import '../styles.css';
import TextContainer from '../components/Contaniers/TextContainer';
import QuantifierContainer from '../components/Contaniers/QuantifierContainer';
import ApiServices from '../services/ApiServices';

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

    /*const for setting the value of the quantifier.  Original dev did not have
    sufficient info on how the quantifier value is set, as such please use the usestate's 
    setQuantifierText or build a getQuantifier function for updating new quantifiers as 
    in house dev team sees fit */
    const [quantifierText, setQuantifierText] = useState("");

    // Navigation hook for programmatically navigating with react router
    const navigate = useNavigate();

    /**
     * useEffect hook called when the component first mounts, it makes an API call 
     * to fetch user details and updates userEmail state variable. If the call fails, 
     * it redirects to the home page.
     */
    useEffect(() => {
        ApiServices.fetchUserDetails().then(response => {
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

        ApiServices.fetchModelList().then(response => {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
            .then(data => setAllModels(data.models))
            .catch(error => console.error('Fetch error:', error));
        // Empty dependency array means this effect runs once when the component mounts.
    }, []);


    /**
     * This function handles model selection and creates model.
     * @param {object} e refers to event object triggered when a model is selected.
     */
    async function handleModelSelection(e) {
        const newModel = e.target.value;

        // Call createModel function with selected model's name
        const createdModel = await createModel(newModel);


        // Add the new model and its audio file to the chosenModels array 
        // and remove it from allModels
        setChosenModels([...chosenModels, { name: newModel, audio: createdModel.audio_file, text: createdModel.audio_text }]);
        setAllModels(allModels.filter(model => model !== newModel));

        // Add a new audio player state
        setAudioPlayerStates(audioPlayerStates => [...audioPlayerStates, true]); // New audio player is visible 

        // Reset currentModel to empty string
        setCurrentModel('');
    }

    /**
    * This function makes a POST request to '/createModel' endpoint to create a model with given name.
    * @param {string} modelName The name of the model to be created.
    * @return {object} The created model object.
    */
    async function createModel(modelName) {
        let response = await ApiServices.createModel(modelName);
        if (response.ok) {
            let result = await response.json();

            return result;
        } else {
            console.log('HTTP-Error: ' + response.status);
            let error = await response.json();
            console.log(error);
        }
    }

    /**
     * This function sends model-tags pairs to the backend to be stored in database.
     */
    async function saveAndClear() {
        try {
            // Map over all chosen models and create an array of model-tag pairs
            const modelTags = chosenModels.map(model => {
                const potentialScore = parseInt(selectedScores[model.name], 10);
                return {
                    modelName: model.name,
                    tags: tagDictionary[model.name] || [], // Retrieve tags for this model from `tagDictionary`
                    score: isNaN(potentialScore) ? -1 : potentialScore,
                    quantifier: quantifierText

                };
            });

            let response = await ApiServices.sendToDatabase(modelTags);

            if (!response.ok) {
                alert(`HTTP error! status: ${response.status}`);
            } else {
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

    /**
    * This function sends data to the database, retains current models, resets tags and loads new audio files.
    */
    async function saveAndKeep() {
        try {
            // Map over all chosen models and create an array of model-tag pairs
            const modelTags = chosenModels.map(model => {
                const potentialScore = parseInt(selectedScores[model.name], 10);
                return {
                    modelName: model.name,
                    tags: tagDictionary[model.name] || [], // Retrieve tags for this model from `tagDictionary`
                    score: isNaN(potentialScore) ? -1 : potentialScore,
                    quantifier: quantifierText
                };
            });

            let response = await ApiServices.sendToDatabase(modelTags);

            if (!response.ok) {
                alert(`HTTP error! status: ${response.status}`);
            } else {
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
                    setChosenModels(prevModels => [...prevModels, { name: newModel, audio: createdModel.audio_file, text: createdModel.audio_text }]);
                    setAudioPlayerStates(prevStates => [...prevStates, true]);

                }

            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
    * This function handles the operation of adding tag to tagDictionary state object.
    * @param {string} model parameter is the model for which tag needs to be added.
    * @param {string} tag parameter refers to the tag to be added.
    */
    const handleTagAdded = (model, tag) => {
        setTagDictionary(prevDict => ({
            ...prevDict,
            [model]: [...(prevDict[model] || []), tag]
        }));
    };


    /**
    * This function handles the operation of removing tag from tagDictionary state object.
    * @param {string} model parameter is the model from which tag needs to be removed.
    * @param {string} tag parameter refers to the tag to be removed.
    */
    const handleTagRemoved = (model, tag) => {
        setTagDictionary(prevDict => ({
            ...prevDict,
            [model]: (prevDict[model] || []).filter(existingTag => existingTag !== tag)
        }));
    };


    /**
    * This function handles the operation of removing the selected model from chosenModels state array.
    * @param {string} modelName is the model name to be removed.
    */
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

    /**
    * This function handles the operation of changing score for a selected model.
    * @param {string} model parameter refers to the model for which score needs to be updated.
    * @param {string} score parameter refers to the new score to be set.
    */
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
                    {
                        /* Origininal developer did not have details on how the quantifier is saved or accessed
                        on DeepGram's side, as such the quantifier container has been set up to display text
                        but will need a function built in house to populate the appropriate value
                        
                        env params control if quantifer div is displayed*/
                    }
                    <div className={`${process.env.REACT_APP_HIDE_QUANTIFIER === 'true' ? 'hidden' : ''}`}>
                        <QuantifierContainer text={quantifierText} />
                    </div>
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
                    <button onClick={saveAndKeep}>Save and Keep</button>
                    <br></br>
                    <br></br>
                    <button onClick={saveAndClear}>Save and Clear</button>
                </div>
                <div className="right-column">
                    {
                        /*env params control if quantifer div is displayed*/
                    }
                    <div className={`${process.env.REACT_APP_HIDE_TEXT === 'true' ? 'hidden' : ''}`}>
                        <TextContainer text={chosenModels.length > 0 ? chosenModels[0].text : "No model audio loaded"} />
                    </div>
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