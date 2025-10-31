const redisClient = require("../config/redis");
const User = require("../models/user")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require('../models/submission');


const register = async (req, res) => {
    try {
        // Validate the data
        validate(req.body);

        const { firstName, emailId, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user data object (don't mutate req.body)
        const userData = {
            firstName,
            emailId,
            password: hashedPassword,
            role: 'user'
        };

        // Create user in database
        const user = await User.create(userData);

        // Generate JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                emailId: user.emailId,
                role: user.role,
                specialFeature:{
                    specialUsage:0
                }
            },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        // Prepare response data
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            emailId: user.emailId,
            role: user.role,
        };
        
        // Set cookie with proper options for cross-origin
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        // Send success response
        res.status(201).json({
            success: true,
            user: userResponse,
            message: "User registered successfully"
        });

    } catch (err) {
        console.error("Registration error:", err);

        // Handle different types of errors
        if (err.name === 'ValidationError') {
            // MongoDB validation error
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: Object.values(err.errors).map(e => e.message)
            });
        }

        if (err.code === 11000) {
            // MongoDB duplicate key error
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // General error
        res.status(400).json({
            success: false,
            message: err.message || "Registration failed"
        });
    }
};

const login = async (req, res) => {

    try {
        const { emailId, password } = req.body;

        if (!emailId)
            throw new Error("Invalid Credentials");
        if (!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({ emailId });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            throw new Error("Invalid");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };

        const token = jwt.sign({
            _id: user._id,
            emailId: emailId,
            role: user.role,
            specialFeature:{
                specialUsage:0
            }
        },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 });

        // Set cookie with proper options for cross-origin
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(201).json({
            user: reply,
            message: "Logged In Successfully"
        })
    }
    catch (err) {
        res.status(401).json({
            error: "Invalid credentials"
        });
    }
}


const logout = async (req, res) => {

    try {
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);
        
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.send("Logged Out Successfully");
    }
    catch (err) {
        res.status(503).send("Error: " + err);
    }
}


const adminRegister = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);

        const user = await User.create(req.body);
        const token = jwt.sign({
            _id: user._id,
            emailId: emailId,
            role: user.role,
            specialFeature: {
                specialUsage: 0
            }
        }, process.env.JWT_KEY, { expiresIn: 60 * 60 });

        // Set cookie with proper options for cross-origin
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(201).send("User Registered Successfully");
    }
    catch (err) {
        res.status(400).send("Error: " + err);
    }
}


const deleteProfile = async (req, res) => {
    try {

        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        await Submission.deleteMany({ userId });
        res.status(500).send("Profile Deleted Successfully");
    }
    catch (err) {
        res.status(400).send("Profile doesn't exists...");
    }
}


const fetchProfile = async (req, res) => {
    try {
        const fetchedData = req.result;
        res.status(200).send(fetchedData);
    }
    catch (err) {
        res.status(404).send(err);
    }
}

module.exports = { register, login, logout, adminRegister, deleteProfile, fetchProfile };
