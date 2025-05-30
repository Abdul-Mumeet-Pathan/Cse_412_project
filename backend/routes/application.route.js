import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
import multer from "multer";

const upload = multer({ dest: 'uploads/' }); // Configure as needed
const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, upload.single('cv'), applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;