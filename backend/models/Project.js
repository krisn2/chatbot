const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    userId :{type: mongoose.Schema.Types.ObjectId, ref:"User"},
    name: String,
    description: String,
    createdAt: {type:Date, default: Date.now }
})

export default mongoose.model("Project", projectSchema);