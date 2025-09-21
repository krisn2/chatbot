const mongoose = require ("mongoose")

const agentSchema = new mongoose.Schema({
   projectId: {type: mongoose.Schema.Types.ObjectId, ref:"Project"},
   name:String,
   model:String,
   prompt: {
        system: String,
        examples: [{
            role: String,
            content: String
        }]
   },
   createdAt: {type:Date, default:Date.now}
});
module.exports = mongoose.model("Agent", agentSchema);