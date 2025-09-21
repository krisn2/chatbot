const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    agentId: {type:mongoose.Schema.Types.ObjectId, ref:"Agent"},
    userId :{type: mongoose.Schema.Types.ObjectId, ref:"User"},
    messages: [
        {
            role:String ,// "user" or agent
            content:String,
            timestamp: {type:Date,default:Date.now}
        }
    ],
    createdAt: {type: Date,default:Date.now}
})

export default mongoose.model("Chat", ChatSchema);