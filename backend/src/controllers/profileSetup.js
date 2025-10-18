const cloudinary = require('cloudinary');
const User = require("../models/user");
const ProfilePicture = require('../models/profilePicture');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateImageSignature = async (req, res) => {
    try {
        const userId = req.result._id;
        const profile = await User.findById(userId);
        if (!profile) {
            return res.status(404).json({
                error: "User not found..."
            })
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const public_id = `leetcode-profile/${userId}_${timestamp}`;

        const uploadParams = {
            timestamp: timestamp,
            public_id: public_id
        }

        //generate the signature now...
        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_API_SECRET
        )

        res.json({
            signature,
            timestamp,
            public_id: public_id,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        })
    }
    catch (err) {
        console.log("Cannot generate signature...");
        res.status(500).json({
            error: "Failed to generate the credentials for the image signature..."
        })
    }
}

const saveImageMetadata = async (req, res) => {
    try {
        const userId = req.result._id;
        const {
            cloudinaryPublicId,
            secureUrl
        } = req.body;

        const cloudinaryResource = await cloudinary.api.resource(
            cloudinaryPublicId,
            { resource_type: 'image' }
        )

        if (!cloudinaryResource) {
            return res.status(400).json({
                error: "Image not found on the Cloudinary"
            })
        }

        //check krte hai ki already image se related metadata stores to nahi haina db me
        //dobara se same data store karne se bachna hoga

        const existingImage = await ProfilePicture.findOne({
            userId,
            cloudinaryPublicId
        })

        if (existingImage) {
            return res.status(400).json({
                error: "Image already exists"
            });
        }

        const finalImage = await ProfilePicture.create({
            userId,
            cloudinaryPublicId,
            secureUrl
        })

        res.status(201).json({
            message: "Profile Photo successfully Uploaded",  // ✅ Fixed "succesfully"
            ProfileDetails: {  // ✅ Fixed "ProfileDeatails"
                id: finalImage._id,
                secureUrl: finalImage.secureUrl,  // ✅ Useful for frontend
                uploadedAt: finalImage.createdAt
            }
        })

    }
    catch (err) {
        res.status(500).json({
            error: "Failed to save the metadata of the image..."
        })
    }
}

const findUrl = async (req, res) => {
    try {
        const uid = req.result._id;
        const purl = await ProfilePicture.findOne({ userId: uid })
            .select('secureUrl')
            .sort({ createdAt: -1 }); // Gets the latest document

        if (!purl) {
            return res.status(404).json({
                error: "URL nahi mila"
            });
        }

        res.status(200).json({
            secureUrl: purl.secureUrl
        });

    } catch (err) {
        console.error('Error finding URL:', err);
        res.status(500).json({
            error: "URL not found currently..."
        });
    }
}

const deleteProfileImage = async (req, res) => {
    try {
        const usid = req.result._id;

        // First, find the profile picture to get cloudinaryPublicId
        const profilePictures = await ProfilePicture.find({ userId: usid });

        if (profilePictures.length === 0) {
            return res.status(404).json({
                error: "No Profile photo found..."
            });
        }

        // Delete from Cloudinary first (for each image if multiple)
        for (const picture of profilePictures) {
            await cloudinary.uploader.destroy(picture.cloudinaryPublicId, {
                resource_type: 'image',
                invalidate: true
            });
        }

        // Then delete from database
        await ProfilePicture.deleteMany({ userId: usid });

        res.status(200).json({
            message: "Profile successfully removed..."
        });

    } catch (err) {
        console.log(err); // Log the actual error for debugging
        res.status(400).json({
            error: "Profile picture cannot be removed. Try after sometime..."
        });
    }
}



module.exports = { generateImageSignature, saveImageMetadata, findUrl, deleteProfileImage };
