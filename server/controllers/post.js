import { db } from "../connect.js"
import jwt from "jsonwebtoken"
import moment from "moment"


export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("token is not valid");

    let q;
    let values;

    
    if (req.query.clubID) {
      q = `SELECT p.*, clubName, profilePic FROM posts AS p 
           JOIN clubs AS c ON (c.id = p.clubID)
           WHERE p.clubID = ?
           ORDER BY p.date DESC`;

      values = [req.query.clubID]; 
    } else {
    
      if (req.query.filter === "enrolled") {
        q = `SELECT p.*, clubName, profilePic FROM posts AS p 
             JOIN clubs AS c ON (c.id = p.clubID)
             LEFT JOIN enrollments AS e ON (p.clubID = e.clubID) 
             WHERE e.userID=? AND c.isApproved=1
             ORDER BY p.date DESC`;

        values = [userInfo.id];
      } else if (req.query.filter === "all") {
        q = `SELECT p.*, clubName, profilePic FROM posts AS p 
             JOIN clubs AS c ON (c.id = p.clubID)
             WHERE c.isApproved=1
             ORDER BY p.date DESC`;

        values = [];
      } else {
        q = `SELECT p.*, clubName, profilePic FROM posts AS p 
             JOIN clubs AS c ON (c.id = p.clubID)
             WHERE p.isEvent=1  AND c.isApproved=1
             ORDER BY p.date DESC`;

        values = [];
      }
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};



export const addPost = (req,res)=>{

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("not logged in")

    jwt.verify(token, "secretkey", (err, userInfo)=>{
        if(err) return res.status(403).json("token is not valid");
    
    
        const q = "INSERT INTO posts (`desc`,`img`,`date`,`clubID`,`userID`,`isEvent`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            req.body.clubID,
            userInfo.id,
            req.body.isEvent,
        ]
    
        db.query(q, [values], (err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("post has been created");
        })
    })
 
}


export const deletePost = (req,res)=>{

  const token = req.cookies.accessToken;
  if(!token) return res.status(401).json("not logged in")

  jwt.verify(token, "secretkey", (err, userInfo)=>{
      if(err) return res.status(403).json("token is not valid");
  
  
      const q = "DELETE FROM posts WHERE `id`=? AND `userID`=? ";


      db.query(q, [req.params.id, userInfo.id], (err,data)=>{
          if(err) return res.status(500).json(err);
          if(data.affectedRows>0) return res.status(200).json("post has been deleted");
          return res.status(403).json("you can delete only your posts")
      })
  })

}