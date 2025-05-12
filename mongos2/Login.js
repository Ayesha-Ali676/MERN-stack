import { useState , useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import '../Style/style.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  let navigate = useNavigate();
  

  useEffect(() => {
    let auth = localStorage.getItem("users");
    if (auth) {
      navigate("/");
    }
  }, []);

  const btnClick = async () => {
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      console.log("Response:", data);
  
      if (data.success) {
        localStorage.setItem('users', JSON.stringify(data));
        navigate('/');
      } else {
        setErrorMessage("Invalid email or password!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Failed to connect to the server.");
    }
  
 
   };
  return (
    <>
        <div className="signup-container">
        <div className="signup-box">
        <input placeholder="Email Address" value={email}onChange={(e) => setEmail(e.target.value)} className="form_style" type="email" />
        <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form_style" type="password" />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type ="submit" onClick={btnClick}>login</button>
      </div>
      </div>
    </>
  );
}

export default Login;
