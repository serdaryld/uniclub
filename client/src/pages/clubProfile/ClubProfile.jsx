import "./clubProfile.scss";
import CheckIcon from '@mui/icons-material/Check';
import GroupsIcon from '@mui/icons-material/Groups';
import Posts from "../../components/posts/Posts"
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { makeRequest } from "../../axios";
import { useLocation, useNavigate, Route } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import UpdateClub from "../../components/updateClub/UpdateClub";
import Share from "../../components/share/Share";
import UserList from "../../components/userList/UserList";

const ClubProfile = () => {

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [openUpdate, setOpenUpdate] = useState(false)
  const [listOpen, setListOpen] = useState(false)

  const { currentUser } = useContext(AuthContext)

  const clubID = parseInt(useLocation().pathname.split("/")[2])

  const { isLoading, error, data, refetch } = useQuery(["club"], () =>
    makeRequest.get("/clubs/find/"+ clubID).then((res) => { return res.data })
  );
  const { isLoading: eIsLoading,  data: enrollmentData, refetch: enrollmentsRefetch } = useQuery(["enrollment"], () =>
  makeRequest.get("/enrollments?clubID="+ clubID).then((res) => { return res.data })
);

const queryClient = new useQueryClient()

  const mutation = useMutation((enrolled)=>{
    if(enrolled) return makeRequest.delete("/enrollments?clubID="+ clubID)
    return makeRequest.post("/enrollments", { clubID })

  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollment'])
    },
  })

  const handleEnroll = () =>{
    mutation.mutate(enrollmentData.some(user => user.id === currentUser.id))
  }


  const deleteMutation = useMutation((clubID)=>{
    return makeRequest.delete("/clubs/" + clubID)

  }, {
    onSuccess: () => {
      
      queryClient.invalidateQueries(['clubs'])
     
    },
  })
  
  
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOptionClick = (option) => {
    setOpenMenu(false);
    if (option === "update") {
      setOpenUpdate(true);
    } else if (option === "delete") {
 
    }
  };


  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const handleConfirmationYes = () => {
    deleteMutation.mutate(clubID);
    navigate("/");
  };
  const handleConfirmationNo = () => {
    setOpenConfirmationDialog(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
    refetch();
    enrollmentsRefetch();
  }, [pathname,refetch,enrollmentsRefetch]); 



  return (
    <div className="profile">
      {isLoading? ("loading") : (<> <div className="upper-profile">
        
        <img
          src={"/upload/"+data?.profilePic}
          alt=""
          className="profile-pic"
        />
        {eIsLoading ? "loading" : (currentUser.id === data?.managerID || currentUser.id===1 ?
             (
                  <div className="settings" onClick={() => setOpenMenu(!openMenu)}>
                    {openMenu &&
                      <Paper className="settings-menu">
                      <MenuList>
                        <MenuItem onClick={() => handleMenuOptionClick("update")}>Update</MenuItem>
                        <MenuItem onClick={() => setOpenConfirmationDialog(true)}>Delete</MenuItem>
                      </MenuList>
                      </Paper>
                    }
                      <SettingsIcon className="settings-icon" />
                    
                  </div> 
             )
             : (<button onClick={handleEnroll} style={{ backgroundColor: enrollmentData.some(user => user.id === currentUser.id) ? "gray" : "" }} >
              {enrollmentData.some(user => user.id === currentUser.id) 
              ? (enrollmentData.find(user => user.id === currentUser.id)?.isApproved === 0 ? "Sent For Approval" : "Enrolled")
              : "Enroll"
            }</button>))}
      </div>
 
        <div className="c-info">
          
            <span>{data?.clubName}</span> 
            <p>{data?.description}</p> 
            <p style={{marginTop:"6px", color:"#666"}}>{data?.managerName}</p> 
            <p style={{marginTop:"6px", color:"#666"}}>{data?.email}</p> 
            <div className="club-count" onClick={currentUser.id === data?.managerID || currentUser.id===1 ? 
              (() => setListOpen(!listOpen)) : null}><GroupsIcon/> {enrollmentData?.filter(user => user.isApproved === 1).length} members</div>
            {data?.isApproved===0 && <p style={{marginTop:"10px", color:"red"}}>Unapproved</p>}
        </div>
        
      {currentUser.id === data?.managerID && <Share clubID={clubID}/>}

      <Posts clubID={clubID}/>
      </>)}
      {openUpdate && <UpdateClub setOpenUpdate={setOpenUpdate} club={data} />}
      {listOpen && <UserList setListOpen={setListOpen} users={enrollmentData.filter(user => user.isApproved === 1)} title={"Club Members"}/>}

      <Dialog open={openConfirmationDialog} onClose={handleConfirmationNo}>
        <DialogTitle>Deleting the club</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this club?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationNo} color="primary">No</Button>
          <Button onClick={handleConfirmationYes} color="primary" autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClubProfile;
