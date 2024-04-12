import { db } from "../connect.js"
import jwt from "jsonwebtoken"


export const getUnapprovedClubs = (req, res) => {

    const q = "SELECT * FROM clubs WHERE isApproved = 0 ORDER BY id DESC ";
    
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};


export const approveClub = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not authenticated");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("token is not valid");
  
      const clubID = req.params.clubID;
  
      const q = "UPDATE clubs SET `isApproved`=?  WHERE id=?";
  
      db.query(q, [req.body.isApproved ,clubID], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("approved");
        return res.status(403).json("error occured");
      });
    });
  };




export const getUnapprovedEnrollments = (req, res) => {
  const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not authenticated");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("token is not valid");

    const q = `SELECT e.*, c.clubName AS clubName, u.name AS userName
    FROM enrollments e
    JOIN managers m ON e.clubID = m.clubID
    JOIN clubs c ON e.clubID = c.id
    JOIN users u ON e.userID = u.id 
    WHERE m.userID = ? AND e.isApproved = 0
    ORDER BY e.id DESC`;
    
    db.query(q, userInfo.id,(err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
  })
};




export const approveEnrollment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("not authenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("token is not valid");

    const enrollmentID = req.params.enrollmentID;

    const q = "UPDATE enrollments SET `isApproved`=?  WHERE id=?";

    db.query(q, [req.body.isApproved ,enrollmentID], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("approved");
      return res.status(403).json("error occured");
    });
  });
};
