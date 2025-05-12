import { Link } from "react-router-dom"
import '../Style/style.css';
import { useNavigate } from "react-router-dom"
import logo from"../pics/36682.png"
function Nav2(){
    let auth = localStorage.getItem('users')
let navigate = useNavigate();
  let logout=()=>{
    localStorage.clear();
    navigate('/signup')
  }
    return(
<div>
  {auth?
<ul className="nav">
  <img className="img"src ={logo}alt ="logo"/>
<li><Link to="/">Products</Link></li>
<li><Link to ="/addproduct">  Add Products</Link></li>
<li><Link to ="/update">Update Products</Link></li>
<li><Link to = "/profile">Profile</Link></li>
<li><Link onClick ={logout} to="/logout">Logout{(JSON.parse(auth).fullname)}</Link></li>
</ul>
:<ul className="nav nav2">
<li><Link to = "/login">Login</Link></li>

<li><Link to="/signup">Sign Up</Link></li>
</ul>}
</div>
    );
}
export default Nav2;