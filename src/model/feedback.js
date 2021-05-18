const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    feedback: {
        type:String,
        required:true
    }
});

//collection
const Feedback = new mongoose.model("Feedback", userSchema);
module.exports = Feedback;