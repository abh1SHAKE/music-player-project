import '../styles/my-music.css';
import SingleSongCard from '../components/shared/SingleSongCard';
import { makeAuthenticatedGETRequest } from '../utils/serverHelpers';
import { useState, useEffect } from 'react';
import LoggedInContainer from '../containers/LoggedInContainer';

const MyMusic = () => {
    const shimmerCount = 5;
    const [songData, setSongData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
            setSongData(response.data);
            setIsLoading(false);
        };
        getData();
    }, []);

    return (
        <LoggedInContainer currActiveScreen="music">
        <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
            Songs
        </div>
    {isLoading ? (
        <>
            {Array.from({ length: shimmerCount }).map((_, index) => (
                <div className='flex song-card-container'>
                    <div className='flex song-card-container-left'>
                        <div className='song-image-container shimmer'></div>
                        <div className='song-details-container'>
                            <div className='song-details-name shimmer'></div>
                            <div className='song-details-artist shimmer'></div>
                        </div>
                    </div>
                    <div className='song-card-container-right'>
                        <div className='song-duration-container shimmer'></div>
                    </div>
                </div>
            ))}
        </>
    ) : (
        <>
            <div className="space-y-3 overflow-auto">
                {songData.map((item) => (
                    <SingleSongCard key={item.id} info={item} playSound={() => {}} />
                ))}
            </div>
        </>
    )}
</LoggedInContainer>

    )
}

export default MyMusic;