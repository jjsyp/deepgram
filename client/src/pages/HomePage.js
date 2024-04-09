import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import { styled } from '@mui/material';

const LoginButton = styled('button')(() => ({
    padding: '16px',
    background: '#101014',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    color: '#eeeeee',
    '&:hover': {
        background: '#4c4c4d',
        transition: '200ms'
    },
    '&:not(hover)': {
        transition: '200ms'
    },
    '&:active': {
        background: '#21c5a4',
        color: '#101014'
    }
}))

/**
 * HomePage component which contains a welcome message and a Login with Google button.
 * @returns {React.Element} The rendered React element which displays the welcome 
 * message and a Login with Google button.
 */
const HomePage = () => {
  /**
   * This function handles the login process by redirecting the user to the 
   * Google Sign-In page.
   */
  const loginHandler = () => {
    window.location.href = process.env.REACT_APP_API_URL + '/api/auth/signin-google';
  };

  return (
  <>
    <Navbar />
    <div className="welcome-container">
        <div className ="welcome-message">
            <h1>DeepGram TTS Benchmarking Tool</h1>
        </div>
        <div className="container">
            <LoginButton onClick={loginHandler}>Login with Google</LoginButton>
        </div>
    </div>
  </>
  );
};

export default HomePage;