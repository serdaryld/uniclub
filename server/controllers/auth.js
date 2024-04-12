import { db } from "../connect.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req,res)=>{

    const q = "SELECT * FROM users WHERE email = ?"

    db.query(q,[req.body.email], (err,data)=>{
        if(err) return res.status(500).json(err)
        if(data.length) return res.status(409).json("User already exist")

        const q = "INSERT INTO users (`name`,`email`,`password`) VALUE (?)"

        const values = [req.body.name,req.body.email,req.body.password]
        db.query(q,[values], (err,data)=>{
            if(err) return res.status(500).json(err)
            return res.status(200).json("User has been created")

        })
    })
    


}
export const login = (req,res)=>{
    const q = "SELECT * FROM users WHERE email = ?"
    db.query(q,[req.body.email], (err,data)=>{
        if(err) return res.status(500).json(err)
        if(data.length===0) return res.status(404).json("User not found")

        if(req.body.password!=data[0].password) return res.status(400).json("Wrong email or password")
        const token = jwt.sign({id:data[0].id},"secretkey")
        const {password, ...others} = data[0]
        res.cookie("accessToken", token,{
            httpOnly: true,
        }).status(200).json(others)
    })
}

export const logout = (req,res)=>{
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User has been logged out")
    
}
