// npm init -> package.json : suggesting this is a node project.
// npm i express -> installing expressJs package : project knows we're using express.

const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 1734;

app.use(cors());
app.use(express.json());

mongoose.connect(
    "mongodb+srv://abh1SHAKE:" +
    process.env.MONGO_PASSWORD +
    "@cluster0.ocxctxl.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then((msg) => {
    console.log("Connected to Mongo");
}).catch((err) => {
    console.log("Error while connecting to Mongo");
});

// Setup passport-jwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretKey';
// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     User.findOne({_id: jwt_payload.identifier}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// }));

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try{
        const user = await User.findOne({_id: jwt_payload.identifier});

        if(user){
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }catch(error){
        return done(error, false);
    }
}));

// API: GET type: / : return text "Hello World".
app.get("/", (req,res) => {
    // req: contains all data for the request.
    // res: contains all data for the response.
    res.send("But here comes Sebastian Vettel again");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

// Now we tell express that our server will run on localhost:1734.
app.listen(port, () => {
    console.log("App is running on port: "+port);
});
