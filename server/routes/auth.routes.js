const express = require("express");
const AuthRouter = express.Router();
const {
    signUp,
    signIn,
    getUserInfo,
    googleSignIn,
    googleSignUp,
    updateUser,
    updateProfilePicture,
    checkPassword,
    updatePassword
} = require("../controllers/auth.controllers");
const AUTH_MW = require("../middlewares/auth.middleware");

AuthRouter.post("/sign-up", signUp); // Sign-up
AuthRouter.post("/sign-in", signIn); // Sign-in
AuthRouter.post("/sign-up/google", googleSignUp); // Google sign-up
AuthRouter.post("/sign-in/google", googleSignIn); // Google sign-in
AuthRouter.get("/get/:id", AUTH_MW, getUserInfo); // Get user details
AuthRouter.put("/update", AUTH_MW, updateUser); // Update user
AuthRouter.post("/check-pw", AUTH_MW, checkPassword); // Check password
AuthRouter.post("/update-pw", AUTH_MW, updatePassword); // Update password
AuthRouter.post("/update-profile-picture", AUTH_MW, updateProfilePicture); // Update profile picture

// Export router
module.exports = AuthRouter;