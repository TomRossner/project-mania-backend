const express = require("express");
const AuthRouter = express.Router();
const {signUp, signIn, getUserInfo, googleSignIn, googleSignUp, updateUser, updateProfilePicture} = require("../controllers/auth.controllers");
const AUTH_MW = require("../middlewares/auth.middleware");
const multer = require('multer');

const upload = multer({dest: 'uploads/'});

AuthRouter.post("/sign-up", signUp);
AuthRouter.post("/sign-up/google", googleSignUp);
AuthRouter.post("/sign-in", signIn);
AuthRouter.post("/sign-in/google", googleSignIn);
AuthRouter.get("/get/:id", AUTH_MW, getUserInfo);
AuthRouter.put("/update", AUTH_MW, updateUser);
AuthRouter.post("/update-profile-picture", AUTH_MW, upload.single('image'), updateProfilePicture);

module.exports = AuthRouter;