const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.serializeUser((user,done)=>{ //kullanıcı verilerini oturumda kalıcı kılar.
  done(null,user.id) 
})

passport.deserializeUser((id,done)=>{ //oturumdan kullanıcı verilerini almak için kullanılır.
  User.findById(id).then(user => {
    done(null,user)
  })
})


passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        //aynı userı iki kere kaydetmeyi önledi
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user)); // user kaydetme
        }
      });
    }
  )
);
