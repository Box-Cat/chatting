const User = require('../models/userModel');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/authMiddleware');

// user registration
router.post('/register',async (req,res)=>{

    try{
        // check if user already exists
        const user = await User.findOne({email:req.body.email});
        if(user){
            return req.send({
                success : false,
                message : "User already exists"
            })
        }

        //create new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: "User create successfully"
        })

    }catch(error){
        res.send({
            message: error.message,
            success: false,
        });
    }

});

// user login
router.post("/login",async(req, res)=>{
    try{
        // check if user exists
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.send({
                success: false,
                message: "User does not exist",
            })
        }

        // check if password is correct
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!validPassword){
            return res.send({
                success: false,
                message: "Invalid password",
            })
        }

        //create and assign a token
        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.send({
            success: true,
            message: "User logged in successfully",
            data: token
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false,
        })
    }
});

// get current user
router.get("/get-current-user", authMiddleware, async(req,res)=>{
    try{
        const user = await User.findOne({_id: req.body.userId});
        res.send({
            success: true,
            message: "User fetched successfully",
            data: user,
        })
    }catch(error){
        res.send({
            message: error.message,
            success: false,
        })
    }
});

// get all users exceot current user

router.get('/get-all-users',authMiddleware,async (req, res) => {
    try{
        const allUsers = await User.find({_id: {$ne: req.body.userid}});
        res.send({
            success: true,
            message: "Users fetched successfully",
            data: allUsers,

        });
    }catch(error){
        res.send({
            message: error.message,
            success: false,
        });
    }
})
module.exports = router;