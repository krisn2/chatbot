
const express = require("express");
const Chat = require("../models/Chat");
const {authMiddleware} = require("../middleware/auth")


const router = express.Router();

router.post("/:agentId",authMiddleware, async (req, res)=> {
    const {msg} = req.body;

    const agentId = req.params.agentId;

    let chat = await Chat.findOne({agentId, userId:req.userId});
    if(!chat) chat = new Chat({agentId,userId:req.userId, messages: []});

    chat.messages.push({role:"user", content:msg});

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-guard-4-12b",
          messages: chat.messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
    
      const data = await response.json();
      const agentReply = data.choices[0].message.content;
    
      // Save agent reply
      chat.messages.push({ role: "agent", content: agentReply });
      await chat.save();
    
      res.json({ reply: agentReply, chat });
    });
    
    export default router;