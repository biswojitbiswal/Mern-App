const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true
    },
    email : {
        type : String,
        required:true
    },
    phone : {
        type:Number,
        required: true
    },
    work : {
        type:String,
        required: true
    },
    password : {
        type:String,
        required: true
    },
    cpassword : {
        type:String,
        required: true
    },
    date : {
        type:Date,
        default:Date.now,
    },
    messages:[
        {
            name : {
                type:String,
                required: true
            },
            email : {
                type : String,
                required:true
            },
            phone : {
                type:Number,
                required: true
            }, 
            message : {
                type : String,
                required:true
            },
        }
    ],
    tokens : [
        {
            token : {
                type:String,
                required: true
            }
        }
    ]
});


//for hashing the password
userSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

// //generate token
userSchema.methods.generateAuthToken = async function (res) {
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        res.cookie("jwttoken", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000),
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return token;
    }
    catch (err){
        console.log(err);
    }
}

//store the messages
userSchema.methods.addMessage = async function (name, email, phone, message) {
    try{
        this.messages = this.messages.concat({name, email, phone, message});
        await this.save();
        return this.message;
    } catch(err){
        console.log(err);
    }
}


const USER = mongoose.model('USER', userSchema);
module.exports = USER;