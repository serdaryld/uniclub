import "./share.scss";
import PanoramaOutlinedIcon from '@mui/icons-material/PanoramaOutlined';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  useMutation,
  useQueryClient,
} from 'react-query'
import { makeRequest } from "../../axios";

const Share = ({clubID}) => {
  const [file,setFile] = useState(null)
  const [desc,setDesc] = useState("")
  const [isEvent, setIsEvent] = useState(false);

  const upload = async ()=> {
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData)
      return res.data
      
    } catch (err) {
      console.log(err)
      throw err;
    }
  }

  const {currentUser} = useContext(AuthContext)

  const queryClient = new useQueryClient()

  const mutation = useMutation((newPost)=>{
    return makeRequest.post("/posts",{ ...newPost, clubID })

  }, {
    onSuccess: () => {
      
      queryClient.invalidateQueries(['posts'])
     
    },
  })

  const handleClick = async (e) =>{
    e.preventDefault()
    if (!desc) return
    let imgUrl = "";
    if(file) imgUrl = await upload()
    mutation.mutate({desc, img: imgUrl, isEvent})
    setDesc("")
    setFile(null)
    setIsEvent(false)
  }

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            alt=""
          />
          <input type="text" placeholder={`Write something...`} onChange={e=>setDesc(e.target.value)} value={desc}/>
        </div>
        <div className="right">
          {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
        </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item">
                <PanoramaOutlinedIcon className="icon"/>
                <span>Add Image</span>
              </div>
            </label>
            
            <label htmlFor="isEvent" style={{ marginLeft: "10px" , cursor:"pointer"}}>
              <input type="checkbox" id="isEvent" onChange={() => setIsEvent(!isEvent)} checked={isEvent}  style={{cursor:"pointer"}}/>
              <span style={{fontSize: "small", color:"gray"}}> Event</span>
            </label>            
           
          </div>
          <div className="right">
            <button style={{padding: "10px 15px"}} onClick={handleClick}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
