import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e =>{ setInputs(prev=>({...prev, [e.target.name]:e.target.value}))}

  const handleClick = async e=>{
    e.preventDefault()

    if (!inputs.name || !inputs.email || !inputs.password) {
      setErr("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs)
      
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
    }
  }

  console.log(err)

  console.log(inputs);
  return (
    <div className="register">
      <span className="logo"><p>uni</p><p>club</p></span>
      <div className="card">
        <div className="left">

        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <Input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            <Input type="text" placeholder="Email" name="email" onChange={handleChange}/>
            <Input type={showPassword ? 'text' : 'password'} placeholder="Password" name="password" onChange={handleChange}
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
            {err && err}
            <button className="register-button" onClick={handleClick}>Register</button>
          </form>
             <div  className="to-login">
              <span>Already have an account?</span>
               <Link to="/login">
                <button>Login</button>
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
