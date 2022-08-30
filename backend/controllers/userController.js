const User=require("../models/userModel");
const bcrypt=require("bcrypt");
// const { json } = require("stream/consumers");


module.exports.login=async(req ,res,next)=>{
    try {
        const{username,password}=req.body;
        const user=await User.findOne({username})
        if(!user)
            return res.json({msg:"Incorrect Username"});
        const isPasswordvalid= await bcrypt.compare(password,user.password);
        if(!isPasswordvalid)
             return res.json({msg:"Incorrect Username or Password"})
        delete user.password
        return res.json({status:true,user})         
        
    } catch (error) {
        next(error)
        
    }
}

module.exports.register=async(req,res,next)=>{
    try {
        const{username,password,email}=req.body;
        const usernameCheck=await User.findOne({username})
        if(usernameCheck)
            return res.json({msg:"User Already Exists"})
        const emailCheck=await User.findOne({email})    
        if(emailCheck)
            return res.json({msg:"Email Already Exists"})
        const hashedPassword=await bcrypt.hash(password,15)  ;
        const user=await User.create({
            email,
            username,
            password:hashedPassword,
        }) 
         return res.json({status:true,user}) 

        
    } catch (error) {
        next(error)
        
    }

}

module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };
  
module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };

module.exports.logOut=(req,res,next)=>{
    try {
        if(!req.params.id) return res.json({msg:"User Id Must Required Or Must Login"})
        onlineUsers.delete(req.params.id);
        return res.status(200).send();

        
    } catch (error) {
        next(error)
        
    }
}