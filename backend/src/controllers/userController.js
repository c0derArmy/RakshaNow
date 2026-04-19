const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.updateProfilePic = async (req, res) => {
  console.log('🖼️ PROFIL PIC UPLOAD ATTEMPTED:', {
    userId: req.user?.id,
    hasFile: !!req.file,
    fileType: req.file?.mimetype,
    fileSize: req.file?.size
  });

  try {
    if (!req.file) {
      console.log('❌ No image provided in request');
      return res.status(400).json({ message: 'No image provided' });
    }

    // Upload image buffer to Cloudinary using a Promise-based approach
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        console.log('☁️ Uploading to Cloudinary...');
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'rakshanow_profiles',
            public_id: `user_${req.user.id}_${Date.now()}`,
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              console.error('☁️ Cloudinary Upload Error:', error);
              reject(error);
            }
            else {
              console.log('✅ Cloudinary Upload Successful');
              resolve(result);
            }
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

    console.log('💾 Database updated with new profile pic URL');

    res.json({
      message: 'Profile picture updated successfully',
      user
    });
  } catch (error) {
    console.error('🚨 Error updating profile pic:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};
