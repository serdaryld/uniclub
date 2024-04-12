import { db } from "../connect.js"
import jwt from "jsonwebtoken"

export const  getLikes = (req,res)=>{
    
        const q = "SELECT userID FROM likes WHERE postID = ?";

    
        db.query(q, [req.query.postID], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json(data.map(like=>like.userID));
        })

}

export const addLike = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("not logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("token is not valid");
    
    
        const q = "INSERT INTO likes(`userID`,`postID`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.postID
        ]
    
        db.query(q, [values], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("post has been liked");
        })
    })
 
    
}


export const deleteLike = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("not logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("token is not valid");
    
    
        const q = "DELETE FROM likes WHERE `userID` = ?  AND  `postID` = ? ";

    
        db.query(q, [userInfo.id, req.query.postID], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("like has been deleted");
        })
    })
 
    
}