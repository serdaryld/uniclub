import { db } from "../connect.js"
import jwt from "jsonwebtoken"

export const  getEnrollments = (req,res)=>{
    
        const q = "SELECT u.*, e.isApproved FROM users u JOIN enrollments e ON u.id = e.userID WHERE e.clubID = ?";

    
        db.query(q, [req.query.clubID], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
}


export const addEnrollment = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("not logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("token is not valid");
    
    
        const q = "INSERT INTO enrollments(`userID`,`clubID`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.clubID
        ]
    
        db.query(q, [values], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("following");
        })
    })
 
}


export const deleteEnrollment = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("not logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("token is not valid");
    
    
        const q = "DELETE FROM enrollments WHERE `userID` = ?  AND  `clubID` = ? ";

    
        db.query(q, [userInfo.id, req.query.clubID], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("unfollowed");
        })
    })
 
    
}