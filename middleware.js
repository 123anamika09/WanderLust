module.exports.isLoggedIn=(req,res,next)=>{ //middleware for reaurthentication
    
    if(!req.isAuthenticated()){
        // redirectUrl save
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","Ypu must be logged in to create listing!");
   return res.redirect("/login")
}next();

};
module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
};