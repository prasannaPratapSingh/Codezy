const express = require('express');
const authRouter = express.Router();

const isDev = process.env.NODE_ENV !== 'production';

const { register, login, logout, adminRegister, deleteProfile, fetchProfile } = require('../controllers/userAuthent')
const { fetchCommentsAll, postComment } = require('../controllers/commentController');
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');
const passport = require('../config/passport');

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);

// Google Auth Routes
authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/auth/google/callback',
    (req, res, next) => {
        passport.authenticate('google', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login`);
            }

            const jwt = require('jsonwebtoken');
            const token = jwt.sign(
                {
                    _id: user._id,
                    emailId: user.emailId,
                    role: user.role,
                    specialFeature: { specialUsage: 0 },
                },
                process.env.JWT_KEY,
                { expiresIn: 60 * 60 }
            );

            res.cookie("token", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                secure: !isDev,
                sameSite: isDev ? 'Lax' : 'None',
            });

            res.redirect(process.env.CLIENT_URL || "http://localhost:5173/");
        })(req, res, next);
    }
);

authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);
authRouter.get('/profile', userMiddleware, fetchProfile);
authRouter.get('/comment/:id', userMiddleware, fetchCommentsAll);
authRouter.post('/comment/:id', userMiddleware, postComment);
authRouter.get('/check', userMiddleware, (req, res) => {
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id,
        role: req.result.role
    }
    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
})
// authRouter.get('/getProfile',getProfile);


module.exports = authRouter;

// login
// logout
// GetProfile

