const passport = require("passport");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Person = require("./Models/person");
const JWT_SECRET=process.env.JWT_SECRET;
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
        let user = await Person.findOne({ googleId: profile.id }); //email: profile.emails[0].value 
        if (!user) {
          user = new Person({
            // _id:profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture:profile.photos[0].value,
            birthday: defaultBirthday
          });
          await user.save();
          console.log(user);
          // console.log("Google Strategy Callback URL:", process.env.CALLBACK_URL);
          
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
