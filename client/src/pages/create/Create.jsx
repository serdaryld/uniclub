import "./create.scss";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  useMutation,
  useQueryClient,
} from 'react-query'
import { makeRequest } from "../../axios";
import TextField from '@mui/material/TextField';

const Create = () => {
  const [file,setFile] = useState(null)
  const [desc,setDesc] = useState("")
  const [email,setEmail] = useState("")
  const [name,setName] = useState("")
  const [err, setErr] = useState(null);


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

  const mutation = useMutation((newClub)=>{
    return makeRequest.post("/clubs",{ ...newClub })

  }, {
    onSuccess: () => {
      
      queryClient.invalidateQueries(['clubs'])
     
    },
  })

  const handleClick = async (e) =>{
    e.preventDefault()
    if (!name || !email || !desc ) {
      setErr("Please fill in all required fields.");
      return;
    }
    let imgUrl = "";
    if(file) imgUrl = await upload()
    mutation.mutate({name, desc, email, img: imgUrl})
    setName("")
    setDesc("")
    setEmail("")
    setFile(null)

  }

  return (
    <div className="create">
      <div className="file-container">
      <img className="file" alt="" src={file ? URL.createObjectURL(file) : "https://t4.ftcdn.net/jpg/02/01/10/87/360_F_201108775_UMAoFXBAsSKNcr53Ip5CTSy52Ajuk1E4.jpg"} />
       
        
      </div>
      <div className="input-container">
        <input  type="file" onChange={e => setFile(e.target.files[0])} />
        <TextField className="text-field" label="Name" multiline rows={1}  onChange={e => setName(e.target.value)} value={name} />
        <TextField className="text-field" label="Description"  multiline rows={3} variant="outlined" onChange={e => setDesc(e.target.value)} value={desc} />
        <TextField className="text-field" label="Email" multiline rows={1} onChange={e => setEmail(e.target.value)} value={email}/>
        {err && err}
      </div>
      <button onClick={handleClick}>{currentUser.id===1 ? "Create":"Send For Approval"}</button>
    </div>
    
  );
};

export default Create;
