const express = require("express");
const AuthRouter = express.Router();
const {getUsers, signUp, signIn, getUserInfo, googleSignIn, googleSignUp} = require("../controllers/auth.controllers");
const AUTH_MW = require("../middlewares/auth.middleware");

AuthRouter.post("/sign-up", signUp);
AuthRouter.post("/sign-up/google", googleSignUp);
AuthRouter.post("/sign-in", signIn);
AuthRouter.post("/sign-in/google", googleSignIn);
AuthRouter.get("/get/:id", AUTH_MW, getUserInfo);

module.exports = AuthRouter;