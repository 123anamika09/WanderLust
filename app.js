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

const listings = require("./routes/listing.js");
const reviewss = require("./routes/review.js")

const session = require("express-session") ; // for  message 
const flash  = require("connect-flash");
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

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use("/listings",listings)
app.use("/listings/:id/reviews",reviewss);


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