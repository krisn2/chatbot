const mongoose = require ("mongoose")

const agentSchema = new mongoose.Schema({
   projectId: {type: mongoose.Schema.Types.ObjectId, ref:"Project"},
   name:String,
   model:String,
   // Changed `settings` to `prompt` to be more specific and structured for LLM prompts
   prompt: {
        system: String, // The system message for the agent's behavior
        examples: [{
            role: String,
            content: String
        }]
   },
   createdAt: {type:Date, default:Date.now}
});
module.exports = mongoose.model("Agent", agentSchema);