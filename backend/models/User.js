const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    email: {type:String, unique: true},
    passwordHash: {type:String, required:true},
    Name: String,
    createdAt: {type:Date, default:Date.now}
});

export default mongoose.model("User", userSchema)