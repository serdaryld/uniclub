import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import UserList from "../userList/UserList";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEventJoined, setIsEventJoined] = useState(false); 
  const [listOpen, setListOpen] = useState(false)

  const {currentUser} = useContext(AuthContext)

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postID="+post.id).then((res) => { return res.data })
  );

  const eventJoinsQuery = useQuery(["events", post.id], () =>
  makeRequest.get("/events?postID=" + post.id).then((res) => res.data)
);


  const queryClient = new useQueryClient()

  const mutation = useMutation((liked)=>{
    if(liked) return makeRequest.delete("/likes?postID="+ post.id)
    return makeRequest.post("/likes", {postID: post.id})

  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['likes'])
    },
  })
  const deleteMutation = useMutation((postID)=>{
    return makeRequest.delete("/posts/" + postID)

  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
    },
  })

  const handleLike = () =>{
    mutation.mutate(data.includes(currentUser.id))
  }

  const joinEventMutation = useMutation((joined) => {

    if (joined) return makeRequest.delete("/events?postID=" + post.id)
    return makeRequest.post("/events", { postID: post.id })
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['events'])
    },
  });

  const handleJoinEvent = () => {
    joinEventMutation.mutate(eventJoinsQuery.data.some(user => user.id === currentUser.id));
  }

  const handleDelete = () =>{
    deleteMutation.mutate(post.id)
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <Link
                to={`/clubProfile/${post.clubID}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
            <img src={"/upload/"+post.profilePic} alt="" />
            </Link>
            
            <div className="details">
              <Link
                to={`/clubProfile/${post.clubID}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                  <span className="club-name">{post.clubName}</span>
              </Link>
              
              <span className="date">{moment(post.date).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon style={{cursor: "pointer",marginBottom:"20px"}} onClick={()=>setMenuOpen(!menuOpen)} />
          {(menuOpen && (post.userID===currentUser.id || currentUser.id===1)) && (<button onClick={handleDelete}><DeleteTwoToneIcon/><span>Delete</span></button>)}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/"+post.img} alt="" />
        </div>

        {post.isEvent ? ( 
              <div className="event">
                {eventJoinsQuery.isLoading ? "loading" : (eventJoinsQuery.data.some(user => user.id === currentUser.id) ? (
                  <button className="event-joined" onClick={handleJoinEvent}><CheckIcon fontSize="small" /> Joined</button>
                ) : (
                  <button onClick={handleJoinEvent}>Join</button>
                ))}
                
              </div>   
            ) : ""}
            
        <div className="info">
          <div className="item">
            {isLoading ? "loading" : data?.includes(currentUser.id) ? (<FavoriteOutlinedIcon style={{color:"red"}}  onClick={handleLike} />)
             : (<FavoriteBorderOutlinedIcon  onClick={handleLike} />)}
              {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
          {post.isEvent ? <div className="item"  onClick={post.userID===currentUser.id || currentUser.id===1 ? (() => setListOpen(!listOpen)) : null}>
            <GroupsIcon />
            {eventJoinsQuery.data?.length} People
          </div> : ""}
          
        </div>
        {commentOpen && <Comments postID={post.id} />}
        {listOpen && <UserList setListOpen={setListOpen} users={eventJoinsQuery.data} title={"Event Participations"}/>}
      </div>
    </div>
  );
};

export default Post;
