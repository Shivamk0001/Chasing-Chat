import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
     PhoneNumber : {
        type: String,
        required: false,
        unique: true,
        sparse: true, 
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    profilePic: {
        type: String,
        default: "",
    },
},
{ timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
