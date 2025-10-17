import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Checking User Existance
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    
    //Field Checking
    if(!username) return res.status(400).json({message:"UserName Required"});
    if(!password) return res.status(400).json({message:"Password Required"});
    if(!email) return res.status(400).json({message:"Email is Required"});

    //HASH Password
    const hashedpassword = await bcrypt.hash(password, 10);

    //Create User
    const newUser = new User({
      username,
      email,
      password: hashedpassword,
    });

    //Save Into DB
    await newUser.save();

    //Response to Frontend
    res.status(201).json({ message: "User Registered Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering User", error });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    
    //Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //Create Token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_SECRET, {
      expiresIn: "1D",
    });

    //Response to Frontend
    res.json({message:"Login Successful",token ,Id:user._id});
  } catch (error) {
    res.status(500).json({ message: "Login Error", error });
  }
});

export default router;