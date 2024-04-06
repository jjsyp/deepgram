import { styled } from '@mui/material';
import React from 'react';

/**
 * React component for Logout functionality. Sends a POST request to the server 
 * to log the user out and, if successful, redirects the user to the Home page.
 * If there is an error, it alerts the user with the error message.
 * @returns {React.Element} The rendered React element.
 */

const DeepgramLogo = styled('button')(() => ({
    background: 'none',
    border: 'none'
}))

export default function Logout({children}) {

  /**
   * This function handles the logout process by sending a fetch request 
   * to the server's /api/auth/logout endpoint. Upon receiving a 
   * successful response, it redirects the user to the Home page.
   * If there is an error in the response, it throws an error with a 
   * message included in the response. If the fetch request itself 
   * fails, it alerts the user with the error message.
   */
  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_URL + '/api/auth/logout', { 
      method: 'POST',
      credentials: 'include' 
    })
    .then(response => {
      if(response.ok) {
        window.location.href = '/';
      } else {
        return response.json().then(err => { throw Error(err.message) })
      }
    })
    .catch(error => {
      alert(`Logout failed: ${error}`);
    });
  };

  return <DeepgramLogo onClick={logoutHandler}>{children}</DeepgramLogo>;
};
