const {User} = require("../models");
const {validateRegistrationInputs, validateLoginInputs} = require("../validations/auth.validations");
const bcrypt = require('bcrypt');

const hash = async (password) => {
    const hashedPW = await bcrypt.hash(password, 10);
    return hashedPW;
} 

async function getUsers(req, res) {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({error: "Failed getting users"});
    }
}

async function register(req, res) {
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

async function login(req, res) {
    try {
        const {email, password} = req.body;
        const {error} = validateLoginInputs(req.body);
        if (error) return res.status(400).send({error: error.details[0].message});

        const user = await User.findOne({email: email});
        if (!user) return res.status(404).send({error: "User not found"});

        const isMatchingPassword = await bcrypt.compare(password, user.password);

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
        const user = await User.findById(id).select({password: 0});
        
        if (!user) return res.status(400).send({error: "User not found"});

        return res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: "Failed getting user"});
    }
}

module.exports = {
    getUsers,
    register,
    login,
    getUserInfo
}