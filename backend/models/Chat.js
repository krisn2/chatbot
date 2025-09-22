const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    agentId: {type:mongoose.Schema.Types.ObjectId, ref:"Agent"},
    userId :{type: mongoose.Schema.Types.ObjectId, ref:"User"},
    messages: [
        {
            role:String ,
            content:String,
            timestamp: {type:Date,default:Date.now}
        }
    ],
    createdAt: {type: Date,default:Date.now}
})

module.exports = mongoose.model("Chat", ChatSchema);