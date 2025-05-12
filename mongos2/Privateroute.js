
import { Navigate, Outlet } from 'react-router-dom';

function Privateroute() {
    let auth = localStorage.getItem('users')
    return auth?<Outlet/>:<Navigate to="/signup"/>
  }
  
  export default Privateroute;