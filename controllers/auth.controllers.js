const {User} = require("../models/user.model");
const {Board} = require('../models/board.model');
const {validateRegistrationInputs, validateLoginInputs} = require("../validations/auth.validations");
const jwt = require('jsonwebtoken');
const {generateObjectId, generatePassword} = require("../utils/generators.utils");
const {hash, comparePasswords} = require("../utils/bcrypt.utils");
const { decodeToken } = require("../utils/firebase.utils");
const { compress } = require("../utils/sharp.utils");
const { checkUserData, checkPattern, PATTERN_TYPES } = require("../utils/regex");
const ERROR_MESSAGES = require("../utils/errors");

// Sign-up
async function signUp(req, res) {
    try {
        const {newUser} = req.body;
        
        // Check user data
        if (!checkUserData(newUser)) {
            return res.status(400).send({error: ERROR_MESSAGES.REGISTRATION_FAILED_INVALID_INPUTS});
        }

        const {error} = validateRegistrationInputs(newUser);
        if (error) return res.status(400).send({error: error.details[0].message});

        // Check if user is already registered
        const isUserAlreadyRegistered = await User.findOne({ email: req.body.email });
        
        if (isUserAlreadyRegistered) {
            return res.status(400).send({error: ERROR_MESSAGES.USER_ALREADY_REGISTERED});
        }

        // Register user
        await new User({
            ...newUser,
            password: await hash(newUser.password)
        }).save();
        
        return res.status(201).send("Successfully registered user");
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.REGISTRATION_FAILED});
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
        if (!user) return res.status(404).send({error: ERROR_MESSAGES.USER_NOT_FOUND});

        // Check if password matches the correct password
        const isMatchingPassword = await comparePasswords(password, user.password);
        
        if (!isMatchingPassword) return res.status(400).send({error: ERROR_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD});
        
        // Set 'online' property to true
        await User.updateOne({email:email}, {$set: {online: true}});
        
        // Generate auth token
        const token = user.generateAuthToken();

        return res.status(200).send({token});
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.LOGIN_FAILED});
    }
}

// Get user details
async function getUserInfo(req, res) {
    try {
        const {id} = req.params;

        // Find user
        const user = await User.findOne({_id: id}).select({password: 0, __v: 0});
        if (!user) return res.status(400).send({error: ERROR_MESSAGES.USER_NOT_FOUND});

        return res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GET_USER_FAILED});
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
        if (!isUserRegistered) return res.status(400).send({error: ERROR_MESSAGES.USER_NOT_REGISTERED});

        // Set 'online' property to true
        await User.updateOne({email:email}, {$set: {online: true}});

        // Get _id and admin properties for the JWT signing process
        const {_id, admin} = await User.findOne({email:email}).select({_id: 1, admin: 1});

        // Sign JWT
        const token = jwt.sign({_id, email, admin}, process.env.JWT_SECRET);

        return res.status(200).send({token});
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GOOGLE_SIGN_IN_FAILED});
    }
}

// Google sign-up
async function googleSignUp(req, res) {
    try {
        const {displayName, email, imgUrl, uid} = req.body;

        // Check if user is already registered
        const isUserAlreadyRegistered = await User.findOne({email: email});
        if (isUserAlreadyRegistered) return res.status(400).send({error: ERROR_MESSAGES.USER_ALREADY_REGISTERED});

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
        res.status(400).send({error: ERROR_MESSAGES.GOOGLE_SIGN_UP_FAILED});
    }
}

// Update user
async function updateUser(req, res) {
    try {
        const updatedUser = await User.findOneAndUpdate({email: req.body.email}, req.body);
        
        return res.status(200).send(updatedUser);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.UPDATE_USER_FAILED});
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
        res.status(400).send({error: ERROR_MESSAGES.UPDATE_PROFILE_PICTURE_FAILED});
    }
}

// Check password
async function checkPassword(req, res) {
    try {
        const {id, pw} = req.body;

        // Find password
        const {password} = await User.findOne({_id: id}).select({password: 1, _id: 0});

        // Compare passwords
        const passwordsAreMatching = await comparePasswords(pw, password);

        if (!passwordsAreMatching) {
            return res.status(400).send({error: ERROR_MESSAGES.WRONG_PASSWORD});
        }

        return res.status(200).send('Ok');
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.CHECK_PASSWORD_FAILED});
    }
}

// Update password
async function updatePassword(req,res) {
    try {
        const {id, newPW} = req.body;

        // Check newPW regex pattern
        if (!checkPattern(PATTERN_TYPES.PASSWORD, newPW)) {
            return res.status(400).send({error: ERROR_MESSAGES.INVALID_PASSWORD_FORMAT});
        }

        // Update password
        await User.updateOne(
            {_id: id},
            {$set: {password: await hash(newPW)}},
            {new: true}
        );

        return res.status(200).send('Successfully updated password');
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.UPDATE_PASSWORD_FAILED});
    }
}

// Check admin pass code
async function checkAdminPass(req, res) {
    try {
        const {input, projectId} = req.body;

        // Find and extract project's admin pass code
        const {admin_pass} = await Board.findOne({_id: projectId}).select({_id: 0, admin_pass: 1});

        // Check if input matches project's admin pass code
        const isValid = await comparePasswords(input, admin_pass);

        // If not valid, return error
        if (!isValid) return res.status(400).send({error: 'Wrong pass code'});

        return res.status(200).send('Valid pass code');
    } catch (error) {
        res.status(400).send({error: 'Failed checking pass code'});
    }
}

// Update logout time
async function updateLastSeen(req, res) {
    const date = new Date();
    try {
        const {userId} = req.body;
        
        await User.updateOne({_id: userId}, {$set: {last_seen: date}});

        return res.status(200).send('Successfully updated last_seen property');
    } catch (error) {
        res.status(400).send({error: 'Failed to update last_seen property'});
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
    updateProfilePicture,
    checkPassword,
    updatePassword,
    updateLastSeen,
    checkAdminPass
}