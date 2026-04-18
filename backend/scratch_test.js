require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
    try {
        const u = await User.create({
            name: "Scratch Tester",
            email: "scratch123@example.com",
            googleId: "fake_uid_123",
            profilePic: "none"
        });
        console.log("Success:", u);
    } catch(err) {
        console.error("FAIL:", err);
    }
    process.exit(0);
});
