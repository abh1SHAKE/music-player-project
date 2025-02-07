const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song");
const User = require("../models/User");

router.post("/create", passport.authenticate("jwt", {session: false}), async (req,res) => {
    // req.user gets the user because of passport.authenticate.
    const {name, thumbnail, track, duration} = req.body;
    if(!name || !thumbnail || !track){
        return res.status(301).json({err: "Insufficient information to create song"});
    }

    const artist = req.user._id;
    const songDetails = {name, thumbnail, track, artist, duration};
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
});

// GET route to get all the songs I have published.
router.get("/get/mysongs", passport.authenticate("jwt", {session: false}), async (req,res) => {
    const currentUser = req.user;

    const songs = await Song.find().populate("artist");
    return res.status(200).json({data: songs});
});


// GET route to get all the songs any artist has published.
// We will send the artist id and want to see all the songs that artist has published.
router.get("/get/artist/:artistId", passport.authenticate("jwt", {session: false}), async (req,res) => {
    const {artistId} = req.params;

    // We can check if the user doesn't exist.
    const artist = await User.findOne({_id: artistId});
    if(!artist){
        return res.status(301).json({err: "Artist does not exist"});
    }
    const songs = await Song.find({artist: artistId});
    return res.status(200).json({data: songs});
});

// GET route to get the single song by its name
router.get("/get/songname/:songName", passport.authenticate("jwt", {session: false}), async (req,res) => {
    const {songName} = req.params;

    const songs = await Song.find({name: songName}).populate("artist");
    return res.status(200).json({data: songs});
});

module.exports = router;
