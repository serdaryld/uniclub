import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import ProfilePic from "../../assets/profilePic.png"
import { Link, useHistory  } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation,
  useQueryClient } from 'react-query'
import { makeRequest } from "../../axios";


const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState("");

  
  const { isLoading, error, data } = useQuery(["searchedClubs", searchInput],() =>
    makeRequest.get("/clubs/search?input="+searchInput).then((res) => res.data),
    { enabled: !!searchInput }
  );

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span><p>uni</p><p>club</p></span>
        </Link>

        <Link
            to={`/`}
            style={{ textDecoration: "none", color: "inherit" }}>
            <Tooltip title="Home">
              <HomeOutlinedIcon className="home-icon" />
            </Tooltip>
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} style={{cursor: "pointer"}}/>
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} style={{cursor: "pointer"}}/>
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." value={searchInput} 
          onChange={handleSearchInputChange} style={{ border: 'none', outline: 'none' }}/>
          </div>
          {searchInput && (
          <div className="search-results" >
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data?.length>0 ? (
              <>
                {data.map((club) => (
                   <Link
                   to={`/clubProfile/${club.id}`}  key={club.id}
                   style={{ textDecoration: "none", color: "inherit" }} onClick={()=>setSearchInput("")}>
                     <div className="item">
                       <img src={"/upload/"+club.profilePic} alt="" />
                       <span>{club.clubName}</span>
                     </div>
                   </Link>
                ))}
              </>
            ):"No match"}
          </div>
        )}

        
      </div>
      <div className="right">
        
        <Link to="/notifications" style={{ textDecoration: "none", color: "inherit"}}>
        <Tooltip title="Notifications">
        <NotificationsOutlinedIcon className="notifications-icon"/>
        </Tooltip>
        </Link>

        <PersonOutlinedIcon />
        <EmailOutlinedIcon />

        <Link
            to={`/profile/${currentUser.id}`}
            style={{ textDecoration: "none", color: "inherit" }}>
            <div className="user">
              <img
                src={ProfilePic}
                alt=""
              />
              <span style={{color: currentUser.id===1 ? "red": ""}} >{currentUser.name}</span>
            </div>
        </Link>
        <Link
            to={`/login`}
            style={{ textDecoration: "none", color: "inherit" }}>
            <Tooltip title="Logout">
              <LogoutIcon className="logout-icon" />
            </Tooltip>
        </Link>

      </div>
    </div>
  );
};

export default Navbar;
