import "./userList.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProfilePic from "../../assets/profilePic.png"
import CloseIcon from '@mui/icons-material/Close';

const UserList = ({ setListOpen, users, title }) => {
  
  return (

    <div className="user-list">
      <div className="header">
        <span>{title}</span>
        <CloseIcon className="close-icon" onClick={() => setListOpen(false)} />
      </div>
      <div className="user-list-content">
        {users.length>0 ? (users.map((user) => (
          <Link  to={`/profile/${user.id}`}  style={{ textDecoration: "none", color: "inherit" }} key={user.id}>
            <div className="user-item">
              <img src={ProfilePic} alt="" />
              <span>{user.name}</span>
            </div>
          </Link>
        ))) : <p style={{color:"gray"}}> There is no user</p>}
      </div>
    </div>
  );
};

export default UserList;
