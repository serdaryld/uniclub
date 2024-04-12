import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"


export const getComments = (req,res)=>{

        const q = `SELECT c.*, u.id AS userID, name FROM comments AS c JOIN users AS u ON (u.id = c.userID)
        WHERE c.postID = ? ORDER BY c.date DESC`;
    
        db.query(q, [req.query.postID], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
}



export const addComment = (req,res)=>{

        const token = req.cookies.accessToken;
        if(!token) return res.status(401).json("not logged in")
    
        jwt.verify(token, "secretkey", (err, userInfo)=>{
            if(err) return res.status(403).json("token is not valid");
        
        
            const q = "INSERT INTO comments(`desc`,`date`,`userID`,`postID`) VALUES (?)";
    
            const values = [
                req.body.desc,
                moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                userInfo.id,
                req.body.postID
            ]
        
            db.query(q, [values], (err,data)=>{
                if(err) return res.status(500).json(err);
                return res.status(200).json("comment has been created");
            })
        })
     
        
}