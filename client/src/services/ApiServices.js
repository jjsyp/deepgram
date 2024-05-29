// apiServices.js
export default {
    fetchUserDetails: () => fetch(process.env.REACT_APP_API_URL + '/api/auth/user', { credentials: 'include' }),
    fetchModelList: () => fetch(process.env.REACT_APP_API_URL + '/model-list', { credentials: 'include' }),
    createModel: (modelName) => fetch(process.env.REACT_APP_API_URL + "/modeldata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ model_name: modelName })
    }),
    sendToDatabase: (modelTags) => fetch(process.env.REACT_APP_API_URL + "/database", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelTags }), // Send modelTags to server
        credentials: "include",
    })
}