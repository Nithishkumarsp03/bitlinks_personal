const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save files with a unique name
  },
});
const upload = multer({ storage: storage });

// Route for uploading a single file
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ path: `/uploads/${req.file.filename}` });
});

// Route for uploading multiple files (history)
router.post("/upload/history", upload.array("files", 2), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const paths = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ paths });
});

module.exports = router;

/**
 * @swagger
 * /upload/history:
 *   post:
 *     summary: Uploads user Files
 *     description: Uploads multiple user files for historical purposes.
 *     tags:
 *       - Connection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 example: [file1.png, file2.jpg] # Provide file names for example
 *     responses:
 *       200:
 *         description: Successfully uploaded files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paths:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["/uploads/file1.png", "/uploads/file2.jpg"]
 *       400:
 *         description: No files uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No files uploaded"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Database error"
 */
