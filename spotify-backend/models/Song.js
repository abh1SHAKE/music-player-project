// How to create a model: 
// Step 1: Require mongoose.
// Step 2: Create a mongoose schema (Structure of a song).
// Step 3: Create a model.

const mongoose = require("mongoose");


// Structure of a song.
const Song = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    track: {
        type: String,
        required: true,
    },
    artist: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    duration: {
        type: Number,
        required: true,
    }
});

const SongModel = mongoose.model("Song",Song);

module.exports = SongModel;

