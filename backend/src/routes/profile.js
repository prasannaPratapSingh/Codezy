const express = require('express');
const profileRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware')
const { generateImageSignature, saveImageMetadata, findUrl, deleteProfileImage } = require('../controllers/profileSetup')

profileRouter.get("/create", userMiddleware, generateImageSignature);
profileRouter.post('/save', userMiddleware, saveImageMetadata);
profileRouter.get("/url", userMiddleware, findUrl);
profileRouter.delete("/delete", userMiddleware, deleteProfileImage)


module.exports = profileRouter;