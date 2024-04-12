import  express  from "express";
import { approveClub, approveEnrollment, getUnapprovedClubs, getUnapprovedEnrollments } from "../controllers/notification.js";

const router = express.Router()

router.get("/clubs/", getUnapprovedClubs)
router.put("/clubs/:clubID", approveClub)
router.get("/enrollments/", getUnapprovedEnrollments)
router.put("/enrollments/:enrollmentID", approveEnrollment)

export default router