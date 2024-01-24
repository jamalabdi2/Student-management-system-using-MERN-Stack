import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./RegisterFormCss.css"

function Homepage() {

  const navigate = useNavigate()
  const handleRegisterClick = () =>{
    navigate("/registerStudent")
    
  }
  return (
    <div className='homepage flex items-center flex-col'>
        <h1>Welcome to Student portal</h1>
        <button className='btn px-6 py-2' onClick={handleRegisterClick}>Register</button>
    </div>
  )
}

export default Homepage