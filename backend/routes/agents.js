const express=  require ("express")
const Agent = require ("../models/Agent.js")
const {authMiddleware} = require ("../middleware/auth.js")

const router = express.Router();
router.post("/", authMiddleware, async (req,res) => {
    const {projectId, name, model, prompt} = req.body;
    const agent = new Agent({projectId, name, model, prompt});

    await agent.save();
    res.json(agent);
})

router.get("/:projectId", authMiddleware, async (req, res)=> {
    const agents = await Agent.find({projectId: req.params.projectId});
    if(!agents) return res.status(404).json({message: "not found"});
    res.json(agents)
})

module.exports = router
