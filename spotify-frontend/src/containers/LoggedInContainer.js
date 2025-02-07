import '../styles/logged-in-container.css';
import { Icon } from '@iconify/react';
import IconText from '../components/shared/IconText';
import NavbarText from '../components/shared/NavbarText';
import {Howl, Howler} from "howler";
import { useContext, useLayoutEffect, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import songContext from '../contexts/songContext';
import LogoutButton from '../routes/Logout';

import CreatePlaylistModal from '../modals/CreatePlaylistModal';
import AddToPlaylistModal from '../modals/AddToPlaylistModal';
import { makeAuthenticatedPOSTRequest } from '../utils/serverHelpers';

const LoggedInContainer = ({children, currActiveScreen, currUser}) => {
    const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
    const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);

    const [songProgress, setSongProgress] = useState(0);

    const {currentSong,
            setCurrentSong,
            soundPlayed,
            setSoundPlayed,
            isPaused,
            setIsPaused
        } = useContext(songContext);

    const firstUpdate = useRef(true);

    const formatSongDuration = (seconds) => {
        if(!seconds) return "-:--"
    
        const roundedSeconds = Math.round(seconds);
        const mins = Math.floor(roundedSeconds/60);
        const secs = roundedSeconds % 60;
    
        return `${mins}:${secs.toString().padStart(2,"0")}`
    }

    useEffect(() => {
        if(!soundPlayed) {
            return;
        }

        const updateProgress = setInterval(() => {
            if(!isPaused && soundPlayed.playing()) {
                setSongProgress(soundPlayed.seek());
            }
        },1000);

        return () => clearInterval(updateProgress);
    },[soundPlayed, isPaused]);

    useLayoutEffect(() => {
        if(firstUpdate.current){
            firstUpdate.current=false;
            return;
        }
        if(!currentSong){
            return;
        }
        changeSong(currentSong.track);
    }, [currentSong && currentSong.track]);

    const addSongToPlaylist = async (playlistId) => {
        const songId = currentSong._id;

        const payload = {playlistId, songId};
        const response = await makeAuthenticatedPOSTRequest("/playlist/add/song", payload);
        
        if(response._id){
            setAddToPlaylistModalOpen(false);
        }
    }

    const playSound = () => {
        if(!soundPlayed){
            return;
        }
        soundPlayed.play();
    }
    const changeSong = (songSrc) => {
        if(soundPlayed){

            soundPlayed.stop(); 
        }
        let sound = new Howl({
            src: [songSrc],
            html5: true,
        });
        setSoundPlayed(sound);
        sound.play();
        setIsPaused(false);
    };
    const pauseSound = () => {
        soundPlayed.pause();
    }
    const togglePlayPause = () => {
        if(isPaused){
            playSound();
            setIsPaused(false);
        }
        else {
            pauseSound();
            setIsPaused(true);
        }
    }

    return (
        <div className="h-full w-full bg-app-black">
            {createPlaylistModalOpen && <CreatePlaylistModal
            closeModal={()=>{setCreatePlaylistModalOpen(false);}}/>}
            {addToPlaylistModalOpen && <AddToPlaylistModal closeModal={()=>{setAddToPlaylistModalOpen(false);}}
            addSongToPlaylist={addSongToPlaylist}/>}
            <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
                {/* Sidebar */}
                <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-12">
                    <div>
                    <div className="logoDiv p-6">
                            <Icon icon="logos:spotify" width="110"/>
                    </div>

                    <div className="py-5">
                        <IconText 
                        iconName={"ant-design:home-filled"}
                        displayText={"Home"}
                        targetLink={"/home"}
                        active={currActiveScreen === "home"}
                        />
                        <IconText 
                        iconName={"iconamoon:search-fill"}
                        displayText={"Search"}
                        targetLink={"/search"}
                        active={currActiveScreen === "search"}
                        />
                        <IconText 
                        iconName={"clarity:library-solid"}
                        displayText={"Library"}
                        targetLink={"/library"}
                        active={currActiveScreen === "library"}
                        />
                        <IconText 
                        iconName={"entypo:music"}
                        displayText={"My Music"}
                        targetLink={"/music"}
                        active={currActiveScreen === "music"}
                        />
                    </div>

                    <div className="pt-8">
                        <IconText 
                        iconName={"ph:plus-fill"}
                        displayText={"Create Playlist"}
                        onClick={()=>{setCreatePlaylistModalOpen(true)}}
                        />
                        <IconText 
                        iconName={"iconoir:heart-solid"}
                        displayText={"Liked Songs"}
                        />
                    </div>
                    </div>
                    <div className="px-6">
                        <div 
                        className="border border-gray-100 text-white rounded-full items-center
                        justify-center w-2/5 flex px-2 py-1 cursor-pointer hover:border-white">
                            <Icon icon="pajamas:earth"/>
                            <div className="ml-2 text-sm font-semibold">English</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="h-full w-4/5 bg-app-black overflow-auto">
                    <div className="navbar w-full h-1/10 bg-black bg-opacity-40 flex items-center justify-end">
                        <div className="w-1/2 flex h-full">
                            <div className="w-3/5 flex justify-around items-center">
                                <NavbarText displayText={"Premium"}/>
                                <NavbarText displayText={"Support"}/>
                                <NavbarText displayText={"Download"}/>
                                <div className="h-1/2 border-r border-white"></div>
                            </div>
                            <div className="w-2/5 flex justify-around h-full items-center">
                                <Link to="/uploadSong">
                                    <NavbarText displayText={"Upload Song"}/>
                                </Link>
                                <LogoutButton></LogoutButton>
                            </div>
                        </div>
                    </div>
                    <div className="content p-8 pt-0 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
            {/* Currently playing song */}
            {
                currentSong && 
                <div className="w-full h-1/10 bg-black bg-opacity-20 text-white flex items-center px-6">
                    <div className="w-1/4 flex items-center">
                        <img src={currentSong.thumbnail} 
                        className="h-14 w-14 rounded" alt="currentSong"/>
                        <div className="pl-4">
                            <div className="text-sm cursor-pointer hover:underline">
                                {currentSong.name}
                            </div>
                            <div className="text-xs text-gray-400 cursor-pointer hover:underline">
                                {currentSong.artist.firstName + " " + currentSong.artist.lastName}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex justify-center h-full flex-col items-center">
                        <div className="flex w-1/3 justify-between items-center">
                            <Icon icon="lucide:shuffle" fontSize={16} 
                            className="cursor-pointer text-gray-400 hover:text-white"/>

                            <Icon icon="fluent:previous-48-filled"  fontSize={16} 
                            className="cursor-pointer text-gray-400 hover:text-white"/>

                            <Icon icon={isPaused ? "ph:play-fill" : "ph:pause-fill"} fontSize={25} 
                            className="cursor-pointer text-gray-400 hover:text-white"
                            onClick={togglePlayPause}/>

                            <Icon icon="fluent:next-48-filled" fontSize={16} 
                            className="cursor-pointer text-gray-400 hover:text-white"/>

                            <Icon icon="pepicons-pop:repeat" fontSize={16} 
                            className="cursor-pointer text-gray-400 hover:text-white"/>
                        </div>
                        <div className='flex flex-row items-center'>
                            <div className='duration-elapsed text-gray-400'>{formatSongDuration(songProgress)}</div>
                            <div className='progress-bar-container relative cursor-pointer'>
                                {/* Progress Bar */}
                                <div className='progress-bar-front absolute'
                                    style={{ width: `${(songProgress / currentSong.duration) * 100}%` }}
                                ></div>
                                <div className='progress-bar-back'></div>
                            </div>
                            <div className='total-duration text-gray-400'>{formatSongDuration(currentSong.duration)}</div>
                        </div>
                    </div>
                    <div className="w-1/4 flex justify-end px-3">
                            <Icon icon="ic:round-playlist-add" fontSize={25} 
                            className="cursor-pointer text-gray-400 hover:text-white"
                            onClick={()=>{setAddToPlaylistModalOpen(true);}}/>
                    </div>
                </div>
            }
        </div>
    )
};


export default LoggedInContainer;