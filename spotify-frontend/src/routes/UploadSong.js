import TextInput from '../components/shared/TextInput';
import CloudinaryUpload from '../components/shared/CloudinaryUpload';
import { useState } from 'react';
import { makeAuthenticatedPOSTRequest } from '../utils/serverHelpers';
import { useNavigate } from 'react-router-dom';
import LoggedInContainer from '../containers/LoggedInContainer';

const UploadSong = () => {
    const [name, setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [duration, setDuration] = useState(null);
    const [playlistUrl, setPlaylistUrl] = useState("");
    const [uploadedSongFileName, setUploadedSongFileName] = useState();

    const navigate = useNavigate();

    const submitSong = async () => {
        console.log(name);
        console.log(thumbnail);
        console.log(playlistUrl);
        const data ={name, thumbnail, track: playlistUrl, duration};
        const response = await makeAuthenticatedPOSTRequest("/song/create",data);
        
        if(response.err){
            alert("Could not upload song");
            return;
        }
        alert("Success");
        navigate("/home");
    }

    return (
        <LoggedInContainer>
            <div className="content p-8 pt-0 overflow-auto">
                    <div className="text-xl font-semibold mb-5 text-white mt-8">
                        Upload your music 
                    </div>
                    <div className="w-2/3 flex space-x-4">
                        <div className="w-1/2">
                            <TextInput 
                            label="Name" 
                            labelClassName={"text-white"}
                            placeholder="Name"
                            value={name}
                            setValue={setName}
                            />
                        </div>
                        <div className="w-1/2">
                            <TextInput  
                            label="Thumbnail" 
                            labelClassName={"text-white"}
                            placeholder="Thumbnail"
                            value={thumbnail}
                            setValue={setThumbnail}
                            />
                        </div>
                    </div>
                    <div className="py-5">
                        {uploadedSongFileName ? (
                            <div 
                            className="bg-white text-black font-semibold rounded-full w-1/3 p-3">
                                {uploadedSongFileName.substring(0,35)}...
                            </div>
                        ) : (
                            <CloudinaryUpload 
                                setUrl={setPlaylistUrl} 
                                setDuration={setDuration}
                                setName={setUploadedSongFileName}
                            />
                        )
                        }
                    </div>
                    <div className="bg-app-green w-40 flex font-semibold items-center justify-center
                     p-3 rounded-full cursor-pointer" onClick={submitSong}>
                        Upload
                    </div>
                </div>
        </LoggedInContainer>
    )
};

export default UploadSong;