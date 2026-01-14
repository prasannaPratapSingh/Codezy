const redisClient = require("../config/redis");
const User = require("../models/user")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require('../models/submission');




/* ================= REGISTER ================= */
const register = async (req, res) => {
    try {
        validate(req.body);

        const { firstName, emailId, password } = req.body;

        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            emailId,
            password: hashedPassword,
            role: "user",
        });

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

        /* 🔥 LOCALHOST COOKIE SETTINGS */
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: false,        // ❗ localhost
            sameSite: "Lax",      // ❗ localhost
        });

        res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                emailId: user.emailId,
                role: user.role,
            },
            message: "User registered successfully",
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || "Registration failed",
        });
    }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

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

        /* 🔥 LOCALHOST COOKIE SETTINGS */
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        });

        res.status(200).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                emailId: user.emailId,
                role: user.role,
            },
            message: "Logged In Successfully",
        });
    } catch (err) {
        res.status(401).json({ error: "Invalid credentials" });
    }
};

/* ================= LOGOUT ================= */
const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.send("Logged Out");

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        });

        res.send("Logged Out Successfully");
    } catch (err) {
        res.status(503).send("Logout failed");
    }
};

/* ================= ADMIN REGISTER ================= */
const adminRegister = async (req, res) => {
    try {
        validate(req.body);

        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create(req.body);

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
            secure: false,
            sameSite: "Lax",
        });

        res.status(201).send("Admin Registered Successfully");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};

/* ================= DELETE PROFILE ================= */
const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        await Submission.deleteMany({ userId });

        res.status(200).send("Profile Deleted Successfully");
    } catch (err) {
        res.status(400).send("Profile doesn't exist");
    }
};

/* ================= FETCH PROFILE ================= */
const fetchProfile = async (req, res) => {
    try {
        res.status(200).json(req.result);
    } catch (err) {
        res.status(404).send("Profile not found");
    }
};

module.exports = {
    register,
    login,
    logout,
    adminRegister,
    deleteProfile,
    fetchProfile,
};
