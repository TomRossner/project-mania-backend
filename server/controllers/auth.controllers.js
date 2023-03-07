const {User} = require("../models");
const {validateRegistrationInputs, validateLoginInputs} = require("../validations/auth.validations");
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const serviceAccount = require("../../projectmania-e73ae-firebase-adminsdk-hcn09-4c2d89f6b3.json");
const {generateObjectId, hash, generatePassword, comparePasswords} = require("../utils/utils");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getUsers(req, res) {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({error: "Failed getting users"});
    }
}

async function signUp(req, res) {
    try {
        const newUser = req.body; 
        const {error} = validateRegistrationInputs(newUser);
        if (error) return res.status(400).send({error: error.details[0].message});

        const isUserAlreadyRegistered = await User.findOne({ email: req.body.email });
        if (isUserAlreadyRegistered) {
            return res.status(400).send({error: "User already registered"});
        }

        const user = await new User({
            ...newUser,
            password: await hash(newUser.password)
        }).save();
        
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: "Registration failed"});
    }
}

async function signIn(req, res) {
    try {
        const {email, password} = req.body;
        const {error} = validateLoginInputs(req.body);
        if (error) return res.status(400).send({error: error.details[0].message});

        const user = await User.findOne({email: email});
        if (!user) return res.status(404).send({error: "User not found"});

        const isMatchingPassword = await comparePasswords(password, user.password);

        if (!isMatchingPassword) return res.status(400).send({error: "Incorrect email or password"});
        
        const token = user.generateAuthToken();
        return res.status(200).send({token});
    } catch (error) {
        res.status(400).send({error: "Login failed"});
    }
}

async function getUserInfo(req, res) {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select({password: 0, __v: 0});
        
        if (!user) return res.status(400).send({error: "User not found"});

        return res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: "Failed getting user"});
    }
}

async function googleSignIn(req, res) {
    try {
        const {googleToken} = req.body;
        const decodedToken = await admin.auth().verifyIdToken(googleToken);
        const {email} = decodedToken;

        const isUserRegistered = await User.findOne({email: email});
        if (!isUserRegistered) return res.status(400).send({error: "User not registered"});

        const {_id} = await User.findOne({email:email}).select({_id: 1});
        const token = jwt.sign({_id, email}, process.env.JWT_SECRET);
        return res.status(200).send({token});
    } catch (error) {
        console.log(error);
        res.status(400).send({error: "Failed signing in with Google"});
    }
}

async function googleSignUp(req, res) {
    try {
        const {displayName, email} = req.body;

        const isUserAlreadyRegistered = await User.findOne({email: email});
        if (isUserAlreadyRegistered) return res.status(400).send({error: "User already registered"});

        const _id = generateObjectId(req.body.uid);
        const password = generatePassword(); // Generate random password;
        const first_name = displayName.split(" ")[0];
        const last_name = displayName.split(" ")[1];

        const newUser = {_id, first_name, last_name, email, password};

        const user = await new User(newUser).save();
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send({error: "Failed signing up with Google"});
    }
}

module.exports = {
    getUsers,
    signUp,
    signIn,
    getUserInfo,
    googleSignIn,
    googleSignUp
}