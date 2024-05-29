/**
 * Object that provides methods to make different API calls.
 * @namespace ApiServices
 */
const ApiServices = {
    /**
     * Fetches user details.
     * 
     * @method
     * @returns {Promise} Returns promise that resolves to data with user details
     */
    fetchUserDetails: () => fetch(process.env.REACT_APP_API_URL + '/api/auth/user', { credentials: 'include' }),

    /**
     * Fetches list of models.
     * 
     * @method
     * @returns {Promise} Returns promise that resolves to data with model list
     */
    fetchModelList: () => fetch(process.env.REACT_APP_API_URL + '/model-list', { credentials: 'include' }),

    /**
     * Creates a new model on the server.
     * 
     * @method
     * @param {string} modelName - Name of model to be created
     * @returns {Promise} Returns promise that resolves to data representing the new model
     */
    createModel: (modelName) => fetch(process.env.REACT_APP_API_URL + "/modeldata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ model_name: modelName })
    }),
    
    /**
     * Sends model tags to server database.
     * 
     * @method
     * @param {Array.<Object>} modelTags - Array of model tags to send to server
     * @returns {Promise} Returns promise that resolves to the server's response to the request
     */
    sendToDatabase: (modelTags) => fetch(process.env.REACT_APP_API_URL + "/database", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelTags }),
        credentials: "include",
    })
}

export default ApiServices;