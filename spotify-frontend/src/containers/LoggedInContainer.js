import '../styles/logged-in-container.css';
import { Icon } from '@iconify/react';
import IconText from '../components/shared/IconText';
import NavbarText from '../components/shared/NavbarText';
import {Howl, Howler} from "howler";
import { useContext, useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import songContext from '../contexts/songContext';
import LogoutButton from '../routes/Logout';

import CreatePlaylistModal from '../modals/CreatePlaylistModal';
import AddToPlaylistModal from '../modals/AddToPlaylistModal';
import { makeAuthenticatedPOSTRequest } from '../utils/serverHelpers';

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const LoggedInContainer = ({children, currActiveScreen, currUser}) => {
    const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
    const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [songProgress, setSongProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const volumeBeforeMute = useRef(1);

    const {currentSong,
            setCurrentSong,
            soundPlayed,
            setSoundPlayed,
            isPaused,
            setIsPaused,
            queue,
            shuffleMode,
            setShuffleMode,
            loopMode,
            setLoopMode,
        } = useContext(songContext);

    const firstUpdate = useRef(true);
    const [playOrderIndices, setPlayOrderIndices] = useState([]);

    useEffect(() => {
        if (!queue || queue.length === 0) {
            setPlayOrderIndices([]);
            return;
        }
        if (shuffleMode) {
            setPlayOrderIndices(shuffleArray(queue.map((_, i) => i)));
        } else {
            setPlayOrderIndices(queue.map((_, i) => i));
        }
    }, [queue, shuffleMode]);

    const currentQueueIndex = queue?.findIndex((s) => s._id === currentSong?._id) ?? -1;
    const positionInPlayOrder = playOrderIndices.indexOf(currentQueueIndex);

    const queueStateRef = useRef({ queue, playOrderIndices, currentQueueIndex, positionInPlayOrder, loopMode, currentSong });
    queueStateRef.current = { queue, playOrderIndices, currentQueueIndex, positionInPlayOrder, loopMode, currentSong };
    const changeSongRef = useRef(null);

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

    useEffect(() => {
        if (!soundPlayed) return;
        soundPlayed.volume(muted ? 0 : volume);
    }, [soundPlayed, volume, muted]);

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (!currentSong) return;
        setSongProgress(0);
        changeSong(currentSong.track);
    }, [currentSong && currentSong.track]);

    useEffect(() => {
        changeSongRef.current = changeSong;
    });

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
    const playNextSong = useCallback(() => {
        const { queue: q, playOrderIndices: order, currentQueueIndex: curIdx, positionInPlayOrder: pos, loopMode: loop, currentSong: curSong } = queueStateRef.current;
        if (!q?.length || curIdx < 0) return;
        if (loop === "one") {
            if (soundPlayed) {
                soundPlayed.seek(0);
                soundPlayed.play();
                setSongProgress(0);
                setIsPaused(false);
            }
            return;
        }
        const nextPos = pos + 1;
        if (nextPos < order.length) {
            setCurrentSong(q[order[nextPos]]);
        } else if (loop === "all" && order.length > 0) {
            const nextSong = q[order[0]];
            if (curSong && nextSong._id === curSong._id) {
                setSongProgress(0);
                changeSongRef.current?.(nextSong.track);
            } else {
                setCurrentSong(nextSong);
            }
        } else {
            if (soundPlayed) soundPlayed.stop();
            setIsPaused(true);
        }
    }, [soundPlayed, setCurrentSong]);

    const changeSong = (songSrc) => {
        if (soundPlayed) soundPlayed.stop();
        const sound = new Howl({
            src: [songSrc],
            html5: true,
        });
        sound.volume(muted ? 0 : volume);
        sound.on("end", () => playNextSong());
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

    const goToPrevious = useCallback(() => {
        if (!queue?.length) return;
        if (songProgress > 3 && soundPlayed) {
            soundPlayed.seek(0);
            setSongProgress(0);
            return;
        }
        const prevPos = positionInPlayOrder - 1;
        if (prevPos >= 0) {
            setCurrentSong(queue[playOrderIndices[prevPos]]);
        }
    }, [queue, songProgress, positionInPlayOrder, playOrderIndices, soundPlayed, setCurrentSong]);

    const goToNext = useCallback(() => {
        if (!queue?.length) return;
        if (loopMode === "one" && soundPlayed) {
            soundPlayed.seek(0);
            soundPlayed.play();
            setSongProgress(0);
            setIsPaused(false);
            return;
        }
        const nextPos = positionInPlayOrder + 1;
        if (nextPos < playOrderIndices.length) {
            setCurrentSong(queue[playOrderIndices[nextPos]]);
        } else if (loopMode === "all") {
            setCurrentSong(queue[playOrderIndices[0]]);
        } else {
            if (soundPlayed) soundPlayed.stop();
            setIsPaused(true);
        }
    }, [queue, loopMode, positionInPlayOrder, playOrderIndices, soundPlayed, setCurrentSong]);

    const toggleShuffle = useCallback(() => setShuffleMode((s) => !s), [setShuffleMode]);
    const cycleLoopMode = useCallback(() => {
        setLoopMode((m) => (m === "none" ? "all" : m === "all" ? "one" : "none"));
    }, [setLoopMode]);

    const handleSeek = (e) => {
        if (!soundPlayed || !currentSong?.duration) return;
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = fraction * currentSong.duration;
        soundPlayed.seek(newTime);
        setSongProgress(newTime);
    };

    const toggleMute = () => {
        if (muted) {
            setVolume(volumeBeforeMute.current);
            setMuted(false);
        } else {
            volumeBeforeMute.current = volume;
            setMuted(true);
        }
    };

    const handleVolumeChange = (e) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (v > 0) setMuted(false);
    };

    const handleSeekKeyDown = (e) => {
        if (!soundPlayed || !currentSong?.duration) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            return;
        }
        const step = 5;
        let newTime = songProgress;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            newTime = Math.max(0, songProgress - step);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            newTime = Math.min(currentSong.duration, songProgress + step);
        } else {
            return;
        }
        soundPlayed.seek(newTime);
        setSongProgress(newTime);
    };

    return (
        <div className="h-screen w-full bg-app-black flex flex-col overflow-hidden">
            {createPlaylistModalOpen && <CreatePlaylistModal
            closeModal={()=>{setCreatePlaylistModalOpen(false);}}/>}
            {addToPlaylistModalOpen && <AddToPlaylistModal closeModal={()=>{setAddToPlaylistModalOpen(false);}}
            addSongToPlaylist={addSongToPlaylist}/>}
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            <div className="flex-1 min-h-0 w-full lg:h-full flex flex-col lg:flex-row">
                {/* Sidebar - drawer on mobile, fixed width on lg+ */}
                <div className={`fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto h-full w-64 lg:w-1/5 lg:min-w-[180px] xl:min-w-[220px] bg-black flex flex-col justify-between pb-12 shrink-0 transform transition-transform duration-200 ease-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}>
                    <div>
                    <div className="logoDiv p-4 xl:p-6 flex items-center justify-between">
                        <Icon icon="logos:spotify" width="110" className="max-w-[90px] xl:max-w-[110px]"/>
                        <button type="button" className="lg:hidden p-2 text-white hover:bg-white/10 rounded" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
                            <Icon icon="mdi:close" fontSize={24}/>
                        </button>
                    </div>

                    <div className="py-3 xl:py-5">
                        <div onClick={() => setSidebarOpen(false)}>
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
                    </div>

                    <div className="pt-6 xl:pt-8">
                        <IconText 
                        iconName={"ph:plus-fill"}
                        displayText={"Create Playlist"}
                        onClick={()=>{setCreatePlaylistModalOpen(true); setSidebarOpen(false);}}
                        />
                        <IconText 
                        iconName={"iconoir:heart-solid"}
                        displayText={"Liked Songs"}
                        />
                    </div>
                    </div>
                    <div className="px-4 xl:px-6">
                        <div 
                        className="border border-gray-100 text-white rounded-full items-center
                        justify-center w-2/5 flex px-2 py-1 cursor-pointer hover:border-white">
                            <Icon icon="pajamas:earth"/>
                            <div className="ml-2 text-sm font-semibold">English</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 w-full lg:w-4/5 bg-app-black overflow-hidden flex flex-col">
                    <div className="navbar w-full min-h-[56px] lg:h-1/10 bg-black bg-opacity-40 flex items-center justify-between lg:justify-end shrink-0 px-3 sm:px-4 md:px-6">
                        <button type="button" className="lg:hidden p-2 text-white hover:bg-white/10 rounded shrink-0" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                            <Icon icon="mdi:menu" fontSize={24}/>
                        </button>
                        <div className="flex-1 lg:flex-initial lg:w-1/2 flex h-full flex-nowrap items-center justify-end gap-3 sm:gap-6 py-2 min-w-0">
                            <div className="hidden sm:flex flex-nowrap items-center gap-3 sm:gap-6 shrink-0">
                                <NavbarText displayText={"Premium"}/>
                                <NavbarText displayText={"Support"}/>
                                <NavbarText displayText={"Download"}/>
                                <div className="hidden md:block h-6 border-r border-white shrink-0"></div>
                            </div>
                            <div className="flex flex-nowrap items-center gap-3 sm:gap-6 shrink-0">
                                <Link to="/uploadSong" className="hidden sm:block">
                                    <NavbarText displayText={"Upload Song"}/>
                                </Link>
                                <LogoutButton></LogoutButton>
                            </div>
                        </div>
                    </div>
                    <div className="content p-4 sm:p-6 md:p-8 pt-2 sm:pt-4 md:pt-0 overflow-y-auto flex-1 min-h-0">
                        {children}
                    </div>
                </div>
            </div>
            {/* Currently playing song */}
            {
                currentSong && 
                <div className="w-full min-h-[72px] sm:min-h-[80px] lg:h-1/10 bg-black bg-opacity-20 text-white flex flex-col sm:flex-row items-center px-3 sm:px-4 md:px-6 py-2 gap-2 sm:gap-0 shrink-0">
                    <div className="w-full sm:w-1/4 flex items-center min-w-0">
                        <img src={currentSong.thumbnail} 
                        className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded shrink-0" alt="currentSong"/>
                        <div className="pl-2 sm:pl-4 min-w-0">
                            <div className="text-xs sm:text-sm cursor-pointer hover:underline truncate">
                                {currentSong.name}
                            </div>
                            <div className="text-xs text-gray-400 cursor-pointer hover:underline truncate">
                                {currentSong.artist.firstName + " " + currentSong.artist.lastName}
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 flex justify-center flex-col items-center gap-1 min-w-0 select-none">
                        <div className="flex w-full max-w-[200px] sm:max-w-none sm:w-1/3 justify-between items-center">
                            <Icon icon="lucide:shuffle" fontSize={14}
                                className={`cursor-pointer shrink-0 ${shuffleMode ? "text-app-green hover:text-app-green" : "text-gray-400 hover:text-white"}`}
                                onClick={toggleShuffle}
                                aria-label={shuffleMode ? "Disable shuffle" : "Enable shuffle"}
                            />
                            <Icon icon="fluent:previous-48-filled" fontSize={14}
                                className="cursor-pointer text-gray-400 hover:text-white shrink-0"
                                onClick={goToPrevious}
                                aria-label="Previous"
                            />
                            <Icon icon={isPaused ? "ph:play-fill" : "ph:pause-fill"} fontSize={22}
                                className="cursor-pointer text-gray-400 hover:text-white shrink-0"
                                onClick={togglePlayPause}
                                aria-label={isPaused ? "Play" : "Pause"}
                            />
                            <Icon icon="fluent:next-48-filled" fontSize={14}
                                className="cursor-pointer text-gray-400 hover:text-white shrink-0"
                                onClick={goToNext}
                                aria-label="Next"
                            />
                            <Icon icon={loopMode === "one" ? "ph:repeat-once-fill" : "pepicons-pop:repeat"} fontSize={14}
                                className={`cursor-pointer shrink-0 ${loopMode !== "none" ? "text-app-green hover:text-app-green" : "text-gray-400 hover:text-white"}`}
                                onClick={cycleLoopMode}
                                aria-label={loopMode === "none" ? "Enable loop" : loopMode === "one" ? "Loop one" : "Loop all"}
                            />
                        </div>
                        <div className='flex flex-row items-center justify-center w-full max-w-[200px] sm:max-w-[260px]'>
                            <div className='duration-elapsed text-gray-400 shrink-0'>{(formatSongDuration(songProgress))}</div>
                            <div
                                className='progress-bar-container relative cursor-pointer flex-1 min-w-0'
                                onClick={handleSeek}
                                onKeyDown={handleSeekKeyDown}
                                role="slider"
                                tabIndex={0}
                                aria-label="Seek"
                                aria-valuemin={0}
                                aria-valuemax={currentSong.duration}
                                aria-valuenow={songProgress}
                            >
                                <div className='progress-bar-front absolute'
                                    style={{ width: `${Math.min(100, currentSong.duration ? (songProgress / currentSong.duration) * 100 : 0)}%` }}
                                ></div>
                                <div className='progress-bar-back'></div>
                            </div>
                            <div className='total-duration text-gray-400 shrink-0'>{formatSongDuration(currentSong.duration)}</div>
                        </div>
                    </div>
                    <div className="hidden sm:flex w-1/4 items-center justify-end gap-2 px-2 md:px-3 shrink-0">
                        <Icon icon="ic:round-playlist-add" fontSize={22} 
                            className="cursor-pointer text-gray-400 hover:text-white shrink-0"
                            onClick={()=>{setAddToPlaylistModalOpen(true);}}/>
                        <div className="flex items-center gap-2 min-w-0 max-w-[140px]">
                            <button
                                type="button"
                                onClick={toggleMute}
                                className="text-gray-400 hover:text-white p-1 shrink-0"
                                aria-label={muted ? "Unmute" : "Mute"}
                            >
                                {muted ? (
                                    <Icon icon="ph:speaker-slash-fill" fontSize={22}/>
                                ) : volume === 0 ? (
                                    <Icon icon="ph:speaker-none-fill" fontSize={22}/>
                                ) : volume < 0.5 ? (
                                    <Icon icon="ph:speaker-low-fill" fontSize={22}/>
                                ) : (
                                    <Icon icon="ph:speaker-high-fill" fontSize={22}/>
                                )}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={muted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="volume-slider h-1 cursor-pointer"
                                style={{ '--volume': `${(muted ? 0 : volume) * 100}%` }}
                                aria-label="Volume"
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
};


export default LoggedInContainer;