const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const Project = require("../models/Project");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const validate = require("../middleware/validate")

const { z } = require("zod");

const ProjectSchema = z.object({
  name: z.string().min(1, "Project name required"),
  description: z.string()
});

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
const upload = multer({ storage });

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

router.post("/:projectId/files", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileMeta = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size
    };

    project.files = project.files || [];
    project.files.push(fileMeta);
    await project.save();

    res.json({ message: "File uploaded", file: fileMeta, projectId: project._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
