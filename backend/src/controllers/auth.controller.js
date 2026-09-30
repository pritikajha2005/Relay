const User = require("../models/User");
const bcrypt = require("bcrypt")
const generateToken = require("../lib/utils");

const signup = async (req, res) => {
    try{
        const {fullName, email, password} = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6){
            return res.status(400).json({
                message: "Password must be atleast 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)){
            return res.status(400).json({
                message: "Send a valid email"
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        generateToken(newUser._id, res);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });

    }catch(error){
        console.error("Signup error: ", error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                message:"Invalid credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        generateToken(user._id, res);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    }catch(error){
        console.error("Login error: " , error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const logout = (req, res) => {
    res.cookie("jwt", " ", {
        maxAge: 0
    });

    res.status(200).json({
        message: "Logout successful"
    });
};

const updateProfile = async (req, res) => {
    try{
        const {fullName, profilePic} = req.body;

        const updateData = {};

        if(fullName){
            updateData.fullName = fullName;
        }

        if(profilePic){
            updateData.profilePic = profilePic;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            updateData, 
            {
                new: true
            }
        );

        res.status(200).json(updatedUser);

    }catch(error){
        console.error("Error in updateProfile: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {signup, login, logout, updateProfile};