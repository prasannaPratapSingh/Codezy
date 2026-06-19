const jwt = require('jsonwebtoken');

const isDev = process.env.NODE_ENV !== 'production';

const featureFunction = async (req, res) => {
    try {
        const { _id } = req.result;
        if (isDev) {
            console.log("=== DEBUG START ===");
            console.log("Received JWT payload:", req.user);
            console.log("specialFeature from token:", req.user.specialFeature);
            console.log("Current usage from middleware:", req.currentUsage);
        }
        const count = req.currentUsage;
        const userData = req.result;
        const token = jwt.sign(
            {
                _id: userData._id,
                emailId: userData.emailId,
                role: userData.role,
                specialFeature: {
                    specialUsage: count + 1
                }
            },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

        const userResponse = {
            _id: userData._id,
            firstName: userData.firstName,
            emailId: userData.emailId,
            role: userData.role,
        };

        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true, // Security: prevent XSS
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict' // CSRF protection
        });

        res.status(201).json({
            success: true,
            user: userResponse,
            usageCount: count + 1, // Added: current usage count
            remainingUses: 2 - (count + 1), // Added: remaining uses
            message: "Sab Changa Si"
        });

    }
    catch (err) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = featureFunction;