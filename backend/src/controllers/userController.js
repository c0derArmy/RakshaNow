const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload image buffer to Cloudinary using a Promise-based approach
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'rakshanow_profiles',
            public_id: `user_${req.user.id}_${Date.now()}`,
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    };

    const cloudinaryResult = await uploadToCloudinary();

    // Update user in database
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: cloudinaryResult.secure_url },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile picture updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating profile pic:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
