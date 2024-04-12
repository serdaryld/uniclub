import { db } from "../connect.js"
import jwt from "jsonwebtoken"

export const getClub = (req,res)=>{
    
    const clubID = req.params.clubID
    const q = `SELECT c.*, m.userID AS managerID, u.name AS managerName
               FROM clubs c 
               JOIN managers m ON (c.id = m.clubID) 
               JOIN users u ON (m.userID = u.id)
               WHERE c.id=? `

    db.query(q, [clubID], (err,data)=>{
        if(err) return res.status(500).json(err)
        return res.json(data[0]);
    })

}

export const getAllClubs = (req,res)=>{
    
  const q = `SELECT * FROM clubs WHERE isApproved=1 ORDER BY clubName`;

  db.query(q, (err,data)=>{
      if(err) return res.status(500).json(err)
      return res.json(data);
  })

}

export const getEnrolledClubs = (req, res) => {
  const userID = req.params.userID;
  const q = `SELECT c.* FROM clubs AS c 
             JOIN enrollments AS e ON (c.id = e.clubID) 
             WHERE e.userID = ? AND e.isApproved=1 AND c.isApproved=1  
             ORDER BY c.clubName`;
  
  db.query(q, [userID], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
  });
};


export const getClubsBySearch = (req, res) => {
  const q = "SELECT * FROM clubs WHERE isApproved=1 AND clubName LIKE ? ORDER BY clubName";

  db.query(q, [`${req.query.input}%`], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const updateClub = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not authenticated");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("token is not valid");
  
      const { name, description, email, profilePic } = req.body;
      const clubID = req.params.clubID;
  
      const q = "UPDATE clubs SET `clubName`=?, `description`=?, `email`=?, `profilePic`=? WHERE id=?";
  
      db.query(q, [name, description, email, profilePic, clubID], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("updated");
        return res.status(403).json("you can only update your club");
      });
    });
  };



export const addClub = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not authenticated");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("token is not valid");

      let q;
      if(userInfo.id===1){
        q = "INSERT INTO clubs (`clubName`, `description`, `email`, `profilePic`, `isApproved`) VALUES (?,1)";
      } else {
        q = "INSERT INTO clubs (`clubName`, `description`, `email`, `profilePic`) VALUES (?)";
      }

      const values = [
        req.body.name,
        req.body.desc,
        req.body.email,
        req.body.img,
        ];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        
        const getLastClubQuery = "SELECT id FROM clubs ORDER BY id DESC LIMIT 1";
        db.query(getLastClubQuery, (err, result) => {
          if (err) return res.status(500).json(err);
  
          const clubID = result[0].id;
  
     
          const createManagerQuery = "INSERT INTO managers (`userID`, `clubID`) VALUES (?, ?)";
          const managerValues = [userInfo.id, clubID];
          
          db.query(createManagerQuery, managerValues, (err, data) => {
            if (err) return res.status(500).json(err);
  
          const createEnrollmentQuery = "INSERT INTO enrollments (`userID`, `clubID`, `isApproved`) VALUES (?, ?, 1)";
          const enrollmentValues = [userInfo.id, clubID];

          db.query(createEnrollmentQuery, enrollmentValues, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.json("Club created successfully and user enrolled");
          });
        });
      });
    });
  });
};


export const getClubsByManager = (req, res) => {
    const userID = req.params.userID;
    const q = "SELECT clubs.* FROM clubs JOIN managers ON clubs.id = managers.clubID WHERE managers.userID = ?";
    
    db.query(q, [userID], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};



export const deleteClub = (req,res)=>{
  const token = req.cookies.accessToken;
  if(!token) return res.status(401).json("not logged in")

  jwt.verify(token, "secretkey", (err, userInfo)=>{
      if(err) return res.status(403).json("token is not valid");
  
      const q = "DELETE FROM clubs WHERE `id`=?  ";

      db.query(q, [req.params.id], (err,data)=>{
          if(err) return res.status(500).json(err);
          if(data.affectedRows>0) return res.status(200).json("post has been deleted");
          return res.status(403).json("you can delete only your posts")
      })
  })

  
}