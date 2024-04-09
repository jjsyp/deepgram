import { useMatch} from "react-router-dom";
import Logout from '../../oauth/Logout';


export default function Navbar({ ...props }) {
    const match = useMatch("/ttstool");

    return (
        <nav className="nav">
            <div></div> {/*Placeholder for future element if needed*/}
            <div className="welcomeMessage">
                {match && props.user && <span>Welcome {props.user}!</span>}
            </div>
            <div>
                {match && <Logout />}
            </div>
        </nav>
    );
}