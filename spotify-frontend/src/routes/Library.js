import { useState,useEffect } from "react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import { useNavigate } from "react-router-dom";

const Library = () => {

    const [myPlaylists, setMyPlaylists] = useState([]);
    useEffect(()=>{
        const getData = async () =>{
            const response = await makeAuthenticatedGETRequest("/playlist/get/me");
            setMyPlaylists(response.data);
        };
        getData();
    },[]);

    return (
        <LoggedInContainer currActiveScreen={"library"}>
            <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">My Playlists</div>
            <div className="grid gap-5  grid-cols-5">
                {myPlaylists.map(item=>{
                    return <Card key={JSON.stringify(item)} 
                    title={item.name} desc="" imgUrl={item.thumbnail}
                    playlistId={item._id}/>
                })}
            </div>
        </LoggedInContainer>
    )
}

const Card = ({title,desc,imgUrl,playlistId}) => {
    const navigate = useNavigate();
    return (
        <div className="bg-black bg-opacity-30 w-full p-4 rounded-lg cursor-pointer"
        onClick={()=>{navigate("/playlist/"+playlistId)}}>
            <div className="py-3">
                <img className="w-full rounded-md" alt="album-cover"
                src={imgUrl}></img>
            </div>
            <div className="text-white font-semibold py-2">{title}</div>
            <div className="text-gray-500 text-sm">{desc}</div>
        </div>
    )
}

export default Library;