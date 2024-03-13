const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {getToken} = require("../utils/helpers");

// This POST route will help to register a user.
router.post("/register", async (req,res) => {
    // This code is run when the /register api is called as a POST request.

    // My req body will be of the format {email, password, firstName, lastName, username}.
    const {email, password, firstName, lastName, username} = req.body;

    // Does a user with this username still exists? If yes, we throw an error.
    const user = await User.findOne({email: email});
    // Status code by default is 200: indicating that request has succeeded.
    if(user){
        return res.status(403).json({error:"A user with this email already exists"})
    }
    // Else this is a valid request.

    // We'll have to create a new user in the Database.
    // We do not store passwords in plain text (Security vulnerability).
    // We convert the plain text passwords to a hash.
    const hashedPassword = await bcrypt.hash(password,10);
    const newUserData = {email, password: hashedPassword, firstName, lastName, username};
    const newUser = await User.create(newUserData);

    // We want to create a unique token to return to the user.
    const token = await getToken(email, newUser);

    // Return the result to the user
    const userToReturn = {...newUser.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});


// This POST route will help to login existing user.
router.post("/login", async (req,res) => {
    // Get email and password sent by the user from req.body.
    const {email, password} = req.body;

    // Check if the user with given email exists. If not, the given credentials are wrong.
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(403).json({err: "Invalid Credentials"});
    }

    // If the user exists, check if the password is correct. If not, the credentials are wrong.
    // Password was stored in hashed form (cannot be directly compared to password entered by the user).
    // The hash of the password depends on 2 parameters.
    // If the parameters are kept same, a password will always result in the same hash.

    // bcrpyt.compare() allows us to compare the plain-text password to the hashed password securely.
    // bcrypt.compare() returns a boolean value: either true or false.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(403).json({err: "Password entered is wrong"});
    }

    // If the credentials are correct, return a token to the user.
    const token = await getToken(user.email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

module.exports = router;