import LoggedInContainer from '../containers/LoggedInContainer';

const cardsOne = [
    {
        title: "The Color Violet",
        desc: "Tory Lanez",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2730c5f23cbf0b1ab7e37d0dc67",
    },
    {
        title: "I Wanna Be Yours",
        desc: "Arctic Monkeys",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163",
    },
    {
        title: "Heartless",
        desc: "Kanye West",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b273346d77e155d854735410ed18",
    },
    {
        title: "3005",
        desc: "Childish Gambino",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b27326d64b6150aa3d9b6b67d857",
    },
    {
        title: "Softcore",
        desc: "The Neighbourhood",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2739b6ac98a52f62d5cb473da40",
    },
];

const cardsTwo = [
    {
        title: "Somebody Else",
        desc: "The 1975",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b273d3de03550f715df1ea7e0c08"
    },
    {
        title: "Breathe Deeper",
        desc: "Tame Impala",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b27358267bd34420a00d5cf83a49"
    },
    {
        title: "Circles",
        desc: "Post Malone",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2739478c87599550dd73bfa7e02"
    },
    {
        title: "Lonely Nights",
        desc: "Leisure",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2738ab4ba972db56663cc45a4ed"
    },
    {
        title: "The Night We Met",
        desc: "Lord Huron",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2739d2efe43d5b7ebc7cb60ca81"
    },
];

const cardsThree = [
    {
        title: "The Less I Know The Better",
        desc: "Tame Impala",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79"
    },
    {
        title: "Beautiful Catastrophe",
        desc: "WEARETHEGOOD",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b273d18cee2af60589cfd525988b"
    },
    {
        title: "Devil In A New Dress ft. Rick Ross",
        desc: "Kanye West",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f"
    },
    {
        title: "I Took A Pill In Ibiza (Seeb Remix)",
        desc: "Mike Posner",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b273a19be7aca4a1fcd6e8a42c62"
    },
    {
        title: "Lady (Hear Me Tonight)",
        desc: "Modjo",
        imgUrl: "https://i.scdn.co/image/ab67616d0000b27354c5c304064df85d61253ac7"
    },
];

const LoggedInHomeComponent = () => {
    return (
        <LoggedInContainer currActiveScreen="home">
            <PlaylistView titleText="Recently Played" cardsData={cardsOne}/>
            <PlaylistView titleText="You might also like" cardsData={cardsTwo}/>
            <PlaylistView titleText="Based on your interests" cardsData={cardsThree}/>
        </LoggedInContainer>
    )
};

const PlaylistView = ({titleText,cardsData}) => {
    return <div className="text-white mt-8">
        <div className="text-xl font-semibold mb-5 ml-2"> {titleText} </div>
        <div className="w-full flex justify-between space-x-4">
            {
                cardsData?.map((item) => {
                    return <Card title={item.title} desc={item.desc} imgUrl={item.imgUrl}/>
                })
            }
        </div>
    </div>
};

const Card = ({title,desc,imgUrl,songUrl}) => {
    return (
        <div className="bg-black bg-opacity-30 w-1/5 p-4 rounded-lg">
            <div className="py-3">
                <img className="w-full rounded-md" alt="album-cover"
                src={imgUrl}></img>
            </div>
            <div className="text-white font-semibold py-2">{title}</div>
            <div className="text-gray-500 text-sm">{desc}</div>
        </div>
    )
}
export default LoggedInHomeComponent;