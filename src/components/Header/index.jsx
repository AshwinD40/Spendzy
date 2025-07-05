import React, { useEffect } from 'react'
import './style.css'
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { TbLogout } from "react-icons/tb";


function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate()

  useEffect(() => {
    if(user){
      navigate("/dashboard")
    }
  }, [user, loading, navigate])
  

  async function logoutFunc(){

    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");

    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  }
  

  return (
    <div className="navbar">
      <p className="logo"> Spendzy </p>
      {user && (
        <div className='right'>
          {user.photoURL ? (
            <img 
              src={user.photoURL}
              alt=""
              className='profile-image'
            />
          ) : (
            <div className='profile-icon'>
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <p className='logout' onClick={logoutFunc}><TbLogout size={25} /></p>
        </div>
      )}
      
     
    </div>
  )
}

export default Header