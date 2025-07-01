const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema  } = require("../schema.js");
const Listing = require("../modals/listing.js");
const {isLoggedIn} = require("../middleware.js")


//  validate fnc for listing schema 
const validateListing =(req,res,next)=>{

    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

// -----index route------------------------------------------
router.get("/",wrapAsync(async(req,res)=>{
     const allListings= await Listing.find({});
    //  console.log(allListings); 
     res.render("./listings/index.ejs",{allListings});
    }));


// ----------------create : New & create Route-------------
// ----------------- new route ----------------------------
router.get("/new",isLoggedIn,(req,res)=>{ //isLOggedIn middleware passed here  
    res.render("listings/new.ejs" );// form render
});



// -----------show route--------------------------------
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id).populate("reviews").populate("owner");
   console.log(listing);
   if(!listing){
    req.flash("error"," Listing not found DNE");
    res.redirect("/listings");
   }
   console.log(listing)
   res.render("./listings/show.ejs",{listing});

}));

// ------------------------create Route------------
router.post("/",
validateListing,
isLoggedIn,
    wrapAsync( async(req,res, next)=>{  // here it's async fnc we want to do changges in db show
    // m1----- all method extract
    // let { title,description,image, price,location, country } = req.body;
    // m2 ----- make the key of an object
    // let listing = req.body.listing;
    // new listing( req.body.listing); //instance created
  
    //  we can write it like 
    //  we send 400 error for clent side when the client does not send the proper data or any issue then we throw the error
    

     const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");
//    wrapSync is used here for  better way to write a try catch block 
})
);


// --------------update route = edit & update route  -- Get And Put req --------------------------


// ✅ FIXED: Removed validateListing from GET
router.get("/:id/edit", isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error"," Listing not found DNE");
    res.redirect("/listings");
   }
    res.render("listings/edit.ejs", { listing });
}));


// update route
router.put("/:id" ,isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing}); // deconstruct the body
   req.flash("success","Listing updated");
  res.redirect("/listings");
})
);


// --------------------delete route---------------
router.delete("/:id",isLoggedIn,wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success","Listing deleted");
    res.redirect("/listings");
})
);

module.exports= router;