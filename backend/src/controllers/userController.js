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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, email } = req.body;

    console.log(`>>> [${new Date().toLocaleTimeString()}] UPDATE PROFILE: userId=${userId}, name=${name}, phone=${phone}, email=${email}`);

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone.replace(/\D/g, "");
    if (email) updateData.email = email.toLowerCase();

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!user) {
      console.log(`>>> User not found: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`>>> Profile updated successfully for: ${user.name}`);
    res.status(200).json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.updateLiveLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const userId = req.user.id;
    
    if (lat == null || lng == null) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        'location.lat': lat,
        'location.lng': lng,
        'location.lastUpdated': new Date(),
        'location.isLive': true
      },
      { new: true }
    );
    
    res.status(200).json({ 
      success: true, 
      location: user.location 
    });
  } catch (error) {
    console.error("Update Live Location Error:", error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

exports.getLiveLocation = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      lat: user.location?.lat,
      lng: user.location?.lng,
      lastUpdated: user.location?.lastUpdated,
      isLive: user.location?.isLive,
      phone: user.phone,
      name: user.name
    });
  } catch (error) {
    console.error("Get Live Location Error:", error);
    res.status(500).json({ error: 'Failed to get location' });
  }
};
