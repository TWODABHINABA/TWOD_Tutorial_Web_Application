const passport = require("passport");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Person = require("./Models/person");
const JWT_SECRET=process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
    },
    
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await Person.findOne({ googleId: profile.id }); //email: profile.emails[0].value 
        if (!user) {
          user = new Person({
            // _id:profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture:profile.photos[0].value
          });
          await user.save();
          console.log(user);
          console.log("Google Strategy Callback URL:", process.env.CALLBACK_URL);
          
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        // res.json({ token });
        console.log(token);
        done(null, user,token);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});



// const passport = require("passport");
// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const Person = require("./Models/person");

// const JWT_SECRET = process.env.JWT_SECRET;


// const CALLBACK_URL =
//   process.env.NODE_ENV === "production"
//     ? process.env.CALLBACK_URL
//     : "http://localhost:6001/auth/callback";

// console.log("✅ Google OAuth Callback URL:", CALLBACK_URL);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: CALLBACK_URL, 
//       passReqToCallback: true,
//     },
//     async (request, accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await Person.findOne({ googleId: profile.id });

       
//         if (!user) {
//           user = new Person({
//             googleId: profile.id, 
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             profilePicture: profile.photos[0].value,
//           });
//           await user.save();
//           console.log("✅ New User Saved:", user);
//         }

     
//         const token = jwt.sign({ id: user._id }, JWT_SECRET, {
//           expiresIn: "1h",
//         });

//         console.log("✅ JWT Token:", token);

  
//         done(null, user, { token });
//       } catch (err) {
//         console.error("❌ Error in Google Strategy:", err);
//         done(err, null);
//       }
//     }
//   )
// );


// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
