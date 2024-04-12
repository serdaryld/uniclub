import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation,
  useQueryClient } from 'react-query'
import { makeRequest } from "../../axios";
import moment from "moment";
import ProfilePic from "../../assets/profilePic.png"
import { Link } from "react-router-dom";



const Comments = ({postID}) => {
  const [desc,setDesc] = useState("")
  const { currentUser } = useContext(AuthContext);
  
  const { isLoading, error, data } = useQuery(["comments"], ()=>
  makeRequest.get("/comments?postID=" + postID).then((res)=>{
   return res.data;
  })
 )
 
 const queryClient = new useQueryClient()

  const mutation = useMutation((newComment)=>{
    return makeRequest.post("/comments", newComment)

  }, {
    onSuccess: () => {
      
      queryClient.invalidateQueries(['comments'])
     
    },
  })

  const handleClick = async (e) =>{
    e.preventDefault()
    if (!desc) return
    mutation.mutate({desc, postID})
    setDesc("")

  }

  return (
    <div className="comments">
      <div className="write">
        <img src={ProfilePic} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={(e)=>setDesc(e.target.value)}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? "loading" : data.map((comment) => (
        <div className="comment" key={comment.id}>
          <Link to={`/profile/${comment.userID}`} style={{ textDecoration: "none", color: "inherit" }}>
            <img  src={ProfilePic} alt="" />
          </Link>
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.date).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
