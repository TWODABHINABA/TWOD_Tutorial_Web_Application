// const passport = require("passport");
// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const Person = require("./Models/person");
// const JWT_SECRET=process.env.JWT_SECRET;
// const defaultBirthday = new Date("2000-01-01");
// console.log("✅ CALLBACK_URL being used by GoogleStrategy:", process.env.CALLBACK_URL);
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.CALLBACK_URL,
//       passReqToCallback: true,
//     },
    
//     async (request, accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;


//         const existingEmailUser = await Person.findOne({ email });

//         if (existingEmailUser && !existingEmailUser.googleId) {
//           return done(null, false, {
//             message: "Email already exists with a different login method.",
//           });
//         }
//         let user = await Person.findOne({ googleId: profile.id }); //email: profile.emails[0].value 
//         if (!user) {
//           user = new Person({
//             // _id:profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             profilePicture:profile.photos[0].value,
//             birthday: defaultBirthday
//           });
//           await user.save();
//           console.log(user);
          
//         }
//         const token = jwt.sign({ id: user._id }, JWT_SECRET, {
//           expiresIn: "1h",
//         });
//         // res.json({ token });
//         console.log(token);
//         done(null, user,token);
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });


const passport = require("passport");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Person = require("./Models/person");

const JWT_SECRET = process.env.JWT_SECRET;
const defaultBirthday = new Date("2000-01-01");

console.log("✅ CALLBACK_URL being used by GoogleStrategy:", process.env.CALLBACK_URL);

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
        const email = profile.emails[0].value;

        // Check if a user with the same email exists with non-Google login
        let existingEmailUser = await Person.findOne({ email });
        if(!existingEmailUser){
          existingEmailUser = await Person.findOne({ email });
        }

        if (existingEmailUser && !existingEmailUser.googleId) {
          return done(null, false, {
            message: "Email already exists.",
          });
        }

        // Look for existing user by googleId
        let user = await Person.findOne({ googleId: profile.id });

        if (!user) {
          // If not found by googleId but found by email (and Google login allowed), update that user
          if (existingEmailUser) {
            existingEmailUser.googleId = profile.id;
            existingEmailUser.profilePicture = profile.photos[0].value;
            await existingEmailUser.save();
            user = existingEmailUser;
          } else {
            // Otherwise create new user
            user = new Person({
              name: profile.displayName,
              email,
              googleId: profile.id,
              profilePicture: profile.photos[0].value,
              birthday: defaultBirthday,
            });
            await user.save();
          }
        }

        console.log("✅ Google login user:", user.email);
        done(null, user);

      } catch (err) {
        console.error("❌ Error during Google login:", err);
        done(err, null);
      }
    }
  )
);

// Store user in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Retrieve user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});
