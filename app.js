const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./modals/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // for styling
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");
const { listingSchema } = require("./schema.js");

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
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate); // for use ejsMate- styling  
app.use(express.static(path.join(__dirname,"/public"))); // for using style.css  now we don't have go through all ejs file to do changes in style ...we onnly make changes in boilerplate


// -----index route------------------------------------------


app.get("/testListing" , wrapAsync(async(req,res)=>{
    let sampleListing = new Listing({
        title:" My New Villa",
        description:"By the beach",
        price:1200,
        location:"colangute,Goa",
        country:"India",
    });
  await  sampleListing.save();
  console.log("Sample was saved");
  res.send("succesful tested");

})
)

app.get("/",(req,res)=>{
    res.send("hii ... i am the root");
})
const validateListing =(req,res,next)=>{

    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
// -----index route------------------------------------------
app.get("/listings",wrapAsync(async(req,res)=>{
     const allListings= await Listing.find({});
    //  console.log(allListings); 
     res.render("./listings/index.ejs",{allListings});
    }));


// ----------------create : New & create Route-------------
// ----------------- new route ----------------------------
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs" );
});



// -----------show route--------------------------------
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   console.log(listing);
   res.render("./listings/show.ejs",{listing});

}))
;
// ------------------------create Route------------
app.post("/listings",
validateListing,
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
    res.redirect("/listings");
//    wrapSync is used here for  better way to write a try catch block 
})
);

// --------------update route = edit & update route  -- Get And Put req --------------------------
// edit route
app.get("/listings/:id/edit" ,
    validateListing,
     wrapAsync(async(req,res)=>{
    // let {id} = req.params;
    // const listing =  await Listing.findById(id);  // listing findout
    // res.render("listings/edit.ejs",{ listing });
})
);

// update route
app.put("/listings/:id" ,wrapAsync(async(req,res)=>{
    let {id} = req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing}); // deconstruct the body
  res.redirect("/listings");
})
);


// --------------------delete route---------------
app.delete("/listings/:id",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);

//  to send standard response like routes doesnot match to any path then it send 404 not found
app.all("*", (req,res,next)=>{
  next(new ExpressError(404, "page not found")); // express error handle here 
}
)



//  to handle server side validation we have custom error handler  .
//  in server side validation when we pass data from server side in the form of api / postman/ hospscotch then may be the price should be in the string format 
//  so here it create an error

//  so we use middleware 
// app.use((err,req,res,next)=>{
//     //  expressError used here
//     let {statusCode = 500, message ="SomeThing went wrong"} = err;

//     res.status(statusCode).send(message)
// })

app.use((err, req, res, next) => {
     console.error("Error 💥:", err); // Log error
    let {statusCode = 500, message ="SomeThing went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message)
});
app.listen(8080,()=>{
    console.log("server is lstening to port :8080");
});