const mongoose = require("mongoose");
const bcrypt= require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    },
    products:{
        bag:{
            type:Number, 
            default:0
        },
        camera:{
            type:Number, 
            default:0
        },
        cap:{
            type:Number, 
            default:0
        },
        clock:{
            type:Number, 
            default:0
        },
        cosmetics:{
            type:Number, 
            default:0
        },
        cup:{
            type:Number, 
            default:0
        },
        heels:{
            type:Number, 
            default:0
        },
        headphone:{
            type:Number, 
            default:0
        },
        foundation:{
            type:Number, 
            default:0
        },
        libstick:{
            type:Number, 
            default:0
        },
        shoe:{
            type:Number, 
            default:0
        },
        watch:{
            type:Number, 
            default:0
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

//middleware
userSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token}); 
        await this.save();
        return token;
        //const userVer= await jwt.verify(token,process.env.SECRET_KEY);
        //console.log(userVer);
    } catch (error) {
            res.status(500).render("databaseError");        
    }
}

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = await bcrypt.hash(this.password,10);
    }
    next();
});

//collection
const User = new mongoose.model("User", userSchema);
module.exports = User;