const express = require("express");
const AuthRouter = express.Router();
const {getUsers, register, login} = require("../controllers/auth.controllers");

AuthRouter.get("/users", getUsers);
AuthRouter.post("/register", register);
AuthRouter.post("/login", login);

module.exports = AuthRouter;