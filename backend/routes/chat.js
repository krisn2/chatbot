const express = require("express");
const Chat = require("../models/Chat.js");
const Agent = require("../models/Agent.js");
const authMiddleware = require("../middleware/auth.js");

const Groq = require("groq-sdk");

const router = express.Router();

// Send a message to an agent and get AI response
router.post("/:agentId", authMiddleware, async (req, res) => {
    try {
        const { msg } = req.body;
        const agentId = req.params.agentId;

        if (!msg) return res.status(400).json({ error: "Message required" });

        const agent = await Agent.findById(agentId);
        if (!agent) return res.status(404).json({ error: "Agent not found" });

        // find or create chat
        let chat = await Chat.findOne({ agentId, userId: req.userId });
        if (!chat) chat = new Chat({ agentId, userId: req.userId, messages: [] });

        // push user message
        chat.messages.push({ role: "user", content: msg });

        // construct LLM messages
        const messagesForLLM = [];

        if (agent.prompt && agent.prompt.system) {
            messagesForLLM.push({ role: "system", content: agent.prompt.system });
        }

        if (agent.prompt && agent.prompt.examples) {
            const examples = agent.prompt.examples.map((e) => ({
                role: e.role === "agent" ? "assistant" : e.role, // normalize roles
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

        console.log("Groq API response:", JSON.stringify(chatCompletion, null, 2));

        if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
            return res.status(500).json({
                error: "No response from Groq",
                details: chatCompletion
            });
        }

        // extract assistant reply
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