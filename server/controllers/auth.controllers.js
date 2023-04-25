const {User} = require("../models/user.model");
const {validateRegistrationInputs, validateLoginInputs} = require("../validations/auth.validations");
const jwt = require('jsonwebtoken');
const {generateObjectId, generatePassword} = require("../utils/generators.utils");
const {hash, comparePasswords} = require("../utils/bcrypt.utils");
const { decodeToken } = require("../utils/firebase.utils");
const { compress } = require("../utils/sharp.utils");
const { checkUserData } = require("../utils/regex");

// Sign-up
async function signUp(req, res) {
    try {
        const {newUser} = req.body;
        
        // Check user inputs
        if (!checkUserData(newUser)) {
            return res.status(400).send({error: 'Failed to register. Invalid inputs'});
        }

        const {error} = validateRegistrationInputs(newUser);
        if (error) return res.status(400).send({error: error.details[0].message});

        // Check if user is already registered
        const isUserAlreadyRegistered = await User.findOne({ email: req.body.email });
        
        if (isUserAlreadyRegistered) {
            return res.status(400).send({error: "User already registered"});
        }

        // Register user
        await new User({
            ...newUser,
            password: await hash(newUser.password)
        }).save();
        
        return res.status(201).send("Successfully registered user");
    } catch (error) {
        res.status(400).send({error: "Registration failed"});
        throw new Error(error);
    }
}

// Sign-in
async function signIn(req, res) {
    try {
        const {email, password} = req.body;

        // Validate inputs
        const {error} = validateLoginInputs(req.body);
        if (error) return res.status(400).send({error: error.details[0].message});

        // Check if user exists in DB
        const user = await User.findOne({email: email});
        if (!user) return res.status(404).send({error: "User not found"});

        // Check if password matches the correct password
        const isMatchingPassword = await comparePasswords(password, user.password);
        
        if (!isMatchingPassword) return res.status(400).send({error: "Incorrect email or password"});
        
        // Set 'online' property to true
        await User.updateOne({email:email}, {$set: {online: true}});
        
        // Generate auth token
        const token = user.generateAuthToken();

        return res.status(200).send({token});
    } catch (error) {
        res.status(400).send({error: "Login failed"});
        throw new Error(error);
    }
}

// Get user details
async function getUserInfo(req, res) {
    try {
        const {id} = req.params;

        // Find user
        const user = await User.findOne({_id: id}).select({password: 0, __v: 0});
        if (!user) return res.status(400).send({error: "User not found"});

        return res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: "Failed getting user"});
        throw new Error(error);
    }
}

// Google sign-in
async function googleSignIn(req, res) {
    try {
        const {googleToken} = req.body;

        // Decode access token
        const decodedToken = await decodeToken(googleToken);
        
        // Retrieve email from decoded token 
        const {email} = decodedToken;

        // Check if user is already registered
        const isUserRegistered = await User.findOne({email: email});
        if (!isUserRegistered) return res.status(400).send({error: "User not registered"});

        // Set 'online' property to true
        await User.updateOne({email:email}, {$set: {online: true}});

        // Get _id and admin properties for the JWT signing process
        const {_id, admin} = await User.findOne({email:email}).select({_id: 1, admin: 1});

        // Sign JWT
        const token = jwt.sign({_id, email, admin}, process.env.JWT_SECRET);

        return res.status(200).send({token});
    } catch (error) {
        res.status(400).send({error: "Failed signing in with Google"});
        throw new Error(error);
    }
}

// Google sign-up
async function googleSignUp(req, res) {
    try {
        const {displayName, email, imgUrl, uid} = req.body;

        // Check if user is already registered
        const isUserAlreadyRegistered = await User.findOne({email: email});
        if (isUserAlreadyRegistered) return res.status(400).send({error: "User already registered"});

        // Generate ObjectId from uid
        const _id = generateObjectId(uid);

        // Hash randomly-generated password since Google does not provide a password
        const password = await hash(generatePassword());

        const first_name = displayName.split(" ")[0];
        const last_name = displayName.split(" ")[1];

        const newUser = {_id, first_name, last_name, email, password, img_url: imgUrl};

        // Register user
        await new User(newUser).save();
        
        return res.status(201).send("Successfully registered Google user");
    } catch (error) {
        res.status(400).send({error: "Failed signing up with Google"});
        throw new Error(error);
    }
}

// Update user
async function updateUser(req, res) {
    try {
        const updatedUser = await User.findOneAndUpdate({email: req.body.email}, req.body);

        return res.status(200).send(updatedUser);
    } catch (error) {
        res.status(400).send({error: "Failed updating user"});
        throw new Error(error);
    }
}

// Update user's profile picture
async function updateProfilePicture(req, res) {
    try {
        const {email, imgData} = req.body;

        // Compress image
        const compressedImage = await compress(imgData);

        // Update image in DB
        await User.updateOne({email: email}, {
            $set: {base64_img_data: compressedImage}
        });

        return res.status(200).send(compressedImage);
    } catch (error) {
        res.status(400).send({error: "Failed updating profile picture"});
        throw new Error(error);
    }
}

// Exports
module.exports = {
    signUp,
    signIn,
    getUserInfo,
    googleSignIn,
    googleSignUp,
    updateUser,
    updateProfilePicture
}