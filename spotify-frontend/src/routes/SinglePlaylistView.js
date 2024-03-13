import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";

const SinglePlaylistView = () => {
    const [playlistDetails, setPlaylistDetails] = useState({});
    const {playlistId} = useParams();

    useEffect(()=>{
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest("/playlist/get/playlist/"+playlistId);
            console.log(response);
            setPlaylistDetails(response);
        }
        getData();
    },[]);

    return (
        <LoggedInContainer currActiveScreen={"library"}>
            {playlistDetails._id && <div>
                <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
                    {playlistDetails.name}
                </div>
                <div className="pt-10 space-y-3 overflow-auto">
                    {playlistDetails.songs.map(item=>{
                        return <SingleSongCard info={item} 
                        key={JSON.stringify(item)}
                        playSound={()=>{}}/>
                    })}
                </div>
            </div>}
        </LoggedInContainer>
    );
};

export default SinglePlaylistView;