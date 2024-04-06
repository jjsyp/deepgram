import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { styled } from '@mui/material';

const NavItems = styled('nav')(() => ({
    background: '#15171c'
}))

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  
    return (
        <Link to={to} {...props}>
            {children}
        </Link>
    )
}

export default function Navbar({...props}) {
    function logoutHandler() {
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
    
    return (
        <NavItems className="nav">
            <Link to="/" className="Deepgram" onClick={logoutHandler}>Deepgram</Link>
            {props.user ? <span>Welcome {props.user}!</span> : <></>}
            <CustomLink to="/signin-google">Login</CustomLink>
        </NavItems>
    )
}