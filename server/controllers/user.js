import { db } from "../connect.js"
import jwt from "jsonwebtoken"

export const getUser = (req,res)=>{
    
    const userID = req.params.userID
    const q = "SELECT * FROM users WHERE id=?"

    db.query(q, [userID], (err,data)=>{
        if(err) return res.status(500).json(err)
        
        return res.json(data[0]);
    })

}


export const updateUser = (req,res)=>{
    
    const token = req.cookies.accessToken
    if(!token) return res.status(401).json("not authenticated")

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("token is not valid")


        const q = "UPDATE users SET `name`=?, `email`=?, `password`=?  WHERE id=? "

        db.query(q, [req.body.name, req.body.email, req.body.password, userInfo.id], (err,data)=>{
            if(err) res.status(500).json(err)
            if(data.affectedRows > 0 ) return res.json("updated")
            return res.status(403).json("you can only update your profile")
        } )
    })

}