import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import songContext from "../contexts/songContext";

const LogoutButton = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const {currentSong,
        setCurrentSong,
        soundPlayed,
        setSoundPlayed,
        isPaused,
        setIsPaused
    } = useContext(songContext);

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
        <div className="bg-white w-20 h-10 mr-3 flex items-center
        justify-center rounded-full font-semibold cursor-pointer"
        onClick={(e) => {e.preventDefault(); logout(); pauseSound();}}>
            Logout
        </div>
    )
};

export default LogoutButton;