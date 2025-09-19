if(process.env.NODE_ENV != 'production'){
     require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // for styling
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");
const { listingSchema , reviewSchema } = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session") ; // for  message 
const flash  = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modals/user.js")
const bookingRoutes = require("./routes/bookings");
//database connectivity
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_url);
}

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // for show route
// app.use(express.json());
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate); // for use ejsMate- styling  
app.use(express.static(path.join(__dirname,"/public"))); // for using style.css  now we don't have go through all ejs file to do changes in style ...we onnly make changes in boilerplate

const sessionOptions={
   
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },

};

app.get("/",(req,res)=>{
    res.send("hii ... i am the root");
})

app.use(session(sessionOptions)); // used the session
app.use(flash());
//    Pbkdf2 was chosen because platform independent  - hashing algo

//  passport middleware && passport used middleware
// configure strategy 
// 1. 
app.use(passport.initialize());
// 2. session used to know that same user brows from page1 to page 2
app.use(passport.session()); 
// 3. 
passport.use(new LocalStrategy(User.authenticate()));  //authenticate() //Generates a function that is used in Passport's LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());//erializeUser() Generates a function that is used by Passport to serialize users into the session

//deserializeUser() Generates a function that is used by Passport to deserialize users into the session
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//  create a demo user to chek whether our passport work efficiently
app.get("/demouser", async(req,res)=>{
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"Anamika"
    });
   let registeredUser = await User.register(fakeUser,"helloworld"); // user ka register method = static method automatic save the user in our databse
    // register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique.
    res.send(registeredUser);
})


app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", userRouter);
app.use("/", bookingRoutes);


//  to send standard response like routes doesnot match to any path then it send 404 not found
app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "page not found")); // express error handle here 
}
)
//  to handle server side validation we have custom error handler  .
//  in server side validation when we pass data from server side in the form of api / postman/ hospscotch then may be the price should be in the string format 
//  so here it create an error

//  so we use middleware 

app.use((err, req, res, next) => {
     console.error("Error 💥:", err); // Log error
    let {statusCode = 500, message ="SomeThing went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message)
});
app.listen(8080,()=>{
    console.log("server is lstening to port :8080");
});