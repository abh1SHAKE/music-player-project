import { useContext } from "react";
import songContext from "../../contexts/songContext";

const SingleSongCard = ({info, playSound}) => {
    const {currentSong,setCurrentSong} = useContext(songContext);
    console.log(info.length);

    return <div className="flex hover:bg-gray-400 hover:bg-opacity-10 p-2 rounded-sm"
    onClick={()=>{setCurrentSong(info);}}>
        <div
            className="w-16 h-16 bg-cover bg-center rounded-sm" style={{
                backgroundImage: `url(${info.thumbnail})`
            }}
        ></div>
        <div className="flex w-full justify-between">
            <div className="text-white flex flex-col justify-center pl-5 w-5/6">
                <div className="cursor-pointer hover:underline">
                    {info.name}
                </div>
                <div className="text-xs text-gray-400 cursor-pointer hover:underline">
                    {info.artist.firstName + " " + info.artist.lastName}
                </div>
            </div>
            <div className="w-20 flex items-center justify-center text-gray-400 text-sm">
                <div>3:47</div>
            </div>
        </div>
    </div>
};

export default SingleSongCard;