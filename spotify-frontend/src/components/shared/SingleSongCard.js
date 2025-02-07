import '../../loader.css';
import '../../styles/single-song-card.css'
import { useContext } from "react";
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
    const {currentSong,setCurrentSong} = useContext(songContext);
    const {isPaused, setIsPaused} = useContext(songContext);
    const isPlaying = currentSong && currentSong._id === info._id;

    return <div className="flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-sm cursor-pointer"
    onClick={()=>{setCurrentSong(info);}}>
        <div className='album-cover relative'>
            <div
                className="w-16 h-16 bg-cover bg-center rounded-sm" style={{
                    backgroundImage: `url(${info.thumbnail})`
                }}
            ></div>

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