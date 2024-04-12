import "./leftBar.scss";
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ProfilePic from "../../assets/profilePic.png"
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";
import { useQuery, useMutation,
  useQueryClient } from 'react-query'
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["managingClubs", currentUser.id], ()=>
  makeRequest.get(`/clubs/manager/${currentUser.id}`).then((res) => res.data)
 )


  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <div className="left-bar">
      <div className="container">
        <div className="menu">
        <Link
            to={`/profile/${currentUser.id}`}
            style={{ textDecoration: "none", color: "inherit" }}>
            <div className="user">
              <img
                src={ProfilePic}
                alt=""
              />
              <span style={{color: currentUser.id===1 ? "red": ""}}>{currentUser.name}</span>
            </div>
          </Link>
          
        </div>
        <hr />
        
        {data && data.length > 0 && (
        <div className="menu">
          <span>Your clubs</span>
          {data.map((club) => (
            <Link
            to={`/clubProfile/${club.id}`}  key={club.id}
            style={{ textDecoration: "none", color: "inherit" }}>
              <div className="item">
                <img src={"/upload/"+club.profilePic} alt="" />
                <span>{club.clubName}</span>
              </div>
            </Link>
          ))}
          <hr/>
        </div>
        )}

        
        <div className="menu">
          <div className="item">
            <Link to={`/create`} className="link-button" ><AddIcon/> Create a club</Link>
          </div>
        </div>
      </div>
      
        <div className="scroll-to-top" onClick={scrollTop}>
          <ArrowUpwardIcon />
        </div>
      
    </div>
  );
};

export default LeftBar;
