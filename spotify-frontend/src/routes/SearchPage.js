import { useState } from "react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { Icon } from '@iconify/react';
import { makeAuthenticatedGETRequest } from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";

const SearchPage = () => {
    const [isInputFocused, setIsInputFocused] = useState(false);

    // useState to get the value of the input text
    // searchText stores the text from the searchbar
    const [searchText, setSearchText] = useState("");
    const [songData,setSongData] = useState([]);

    // Function to call the search API
    const searchSong = async () => {
        const response = await makeAuthenticatedGETRequest("/song/get/songname/"+searchText);

        setSongData(response.data);
    }

    return(
        <LoggedInContainer currActiveScreen="search">
            <div className="w-full py-6">
                <div className={`w-1/3 p-3 text-sm rounded-full bg-black 
                px-5 flex text-white space-x-3 item-center
                ${isInputFocused ? "border border-white" : ""}`}>
                    <div><Icon icon="iconamoon:search-fill" className="text-lg"/></div>
                    <input type="text" 
                    placeholder="What do you want to listen to?"
                    className="w-full bg-black text-white placeholder-white
                    placeholder-opacity-50 outline-none"
                    onFocus={()=>{setIsInputFocused(true);}}
                    onBlur={()=>{setIsInputFocused(false);}}
                    value={searchText}
                    onChange={(e)=>{setSearchText(e.target.value);}}
                    onKeyDown={(e)=>{
                        if(e.key==="Enter"){
                            searchSong();
                        }
                    }}
                    />
                </div>

                <div className="pt-10 space-y-3 overflow-auto">
                    <div className="text-white pl-2">Showing search results for <span className="font-bold">{searchText}</span> :</div>
                    {songData.map(item=>{
                        return <SingleSongCard info={item} 
                        key={JSON.stringify(item)}
                        playSound={()=>{}}/>
                    })}
                </div>
            </div>
        </LoggedInContainer>
    )
};

export default SearchPage;