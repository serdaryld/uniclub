import  express  from "express";
import { getEnrollments, addEnrollment, deleteEnrollment } from "../controllers/enrollment.js";

const router = express.Router()

router.get("/", getEnrollments)
router.post("/", addEnrollment)
router.delete("/", deleteEnrollment)

export default router