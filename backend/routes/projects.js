const router = require("express").Router();
const {authMiddleware} = require("../middleware/auth")
const Project = require("../models/Project");

router.post("/",authMiddleware, async (req,res)=> {
    const {name, description} = req.body;

    const project = new Project({userId: req.userId, name, description});
    await project.save();

    res.json(project);

})


router.get("/", authMiddleware,async (req,res,next) => {
    const projects = await Project.find({userId: req.userId});
    if(! projects) return res.status(404).json({error : "project not found"});

    res.json(projects);
})


export default router;