/**
 * Redirect component. This functional component redirects the user
 * to the Google Sign-In page.
 * @returns {null} This component does not return or render anything.
 */
const Redirect = () => {
  window.location.href = process.env.REACT_APP_API_URL + '/api/auth/signin-google';
  return null;
};

export default Redirect;