import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import songContext from "../contexts/songContext";

const LogoutButton = () => {
    const navigate = useNavigate();
    const [, , removeCookie] = useCookies(['token']);
    const { soundPlayed } = useContext(songContext);

    const pauseSound = () => {
        if(soundPlayed){
            soundPlayed.pause();
        }
    }

    const logout = () => {
        removeCookie('token');
        navigate("/home");
    }

    return (
        <div className="bg-white py-1 px-3 mr-3 flex items-center
        justify-center rounded-full font-semibold cursor-pointer"
        onClick={(e) => {e.preventDefault(); logout(); pauseSound();}}>
            Logout
        </div>
    )
};

export default LogoutButton;