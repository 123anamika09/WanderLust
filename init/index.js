// all initialisation logic  of db
const mongoose =  require("mongoose");
const data = require("./data.js");
const Listing = require("../modals/listing.js");


const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(Mongo_url);
    
}

const initDB = async()=>{
   await Listing.deleteMany({});
   await Listing.insertMany(data.data);
   console.log("Data was initialised");

}
initDB();