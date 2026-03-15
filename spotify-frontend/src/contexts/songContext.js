import {createContext} from "react";

const songContext = createContext({
    currentSong: null,
    setCurrentSong: () => {},
    soundPlayed: null,
    setSoundPlayed: () => {},
    isPaused: null,
    setIsPaused: () => {},
    queue: [],
    setQueue: () => {},
    shuffleMode: false,
    setShuffleMode: () => {},
    loopMode: "none", // "none" | "one" | "all"
    setLoopMode: () => {},
});

export default songContext;