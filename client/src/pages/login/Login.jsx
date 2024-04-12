import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()

  const handleChange = e =>{ setInputs(prev=>({...prev, [e.target.name]:e.target.value}))}

  
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault()
    try{
      await login(inputs);
      navigate("/")
    }catch(err){
      setErr(err.response.data)
    }
  };

  return (
    <div className="login">
      <span className="logo"><p>uni</p><p>club</p></span>
      <div className="card">
        <div className="left">

        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
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
            <button className="login-button" onClick={handleLogin}>Login</button>
          </form>
             <div  className="to-register">
              <span>Don't you have an account?</span>
               <Link to="/register">
                <button>Register</button>
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
