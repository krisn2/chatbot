const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
   projectId: {type: mongoose.Schema.Types.ObjectId, ref:"Project"},
   name:String,
   model:String,
   settings:Object,
   createdAt: {type:Date, default:Date.now}
});

export default mongoose.model("Agent", agentSchema);