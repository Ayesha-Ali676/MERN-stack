import { useState , } from 'react';
import { useNavigate } from "react-router-dom";
import '../Style/style.css';

function Signup() {
  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const[error, setError] = useState(false);

  let navigate = useNavigate();

   const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/^[A-Z]/.test(password)) {
      return "Password must start with a capital letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
  
    return ""; 
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

   
    const error = validatePassword(newPassword);
    setErrorMessage(error); 
  };

  const click = async () => {
    console.log(fullname,email, password)
   
    if (!fullname|| !email|| !password){
      setError(true);
      return false;
    }
 
    let res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, password })
    });
    res = await res.json();
    console.log(res);
    localStorage.setItem("users", JSON.stringify(res));
    navigate("/");
  };
 
   
  return (
    <>
       <div className="signup-container">
       <div className="signup-box">
        <input placeholder="Full Name"value={fullname} onChange={(e) => setName(e.target.value)} className="form_style" type="text" />
        <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="form_style" type="email" />
        <input placeholder="Password" value={password} onChange={handlePasswordChange} className="form_style" type="password" />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {error && <span style={{ color: 'red' }}>All Feilds are required</span>}
        <button type ="button" onClick={click}>Sign up</button>
      </div>
      </div>
    </>
  );
};

export default Signup;