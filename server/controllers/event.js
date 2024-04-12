import { db } from "../connect.js"
import jwt from "jsonwebtoken"

export const  getEvents = (req,res)=>{
    
    const q = "SELECT id, name FROM users WHERE id IN ( SELECT userID FROM events WHERE postID = ? )"


    db.query(q, [req.query.postID], (err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    })

}


export const addEvent = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("not logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("token is not valid");
    
    
        const q = "INSERT INTO events(`userID`,`postID`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.postID
        ]
    
        db.query(q, [values], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("joined");
        })
    })
    
}


export const deleteEvent = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("not logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("token is not valid");
    
    
        const q = "DELETE FROM events WHERE `userID` = ?  AND  `postID` = ? ";

    
        db.query(q, [userInfo.id, req.query.postID], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("event joining has been deleted");
        })
    })
 
    
}