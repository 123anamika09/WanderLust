const Listing = require("../modals/listing.js")
module.exports.index = async(req,res)=>{
     const allListings = await Listing.find({});
     res.render("./listings/index.ejs",{allListings});
    }

module.exports.filterListings = async(req,res)=>{
    const { category } = req.params;
    const filteredListings = await Listing.find({ category: category });
    res.render("./listings/index.ejs", { allListings: filteredListings });
}

module.exports.searchListings = async(req,res)=>{
    const { location } = req.query;
    const searchRegex = new RegExp(location, 'i');
    const listings = await Listing.find({
        $or: [
            { location: searchRegex },
            { country: searchRegex },
            { title: searchRegex }
        ]
    });
    res.render("./listings/index.ejs", { allListings: listings });
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
module.exports.createListing = async(req,res, next)=>{
    try {
        if (!req.file) {
            req.flash("error", "Please upload an image");
            return res.redirect("/listings/new");
        }
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success","New Listing created");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Error uploading image. Please try again.");
        res.redirect("/listings/new");
    }
}


//  edit route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error"," Listing not found DNE");
    res.redirect("/listings");
   }
    res.render("listings/edit.ejs", { listing });
}


//Add the missing updateListing function
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Update basic listing info
    listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Handle image upload if a new image was provided
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${listing._id}`);
};

// Add the destroyListing function as well since it's referenced in routes
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}