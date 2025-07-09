const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ // kisi v chiz ko configure krne ka mtlb hota h cheejo ko jorna // backend ko cloud k saath jorne k liyw wo-wo information chahiye hoga jo.env dile me h
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})
//  apne liye storage ko define krenge
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"] // supports promises as well
  },
});
//  2 chiz ko export regii 
module.exports={
  cloudinary,
  storage
}