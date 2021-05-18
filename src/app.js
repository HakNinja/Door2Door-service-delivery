require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");

require("./db/conn");

const User = require("./model/user");
const Message = require("./model/message");
const Feedback = require("./model/feedback");

const { RSA_NO_PADDING } = require('constants');

const port = process.env.PORT || 8000

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");

app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// get home page
app.get("/", (req,res) => {
    res.render("index");
});

// get signup page
app.get("/signup", (req,res) => {
    res.render("signup");
});

// post signup page + new user
app.post("/signup", async(req,res) => {
    try {
        const newuser = new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        })
        if (newuser.password===newuser.confirmpassword){
            //middleware
            const token = await newuser.generateAuthToken();

            const Signup = await newuser.save();
            res.status(201).render("index");    
        }else{
            res.status(201).send("Make sure that password and confirm-password must be same");           
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// get signin page
app.get("/signin", (req,res) => {
    res.render("signin");
});

// post signin page + user login
app.post("/signin", async(req,res) => {
    try {
        const email=req.body.email;
        const password=req.body.password;
        const temp = await User.findOne({email:email});
        const isMatched = await bcrypt.compare(password,temp.password);
        
        //middleware
        const token = await temp.generateAuthToken();
        
        if(isMatched){
            res.status(201).render("index");           
        } 
        else{
            res.status(201).send("INVALID ENTRIES");           
        }
    } catch (error) {
        res.status(400).send("INVALID ENTRIES");        
    }
});

// get contact page
app.get("/contact", (req,res) => {
    res.render("contactPage");
});

// post signup page + new user
app.post("/contact", async(req,res) => {
    try {
        const inbox = new Message({
            name:req.body.name,
            email:req.body.email,
            subject:req.body.subject,
            message:req.body.message
        })
        const Messaged = await inbox.save();
        res.status(201).render("contactPage");
    } catch (error) {
        res.status(400).send(error);
    }
});

// get feedback page
app.get("/feedback", (req,res) => {
    res.render("feedbackpage");
});

// post feedback page 
app.post("/feedback", async(req,res) => {
    try {
        const report = new Feedback({
            subject:req.body.subject,
            feedback:req.body.feedback
        })
        const Reported = await report.save();
        res.status(201).render("feedbackpage");
    } catch (error) {
        res.status(400).send(error);
    }
});

// get faq page
app.get("/faq", (req,res) => {
    res.render("faqPage");
});

//get services page
app.get("/services", (req,res) => {
    res.render("servicesPage");
});

//listing at
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});