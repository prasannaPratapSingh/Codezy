const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const ProfilePicture = require('../models/profilePicture');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/user/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const emailId = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!emailId) {
        return done(new Error("No email found in Google profile"), null);
      }

      let user = await User.findOne({ emailId });

      const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

      if (!user) {
        const familyName = profile.name && profile.name.familyName;
        const userFields = {
          firstName: profile.name && profile.name.givenName ? profile.name.givenName : "User",
          emailId,
          googleId: profile.id,
          role: "user"
        };
        if (familyName && familyName.trim().length >= 3) {
          userFields.lastName = familyName.trim();
        }
        user = await User.create(userFields);
      } else {
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
      }

      // Save Google avatar into ProfilePicture model (only if no picture exists)
      if (avatar) {
        const existing = await ProfilePicture.findOne({ userId: user._id });
        if (!existing) {
          await ProfilePicture.create({
            userId: user._id,
            cloudinaryPublicId: `google_${profile.id}`,
            secureUrl: avatar
          });
        }
      }

      return done(null, user);
    } catch (err) {
      console.error("❌ Passport Google Strategy Error:", err.message);
      return done(err, null);
    }
  }
));

module.exports = passport;
