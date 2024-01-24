const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userAuthenticate = require("../middleware/userAuthenticate");



require("../db/connection");
const User = require("../model/userSchema");

router.get("/", userAuthenticate, async (req, res) => {
    try {
        // Your logic to get user data
        res.json(req.rootUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post("/register", async(req, res) => {
    const {name, email, phone, work, password, cpassword} = req.body;
    
    if(!name || !email|| !phone || !work || !password || !cpassword){
        return res.status(422).json({error : "filled to be required"})
    }
    try{
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(422).json({error : "User already exists."});
        }
        const user = new User({name, email, phone, work, password, cpassword});
        await user.save();
        res.status(201).json({message : "User registered successfully"});
    } catch(err) {
        console.log(err);
    }
});

// router.post("/register", async(req, res) => {
//     try{
//         const {name, email, phone, work, password, cpassword} = req.body;

//         if(!name || !email|| !phone || !work || !password || !cpassword){
//             return res.status(422).json({error : "All filled to be required"})
//         }

//         const userexist = await User.findOne({email});
//         if(userexist){
//             res.status(400).json({message:"Email already exists."});
//         }

//         // const userCreated = await User.create({name, email, phone, work, password, cpassword})
//         const user = new User({ name, email, phone, work, password, cpassword });
//         await user.save({ writeConcern: { w: 'majority', wtimeout: 0 } });

//         res.status(200).json({message : "User registered successfully"});
//     } catch(error){
//         console.log(error)
//         res.status(500).json("Internal server error.");
//     }
// });


router.post("/login", async (req, res) => {
    let token;
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({error : "Plzz filled all the details."});
        }

        const userLogin = await User.findOne({email : email});

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken(res);
            
            if(!isMatch){
                res.status(400).json({error : "Invalid credentials"});
            } else {
                // console.log(userLogin)
                res.json({message : "User login successfully."});
            }
        } else {
            res.status(400).json({error : "Incalid credentials"});
        }

        
    } catch(err){
        console.log(err);
    }

});

//for about route
router.get('/about', userAuthenticate ,(req, res) => {
    res.send(req.rootUser);
    //we can write this
    // res.json(req.rootUser);
});

router.get("/contact", userAuthenticate ,(req, res) => {
    res.json(req.rootUser);
});

router.post("/contact", userAuthenticate, async(req, res) => {
    try{
        const {name, email, phone, message} = req.body;

        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({error: "plz filled the contact form"});
        }

        const contactUser = await User.findOne({_id:req.userId});
        if(contactUser){
            const userMessage = await contactUser.addMessage(name, email, phone, message);
            await contactUser.save();
            res.status(201).json({messag : "msg sent successfully"});
        }
    } catch (err) {
        console.log(err);
    }
});

router.get("/logout", (req, res) => {
    console.log("hello my logout page");
    res.clearCookie('jwttoken', {path:'/'});
    res.status(200).send("user logout");
});

module.exports = router;