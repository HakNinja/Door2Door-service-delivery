require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');

const auth = require('./middleware/auth');

require("./db/conn");

const User = require("./model/user");
const Message = require("./model/message");
const Feedback = require("./model/feedback");

const { RSA_NO_PADDING } = require('constants');

const port = process.env.PORT || 8000

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partials_path = path.join(__dirname, "../template/partials");

app.use(cookieParser());
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

        const temp = await User.findOne({email:newuser.email});
        if(temp != null){
            return res.status(400).render("signupEmailErr");
        }

        if (newuser.password===newuser.confirmpassword){
            //middleware
            const token = await newuser.generateAuthToken();

            res.cookie("jwt", token, {
                expires:new Date(Date.now() + 100000),
                httpOnly:true
            });

            await newuser.save();
            res.status(201).render("signupRedirectPage");    
        } else {
            res.status(400).render("signupPassErr");           
        }
    } catch (error) {
        res.status(400).render("databaseError");
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

        res.cookie("jwt", token, {
            expires:new Date(Date.now() + 2592000000),
            httpOnly:true
        });
        
        if(isMatched){
            res.status(201).render("signinRedirectPage");    
        } else {
            res.status(201).render("databaseError");                   
        }
    } catch (error) {
        res.status(400).render("databaseError");        
    }
});

app.get("/logout", auth, async(req,res) => {
    try {
        console.log(req.user);
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;
        });
        res.clearCookie("jwt");
        await req.user.save();
        res.status(201).render("logoutRedirectPage");    
        } catch (error) {   
            res.status(500).render("databaseError");        
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
        await inbox.save();
        res.status(201).render("homeRedirectPage");    
    } catch (error) {
        res.status(400).render("PageNotFound");
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
        await report.save();
        res.status(201).render("homeRedirectPage");    
    } catch (error) {
        res.status(400).render("PageNotFound");
    }
});

// get shop detail page
app.post("/shopDetails", async(req,res) => {
    try {   
        res.render("shopDetailsPage",{productImg:req.body.productImg, productName:req.body.productName});
    } catch (error) {
        res.status(400).render("PageNotFound");
    }
});

// user page
// get user page
app.get("/user", auth, (req,res) => {
    res.render("userPage");
});

// post add to cart page
app.post("/addToCart", auth, async(req,res) => {
    try {
        eval(`req.user.products.${req.body.productName} = ${req.body.productQuantity}`);
        await req.user.save();
        res.status(201).render("addToCartPage");        
    } catch (error) {
        console.log(error);
        res.status(400).render("PageNotFound");
    }
});

// get faq page
app.get("/faq", (req,res) => {
    res.render("faqPage");
});

// get services page
app.get("/services", (req,res) => {
    res.render("servicesPage");
});

// get PageNotFound
app.get("/PageNotFound", (req,res) => {
    res.render("PageNotFound");
});

//listing at
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});