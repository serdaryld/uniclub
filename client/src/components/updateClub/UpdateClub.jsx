import "./updateClub.scss";
import { useState } from "react";
import { useMutation, useQueryClient } from 'react-query';
import { makeRequest } from "../../axios";
import CloseIcon from '@mui/icons-material/Close';
import Input from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';




const UpdateClub = ({ setOpenUpdate, club }) => {
  
  const [profile, setProfile] = useState(null)
  const [texts, setTexts] = useState({
    name: club.clubName,
    description: club.description,
    email: club.email
  });

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = async (file)=> {
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData)
      return res.data
      
    } catch (err) {
      console.log(err)
    }
  }

  const queryClient = new useQueryClient();

  const mutation = useMutation((updatedClub) => {
    return makeRequest.put(`/clubs/${club.id}`, updatedClub);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['club']);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let profileUrl 

    profileUrl = profile ? await upload(profile) : club.profilePic
    mutation.mutate({ ...texts, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <> 
    <div className="overlay" />
    <div className="update">
      <h3>Update Club Information</h3>
      <form>
        {profile && <img className="file" alt="" src={URL.createObjectURL(profile)} />}
        <Input type="file"  onChange={e=>setProfile(e.target.files[0])}  />
        <Input type="text" name="name" onChange={handleChange} value={texts.name} />
        <Input type="text" name="description"  onChange={handleChange} value={texts.description} />
        <Input type="text" name="email" onChange={handleChange} value={texts.email} />
      </form>
      <button className="allow-button" onClick={handleClick}>Allow</button>
      <button className="close-button" onClick={() => setOpenUpdate(false)}><CloseIcon/></button>
    </div>
    </>
  );
};

export default UpdateClub;
