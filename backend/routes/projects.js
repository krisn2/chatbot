const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const Project = require("../models/Project");
const validate = require("../middleware/validate")
const { z } = require("zod");



const ProjectSchema = z.object({
  name: z.string().min(1, "Project name required"),
  description: z.string()
});


router.post("/", authMiddleware, validate(ProjectSchema), async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = new Project({ userId: req.userId, name, description });
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.userId });
    if (!projects) return res.status(404).json({ error: "project not found" });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
