// How to create a model: 
// Step 1: Require mongoose.
// Step 2: Create a mongoose schema (Structure of a Playlist).
// Step 3: Create a model.

const mongoose = require("mongoose");


// Structure of a playlist.
const Playlist = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    songs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Song",
        },
    ],
    collaborators: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
});

const PlaylistModel = mongoose.model("Playlist",Playlist);

module.exports = PlaylistModel;

