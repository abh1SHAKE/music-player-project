import { useState,useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";

const AddToPlaylistModal = ({closeModal, addSongToPlaylist}) => {

    const [myPlaylists, setMyPlaylists] = useState([]);
    useEffect(()=>{
        const getData = async () =>{
            const response = await makeAuthenticatedGETRequest("/playlist/get/me");
            setMyPlaylists(response.data);
        };
        getData();
    },[]);

    return (
        <div className="absolute bg-black w-screen h-screen 
        bg-opacity-70 flex justify-center items-center"
        onClick={closeModal}>
            <div className="bg-app-black w-1/4 rounded-md p-5" onClick={(e)=>{e.stopPropagation();}}>
                <div className="text-white mb-5 font-semibold text-lg cursor-default">
                    Select Playlist
                </div>
                <div className="space-y-5 flex flex-col justify-center items-center">
                    {myPlaylists.map(item => {
                        return <PlaylistListComponent info={item} addSongToPlaylist={addSongToPlaylist}/>
                    })}
                </div>
            </div>
        </div>
    )
};

const PlaylistListComponent = ({info, addSongToPlaylist}) => {
    return <div className="bg-app-black w-full flex items-center 
    space-x-4 hover:bg-gray-400 hover:bg-opacity-10 cursor-pointer p-2"
    onClick={()=>{addSongToPlaylist(info._id)}}>
        <div>
            <img src={info.thumbnail} className="w-10 h-10 rounded-sm" alt="thumbnail"/>
        </div>
        <div className="text-white font-semibold text-sm">
            {info.name}
        </div>
    </div>
}
export default AddToPlaylistModal;