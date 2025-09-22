const express=  require ("express")
const Agent = require ("../models/Agent.js")
const authMiddleware = require ("../middleware/auth.js")
const { z } = require("zod")
const validate = require("../middleware/validate.js")

const router = express.Router();

const PromptExample = z.object({
    role: z.string(),
    content: z.string()
});

const PromptSchema = z.object({
    system : z.string().optional(),
    examples : z.array(PromptExample).optional()
})


const CreateAgentSchema = z.object({
    projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid projectId"),
    name: z.string().min(1),
    model: z.string().optional(),
    prompt: PromptSchema.optional()
  });

const ParamsProjectSchema = z.object({
    projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid projectId")
  });

router.post("/", authMiddleware,validate(CreateAgentSchema) ,async (req,res) => {
    const {projectId, name, model, prompt} = req.body;
    const agent = new Agent({projectId, name, model, prompt});

    await agent.save();
    res.json(agent);
})

router.get("/:projectId", authMiddleware, validate(ParamsProjectSchema),async (req, res)=> {
    const agents = await Agent.find({projectId: req.params.projectId});
    if(!agents) return res.status(404).json({message: "not found"});
    res.json(agents)
})

module.exports = router
