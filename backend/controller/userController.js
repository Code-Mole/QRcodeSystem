import userModel from "../model/user.js";
import AdminModel from "../model//adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser =async (req,res)=>{
  try {
     const { name, program, contact, accessCode } = req.body;

     // Basic validation
     if (!name || !program || !contact || !accessCode) {
       return res.status(400).json({ msg: "Please enter all fields" });
     }

     const newUser = await userModel({ name, program, contact, accessCode });
     newUser.save().then((user) => res.json(user));
}catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
const registerAdmin = async(req, res) => {
  try {
    const { name, email, password } = req.body; 
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
      // Check for existing admin
      const existingAdmin = await AdminModel.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ msg: "Admin already exist" });
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new AdminModel({ name, email, password: hashedPassword });
      await newAdmin.save();
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
    
}
const AdminLogin = async(req,res)=>{
  // Authenticate Admin
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Admin doesn`t exist" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: 3600  });
    res.json({
      token, admin:
      { id: admin._id, name: admin.name, email: admin.email }
    });
    // login user


  }catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

const getAllUsers = async(req,res)=>{
  //get all users
  try {
    const users =await userModel.find();
    res.json(users);

}catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
const getUserById = async (req,res)=>{
  //get user by id
  try {
    const user =await userModel.findById(req.params.id);
    res.json(user);

}catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

const updateUser =async (req,res)=>{
  //update user
  try {
    
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  }catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

const deleteUser =async (req,res)=>{
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  }catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }

}

export {
  registerUser,
  AdminLogin,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  registerAdmin,
};