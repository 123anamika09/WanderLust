//  utils are for utility here extra things were added like wrapAsync , form validation error  & many more 
module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};