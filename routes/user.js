const express = require("express");
const router = express.Router();
const User = require("../modals/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { route } = require("./listing.js");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup" ,wrapAsync(async(req,res) => {
    try{
 let { username,email, password}  = req.body;
    const newUser = new User({email,username});
  const registeredUser= await  User.register(newUser,password) ; // register to databse
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
      req.flash("success", "Welcome back to the wanderlust");
  res.redirect(res.locals.redirectUrl || "/listings");

  })
  }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})
router.post(
    "/login",
     saveRedirectUrl,
    passport.authenticate("local", 
         { failureRedirect: '/login',failureFlash:true }), 
       async(req,res)=>{ // passport.authenticate = middle ware which is used in post route before login
       req.flash( "success" ,"Welcome to wanderlust! You are logged in.");
       let redirectUrl = res.locals.redirectUrl || "/listings"
       res.redirect(redirectUrl);
})
router.get("/logout",(req,res,next)=>{
        req.logout((err)=>{ //logOut= callback 
         if(err){
          return  next(err);
         }
         req.flash("success","You are logout now");
         res.redirect("/listings")
        })
})
module.exports = router;
