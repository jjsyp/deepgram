import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Logout from '../oauth/Logout'; 

/**
 * TtsTool component, a functional component that has state values userEmail 
 * and it fetches the user details when the component first mounts and 
 * sets the userEmail value
 * @returns {React.Element} The rendered React element which display the 
 * logged in user's email and has a Logout button.
 */
const TtsTool = () => {
    // State variable for holding user's email
    const [userEmail, setUserEmail] = useState('');

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
        }).catch((error) => {
          // Log error and navigate to home
          console.error('Fetch error:', error);
          navigate('/');
        });
     // Empty dependency array means this effect runs once when the component mounts.
    }, []);
  
    return (
      <div>
        <h1>Welcome {userEmail}</h1>
        <Logout />
      </div>
    );
  };

export default TtsTool;