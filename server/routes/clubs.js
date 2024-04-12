import  express  from "express";
import { getClub, getAllClubs, addClub, updateClub, deleteClub, getEnrolledClubs, getClubsByManager, getClubsBySearch } from "../controllers/club.js";

const router = express.Router()

router.get("/find/:clubID", getClub)
router.get("/", getAllClubs)
router.get("/user/:userID", getEnrolledClubs)
router.get("/manager/:userID", getClubsByManager)
router.get("/search/", getClubsBySearch)
router.post("/", addClub)
router.put("/:clubID", updateClub);
router.delete("/:id", deleteClub)


export default router