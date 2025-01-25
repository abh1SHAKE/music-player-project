import "./output.css";
import "./shimmer.css";
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import LoggedInHomeComponent from "./routes/LoggedInHome";
import UploadSong from "./routes/UploadSong";
import MyMusic from "./routes/MyMusic";
import SearchPage from "./routes/SearchPage";
import { useCookies } from "react-cookie";
import songContext from "./contexts/songContext";
import { useState } from "react";
import Library from "./routes/Library";
import SinglePlaylistView from "./routes/SinglePlaylistView";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [cookie, setCookie] = useCookies(["token"]);
  const [soundPlayed, setSoundPlayed] = useState(null); 
  // The song will be paused by default (isPaused = true). 
  const [isPaused, setIsPaused] = useState(true);
  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
      {
        cookie.token?
        // LoggedIn Routes
        <songContext.Provider value={{
          currentSong, 
          setCurrentSong,
          soundPlayed,
          setSoundPlayed,
          isPaused,
          setIsPaused
          }}>
        <Routes>
            <Route path="/home" element={<LoggedInHomeComponent/>}/>
            <Route path="/uploadSong" element={<UploadSong/>}/>
            <Route path="/music" element={<MyMusic/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/library" element={<Library/>}/>
            <Route path="/playlist/:playlistId" element={<SinglePlaylistView/>}/>
            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes> 
        </songContext.Provider>:
        // LoggedOut Routes
        <Routes>
          <Route path="/" element={<HomeComponent/>}/>
          <Route path="/login" element={<LoginComponent/>}/>
          <Route path="/home" element={<HomeComponent/>}/>
          <Route path="/signup" element={<SignupComponent/>}/>
          <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
      }
      </BrowserRouter>
    </div>
  );
}

export default App;
