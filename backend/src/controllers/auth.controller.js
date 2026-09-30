const User =require("../models/User");
const bcrypt = require("bcrypt")
const generateToken = require("../lib/utils");

const signup = async (req, res) => {
    try{
        const {fullname, email, password} = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.lenght < 6){
            res.status(400).json({
                message: "Password must be atleast 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)){
            res.status(400).json({
                message: "Send a valid email"
            });
        }

        const exsistingUser = await User.findOne({email});

        if(exsistingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        generateToken(newUser._id, res);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                fullname: newUser.fullName,
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

        const isPasswordCorrect = bcrypt.compare(password, user.password);

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
                name: user.fullName,
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

module.exports= {signup, login, logout};