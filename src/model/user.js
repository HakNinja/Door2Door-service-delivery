const mongoose = require("mongoose");
const bcrypt= require("bcryptjs");

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
    }
});

//middleware
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
});

//collection
const User = new mongoose.model("User", userSchema);
module.exports = User;