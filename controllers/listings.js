const Listing = require("../modals/listing.js")
module.exports.index = async(req,res)=>{
     const allListings= await Listing.find({});
    //  console.log(allListings); 
     res.render("./listings/index.ejs",{allListings});
    }
//  new route ka call back ..... router me sirf uska path aur jo v functionality hogi wo controllers me
module.exports.renderNewForm = (req,res)=>{ //isLOggedIn middleware passed here  
    res.render("listings/new.ejs" );// form render
}    

//  show route
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id)
   .populate({
     path: "reviews",
     populate:{
      path:"author",
   },
})
.populate("owner");
console.log(listing.reviews); 
   console.log(listing);
   if(!listing){
    req.flash("error"," Listing not found DNE");
    res.redirect("/listings");
   }
   console.log(listing)
   res.render("./listings/show.ejs",{listing});

};
//  post route 
module.exports.createListing = async(req,res, next)=>{  // here it's async fnc we want to do changges in db show
     const newListing = new Listing(req.body.listing);
    //  console.log(req.user);
     newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success","New Listing created");
    res.redirect("/listings");
//    wrapSync is used here for  better way to write a try catch block 
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error"," Listing not found DNE");
    res.redirect("/listings");
   }
    res.render("listings/edit.ejs", { listing });
}