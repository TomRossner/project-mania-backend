const express = require("express");
const AuthRouter = express.Router();
const {getUsers, register, login, getUserInfo, googleSignIn} = require("../controllers/auth.controllers");
const AUTH_MW = require("../middlewares/auth.middleware");

AuthRouter.get("/users", getUsers);
AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/login/google", googleSignIn);
AuthRouter.get("/get/:id", AUTH_MW, getUserInfo);

module.exports = AuthRouter;