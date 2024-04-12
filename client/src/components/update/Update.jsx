import "./update.scss" 
import { useState } from "react"
import { useMutation, useQueryClient} from 'react-query'
import { makeRequest } from "../../axios";
import CloseIcon from '@mui/icons-material/Close';
import Input from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Update = ({setOpenUpdate, user }) => {

    const [texts, setTexts] = useState({
        name: user.name,
        email: user.email,
        password: user.password,
    })

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setTexts((prev) => ({...prev, [e.target.name]: [e.target.value] }))
    }

    const queryClient = new useQueryClient()

    const mutation = useMutation((user)=>{
      return makeRequest.put("/users",user)
  
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['user'])
      },
    })
  
    const handleClick = async (e) =>{
      e.preventDefault()

      mutation.mutate({...texts})
      setOpenUpdate(false)
    }
  

    return(
      <>
        <div className="overlay" />
        <div className="update">
          <h3>Update User Information</h3>
          <form>
              <Input type="text" name="name" onChange={handleChange} value={texts.name}/>
              <Input type="text" name="email" onChange={handleChange} value={texts.email}/>
              <Input type={showPassword ? 'text' : 'password'} name="password" onChange={handleChange} value={texts.password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton 
                    aria-label="toggle password visibility"
                    onClick={()=>setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff style={{color:"lightgray"}}/> : <Visibility style={{color:"lightgray"}}/>}
                  </IconButton>
                </InputAdornment>
              }
              
              />
          </form>
          <button className="allow-button" onClick={handleClick}>Allow</button>
          <button className="close-button" onClick={()=>setOpenUpdate(false)} ><CloseIcon/></button>
        </div>
      </>
    )

}

export default Update