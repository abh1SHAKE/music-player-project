const express = require("express");
const router = express.Router();
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");

// Create a playlist 
router.post("/create", passport.authenticate("jwt", {session: false}), async (req,res) => {
    const currentUser = req.user;
    const {name, thumbnail, songs} = req.body;
    if(!name || !thumbnail || !songs){
        return res.status(301).json({err: "Insufficient Data"});
    }

    const playlistData = {name, thumbnail, songs, owner: currentUser._id, collaborators: []};

    const playlist = await Playlist.create(playlistData);
    return res.status(200).json(playlist);
});

// GET playlist by ID.
// We will get the playlist ID as the route parameter and we will return the playlist having that ID.
router.get("/get/playlist/:playlistId", passport.authenticate("jwt", {session: false}), async (req,res) => {
    // This concept is called req.params
    const playlistId = req.params.playlistId;

    // I need to find the playlist with the _id = playlistId.
    const playlist = await Playlist.findOne({_id: playlistId}).populate({
        path: "songs",
        populate: {
            path: "artist"
        }
    });
    if(!playlist){
        return res.status(301).json({err:"Invalid ID"});
    }
    return res.status(200).json(playlist);
});

// GET all the playlists made by me.
router.get("/get/me", passport.authenticate("jwt", {session: false}), async (req,res) => {
    const artistId = req.user._id;

    const playlists = await Playlist.find({owner: artistId}).populate("owner");
    return res.status(200).json({data: playlists}); 
});

// GET all the playlists made by an artist.
router.get("/get/artist/:artistId", passport.authenticate("jwt", {session: false}), async (req,res) => {
    const artistId = req.params.artistId;

    // Check if the Artist with the given Artist ID exists.
    const artist = await User.findOne({_id: artistId});
    if(!artist){
        return res.status(304).json({err: "Invalid Artist ID"});
    }

    const playlists = await Playlist.find({owner: artistId});
    return res.status(200).json({data: playlists}); 
});

// Add a song to a playlist.
router.post("/add/song", passport.authenticate("jwt", {session: false}), async (req,res) => {
    const currentUser = req.user;
    const {playlistId, songId} = req.body;

    // Check if the playlist exists or not
    const playlist = await Playlist.findOne({_id: playlistId});
    if(!playlist){
        return res.status(304).json({err: "Playlist does not exist"});
    }

    // Check if the currentUser owns the playlist or is a collaborator.
    if(!playlist.owner.equals(currentUser._id) &&
    !playlist.collaborators.includes(currentUser._id)){
        return res.status(400).json({err: "Not allowed"});
    }

    // Check if the song to be added is a valid song.
    const song = await Song.findOne({_id: songId});
    if(!song){
        return res.status(304).json({err: "Song does not exist"});
    }

    // After all checks are done, we can simply add the songs into the playlist.
    playlist.songs.push(songId);
    await playlist.save();
    return res.status(200).json(playlist);
});

module.exports = router;