import '../../loader.css';
import '../../styles/single-song-card.css'
import { useContext, useState } from "react";
import songContext from "../../contexts/songContext";

const formatSongDuration = (seconds) => {
    if(!seconds) return "N/A"

    const roundedSeconds = Math.round(seconds);
    const mins = Math.floor(roundedSeconds/60);
    const secs = roundedSeconds % 60;

    return `${mins} : ${secs.toString().padStart(2,"0")}`
}

const SingleSongCard = ({info, playSound}) => {
    console.log("SONG INFO: ",info);
    const {currentSong, setCurrentSong, isPaused, setIsPaused} = useContext(songContext);
    const isPlaying = currentSong && currentSong._id === info._id;
    const [imageError, setImageError] = useState(false);

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const shouldShowImage = info.thumbnail && isValidUrl(info.thumbnail) && !imageError;

    return <div className="flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-sm cursor-pointer"
    onClick={()=>{setCurrentSong(info);}}>
        <div className='album-cover relative'>
            {shouldShowImage ? (
                <div
                    className="w-16 h-16 rounded-sm"
                    style={{
                        backgroundImage: `url(${info.thumbnail})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                >
                    <img 
                        src={info.thumbnail} 
                        onError={() => setImageError(true)}
                        style={{display: 'none'}}
                        alt=""
                    />
                </div>
            ) : (
                <div className="w-16 h-16 rounded-sm bg-thumbnail flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="#969696ff" d="M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0M2.25 12a.26.26 0 0 1-.25-.26a10 10 0 0 1 2.75-6.62a.25.25 0 0 1 .18-.12a.24.24 0 0 1 .18.07l4.07 4.11a.25.25 0 0 0 .34 0a3.75 3.75 0 0 1 6.22 2.58a.25.25 0 0 0 .26.24h5.76a.26.26 0 0 1 .25.26a10 10 0 0 1-2.75 6.62a.25.25 0 0 1-.18.08a.24.24 0 0 1-.18-.07l-4.07-4.07a.25.25 0 0 0-.34 0a3.7 3.7 0 0 1-2.48.94a3.75 3.75 0 0 1-3.74-3.52A.25.25 0 0 0 8 12Z" />
                        <path fill="#969696ff" d="M9.75 12a2.25 2.25 0 1 0 4.5 0a2.25 2.25 0 1 0-4.5 0" />
                    </svg>
                </div>
            )}

            {isPlaying && !isPaused && (
                    <div className='loader absolute'>
                        <div className='loading-bar'></div>
                        <div className='loading-bar'></div>
                        <div className='loading-bar'></div>
                    </div>
                )}
        </div>
        <div className="flex w-full justify-between">
            <div className="text-white flex flex-col justify-center pl-5 w-5/6">
                <div className="hover:underline">
                    {info.name}
                </div>
                <div className="text-xs text-gray-400 hover:underline">
                    {info.artist.firstName + " " + info.artist.lastName}
                </div>
            </div>
            <div className="w-20 flex items-center justify-center text-gray-400 text-sm">
                <div>{formatSongDuration(info.duration)}</div>
            </div>
        </div>
    </div>
};

export default SingleSongCard;