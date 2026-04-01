import User from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
// ==>>>🔴SIGN_UP🔴<<<=====
export const signUp = async(req , res) => {
try {
// extracting the name , email and pasword 
const {name , email , password}  = req.body;

if(!name || !email || !password){
    return res.status(400).json({message : "All fields are required"})
}
// check if user already exist 
  const existingUser  = await User.findOne({email});
  if(existingUser){
    return res.status(400).json({message : "This email is already exist"})
  }
  // Hash the password 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password , salt);

  // create the user , now 
  const user = await User.create({ // default role is user as we diclare in Model 
    name , 
    email,
    password : hashedPassword
  })
  // user is created send response 
  res.status(201).json({
    message : "User created successfully",
    user : {
    id : user.id ,
   name : user.name , 
    email : user.email , 
    role : user.role }
  })
}
catch (err){
    return res.status(500).json({err : err.message})
}
}


// ==>>>🔴LOG_IN🔴<<<=====
 
export const login = async(req,res) => {
    try {

    const {email , password} = req.body;
    // basic check 

    if(!email || !password){
        return res.status(400).json({message : "Email or password required"});
    }
    // check if this email exist or not 
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({message : "Invalid Credentials "})
    }
    const isMatch = await bcrypt.compare(password,user.password);
    // check password 
    if(!isMatch){
        return res.status(401).json({message : "password doesn't match"})
    }
    // Generate JsonWebToken
    const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const userPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    res.json({ token, user: userPayload });
} 
catch (error) { 
  console.log(`see this is mongo uri : ${process.env.MONGO_URI}`)

return res.status(500).json({error : error.message})    
}
}


