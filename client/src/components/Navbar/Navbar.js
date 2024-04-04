import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { styled } from '@mui/material';

const NavItems = styled('nav')(() => ({
    background: '#15171c'
}))

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  
    return (
        <>
            <Link to={to} {...props}>
                {children}
            </Link>
        </>
    )
}

export default function Navbar({...props}) {
    return (
        <>
            <NavItems className="nav">
                <Link to="/" className="Deepgram">Deepgram</Link>
                {props.user ? <span>Welcome {props.user}!</span> : <></>}
                <CustomLink to="/signin-google">Login</CustomLink>
            </NavItems>
        </>
    )
}