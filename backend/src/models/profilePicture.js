const mongoose = require('mongoose');

const profilePictureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true
  },
  
  secureUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const ProfilePicture = mongoose.model('ProfilePicture', profilePictureSchema);
module.exports = ProfilePicture;