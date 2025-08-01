import { generateToken } from "../Lib/utils.js";
import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../Lib/cloudinary.js";

// ============================ SIGNUP ============================

export const signup = async (req, res) => {
  const { name, email, password, PhoneNumber, otp } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // ✅ EMAIL + PASSWORD SIGNUP
    if (email && password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      // ✅ Set JWT cookie
      generateToken(newUser._id, res);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        PhoneNumber: newUser.PhoneNumber,
        profilePic: newUser.profilePic,
      });
    }

    // ✅ PHONE + OTP SIGNUP
    if (PhoneNumber && otp) {
      const existingUser = await User.findOne({ PhoneNumber });
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      const newUser = new User({
        name,
        PhoneNumber,
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      });

      await newUser.save();

      // ✅ Set JWT cookie
      generateToken(newUser._id, res);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        PhoneNumber: newUser.PhoneNumber,
        profilePic: newUser.profilePic,
      });
    }

    // ❌ Missing required fields
    return res
      .status(400)
      .json({ message: "Either email/password OR phone/otp is required" });
  } catch (error) {
    console.log("Signup error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================ LOGIN ============================

export const login = async (req, res) => {
  const { email, password, PhoneNumber, otp } = req.body;

  try {
    // ✅ EMAIL + PASSWORD LOGIN
    if (email && password) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      generateToken(user._id, res);

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        PhoneNumber: user.PhoneNumber,
        profilePic: user.profilePic,
        message: "Login successful via email",
      });
    }

    // ✅ PHONE + OTP LOGIN
    if (PhoneNumber && otp) {
      const user = await User.findOne({ PhoneNumber });
      if (!user) {
        return res.status(400).json({ message: "Phone number not found" });
      }

      if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.otp = null;
      user.otpExpires = null;
      await user.save();

      generateToken(user._id, res);

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        PhoneNumber: user.PhoneNumber,
        profilePic: user.profilePic,
        message: "Login successful via phone",
      });
    }

    return res.status(400).json({
      message: "Please provide email & password or phone & OTP to login",
    });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============================ LOGOUT ============================

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // Clear the cookie
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============================ UPDATE PROFILE ============================


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password"); // ✅ Hide password in response

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Update profile error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============================ CHECK AUTH ============================

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Check auth error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
