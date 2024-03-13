// How to create a model: 
// Step 1: Require mongoose.
// Step 2: Create a mongoose schema (Structure of a user).
// Step 3: Create a model.

const mongoose = require("mongoose");


// Structure of a user.
const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
        private: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    likedSongs: {
        type: String,
        default: "",
    },
    likedPlaylists: {
        type: String,
        default: "",
    },
    subscribedArtists: {
        type: String,
        default: "",
    },
});

const UserModel = mongoose.model("User",User);

module.exports = UserModel;

