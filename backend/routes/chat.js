const express = require("express");
const Chat = require("../models/Chat.js");
const Agent = require("../models/Agent.js");
const authMiddleware = require("../middleware/auth.js");
const { z } = require("zod")
const validate = require("../middleware/validate.js")

const Groq = require("groq-sdk");

const router = express.Router();


const ParamsAgentSchema  =  z.object({
    agentId : z.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid agentId")
})

const ChatBodySchema = z.object({
    msg : z.string().min(1, "Message required")
})

// Send a message to an agent and get AI response
router.post("/:agentId", authMiddleware, validate(ParamsAgentSchema, "params"), validate( ChatBodySchema ), async (req, res) => {
    try {
        const { msg } = req.body;
        const agentId = req.params.agentId;

        const agent = await Agent.findById(agentId);
        if (!agent) return res.status(404).json({ error: "Agent not found" });

        let chat = await Chat.findOne({ agentId, userId: req.userId });
        if (!chat) chat = new Chat({ agentId, userId: req.userId, messages: [] });

        chat.messages.push({ role: "user", content: msg });

        const messagesForLLM = [];

        if (agent.prompt && agent.prompt.system) {
            messagesForLLM.push({ role: "system", content: agent.prompt.system });
        }

        if (agent.prompt && agent.prompt.examples) {
            const examples = agent.prompt.examples.map((e) => ({
                role: e.role === "agent" ? "assistant" : e.role, 
                content: e.content,
            }));
            messagesForLLM.push(...examples);
        }

        // add chat history, mapping "agent" -> "assistant"
        messagesForLLM.push(
            ...chat.messages.map((m) => ({
                role: m.role === "agent" ? "assistant" : m.role,
                content: m.content,
            }))
        );

        const client = new Groq({
            apiKey: process.env['GROQ_API'],
        });

        const params = {
            messages: messagesForLLM,
            model: 'openai/gpt-oss-20b', 
        };

        const chatCompletion = await client.chat.completions.create(params);

        // console.log("Groq API response:", JSON.stringify(chatCompletion, null, 2));

        if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
            return res.status(500).json({
                error: "No response from Groq",
                details: chatCompletion
            });
        }

        const agentReply =
            chatCompletion.choices[0].message?.content ||
            chatCompletion.choices[0].text ||
            "No reply from model";

        // save reply to chat
        chat.messages.push({ role: "agent", content: agentReply });
        await chat.save();

        res.json({ reply: agentReply, chat });
    } catch (err) {
        console.error("chat error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;