import "./profile.scss";
import Posts from "../../components/posts/Posts"
import ProfilePic from "../../assets/profilePic.png"
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";


const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false)

  const { currentUser } = useContext(AuthContext)

  const userID = parseInt(useLocation().pathname.split("/")[2])

  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get("/users/find/"+ userID).then((res) => { return res.data })
  );
  

  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOptionClick = (option) => {
    setOpenMenu(false);
    if (option === "update") {
      setOpenUpdate(true);
    } 
  };



  return (
    <div className="profile">
      {isLoading? ("loading") : (<> <div className="upper-profile">
        
        <img
          src={ProfilePic}
          alt=""
          className="profile-pic"
        />
        {currentUser.id === data.id ? 

            <div className="settings" onClick={() => setOpenMenu(!openMenu)}>
                    {openMenu &&
                      <Paper className="settings-menu">
                      <MenuList>
                        <MenuItem onClick={() => handleMenuOptionClick("update")}>Update</MenuItem>
                      </MenuList>
                      </Paper>
                    }
                      <SettingsIcon className="settings-icon" />
                    
                  </div> 
        
        : null}
      </div>
 
        <div className="u-info">
            <span>{data?.name}</span> 
            <p>{data.email}</p> 
        </div>
     
      </>)}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
