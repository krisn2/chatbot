const Router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

Router.post("/register", async(req, res) => {
    const {email, password, name} = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({email, passwordHash:hashed, name});
        await user.save();
        res.json({message :"User registered"});
    }catch(err) {
        res.status(404).json({error:err.message});
    }
})


Router.post("/login",async(req,res)=> {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({error:"User not found"});

        const match = await bcrypt.compare(password,user.passwordHash);

        if(!match) return res.status(400).json({error: "Invalid email or password"});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token,{httpOnly:true, sameSite:"strict"});
        res.json({message : "login successful", user: {id: user.id, email}});
    }catch(err){
        res.status(400).json({error:err.message});
    }
})


Router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({message: "Logged Out"});
})


export default Router;