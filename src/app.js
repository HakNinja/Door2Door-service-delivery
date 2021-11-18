require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

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

// mailing 
function sendEmailuser(email, name, mailOnBehalf="") {
    var transporter = nodemailer.createTransport({
        service: process.env.services,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
    })

    if ( mailOnBehalf === "signup" ){
        transporter.sendMail({
            from: process.env.from,
            to: email,
            subject: "Support",
            html: `<pre>Hi <b>${name}</b>,
    
                Thanks for getting in touch with us. 
                
                You have successfully signup for our servies. 
    
                Need help in the meantime check out our Contact Page for more.
                
                With Best Regards from,
                Admin.
                Thank You
                
                <i>For More Support.. Mail us at infodoortodoor@gmail.com</i>
                <i>***** This is an autogenrated email. Please don't reply back.*****</pre>`,
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.status(201).send("Mail sent Sucessfully");
            }
            })
    } else if ( mailOnBehalf === "message" ){
        transporter.sendMail({
            from: process.env.from,
            to: email,
            subject: "Support",
            html: `<pre>Hi <b>${name}</b>,
    
                Thanks for getting in touch with us. 
                
                You have get your query. We will get back to you in next 24 hours.

                Need help in the meantime check out our Contact Page for more.
                
                With Best Regards from,
                Admin.
                Thank You
                
                <i>For More Support.. Mail us at @officialdoor2door@gmail.com</i>
                <i>***** This is an autogenrated email. Please don't reply back.*****</pre>`,
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.status(201).send("Mail sent Sucessfully");
            }
            })
    } else if ( mailOnBehalf === "addToCart" ){
        transporter.sendMail({
            from: process.env.from,
            to: email,
            subject: "Support",
            html: `<pre>Hi <b>${name}</b>,
    
                Thanks for giving time on our platform. 
                
                Some item are added to your cart.Kindly go through your cart and order th items you need.

                Need help in the meantime check out our Contact Page for more.
                
                With Best Regards from,
                Admin.
                Thank You
                
                <i>For More Support.. Mail us at @officialdoor2door@gmail.com</i>
                <i>***** This is an autogenrated email. Please don't reply back.*****</pre>`,
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.status(201).send("Mail sent Sucessfully");
            }
            })
    } else if ( mailOnBehalf === "logout" ){
        transporter.sendMail({
            from: process.env.from,
            to: email,
            subject: "Support",
            html: `<pre>Hi <b>${name}</b>,
    
                You have successfully logout form your account on our Platfrom.    

                Need help then check out our Contact Page for more.
                
                With Best Regards from,
                Admin.
                Thank You
                
                <i>For More Support.. Mail us at @officialdoor2door@gmail.com</i>
                <i>***** This is an autogenrated email. Please don't reply back.*****</pre>`,
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.status(201).send("Mail sent Sucessfully");
            }
        })
    } else {
        transporter.sendMail({
            from: process.env.from,
            to: email,
            subject: "Support",
            html: `<pre>Hi <b>${name}</b>,
    
                You have successfully signin. 
                Thanks for choosing our services hope you will like your services   

                Need help then check out our Contact Page for more.
                
                With Best Regards from,
                Admin.
                Thank You
                
                <i>For More Support.. Mail us at @officialdoor2door@gmail.com</i>
                <i>***** This is an autogenrated email. Please don't reply back.*****</pre>`,
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                res.status(201).send("Mail sent Sucessfully");
            }
        })
    }
}


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
            await sendEmailuser(newuser.email, newuser.username, "signup");
            await newuser.save();
            res.status(201).render("signupRedirectPage");    
        } else {
            res.status(400).render("signupPassErr");           
        }
    } catch (error) {
        console.log(error)
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
            await sendEmailuser(temp.email, temp.username);
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
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;
        });
        res.clearCookie("jwt");
        await req.user.save();
        await sendEmailuser(req.user.email, req.user.username, "logout");
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
        await sendEmailuser(inbox.email, inbox.name, "message");
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
    res.render("userPage",{username:req.user.username, useremail:req.user.email, userproduct:req.user.products});
});

// post add to cart page
app.post("/addToCart", auth, async(req,res) => {
    try {
        eval(`req.user.products.${req.body.productName} = req.user.products.${req.body.productName} + ${req.body.productQuantity}`);
        await req.user.save();
        await sendEmailuser(req.user.email, req.user.username, "addToCart");
        res.status(201).render("addToCartPage");        
    } catch (error) {
        console.log(error)
        res.status(400).render("PageNotFound");
    }
});

// get shopping page
app.get("/shopping", (req,res) => {
    res.render("shopPage");
});

// get aboutus page
app.get("/aboutus", (req,res) => {
    res.render("aboutUsPage");
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