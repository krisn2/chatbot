const express=  require ("express")
const Chat=  require ("../models/Chat.js")
const Agent = require ("../models/Agent.js")
const {authMiddleware} = require ("../middleware/auth.js")

const router = express.Router();
router.post("/:agentId",authMiddleware, async (req, res)=> {
    const {msg} = req.body;
    const agentId = req.params.agentId;

    const agent = await Agent.findById(agentId);
    if(!agent) return res.status(404).json({error: "Agent not found"});

    let chat = await Chat.findOne({agentId, userId:req.userId});
    if(!chat) chat = new Chat({agentId, userId:req.userId, messages: []});

    chat.messages.push({role:"user", content:msg});

    // Construct the messages array for the LLM API call
    const messagesForLLM = [];

    if (agent.prompt && agent.prompt.system) {
        messagesForLLM.push({role: "system", content: agent.prompt.system});
    }

    if (agent.prompt && agent.prompt.examples) {
        messagesForLLM.push(...agent.prompt.examples);
    }
    
    // Add the current chat history to the messages for the LLM
    messagesForLLM.push(...chat.messages.map(m => ({ role: m.role, content: m.content })));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: agent.model, 
          messages: messagesForLLM
        })
      });
    
      const data = await response.json();
      const agentReply = data.choices[0].message.content;
    
      chat.messages.push({ role: "agent", content: agentReply });
      await chat.save();
    
      res.json({ reply: agentReply, chat });
});
    
module.exports = router