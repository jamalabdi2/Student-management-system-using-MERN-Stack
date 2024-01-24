import React, {useState } from 'react'
import "./RegisterFormCss.css"
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import {toast } from 'react-toastify';
import { ClipLoader,BarLoader } from 'react-spinners';

function RegisterStudent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [studentData,setStudentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    role: ""
  })

  const handleChange = (e) =>{
    const { name, value, type} = e.target
  
    if (type === "radio") {
      setStudentData({...studentData,[name]:value})
    }else{
      setStudentData({...studentData,[name]:value
      })
    }
  }

  const handleSubmit =  async (e) =>{
    e.preventDefault()
    console.log("Student data after form submission")
    console.log(studentData)
    
    //send data to the server when submit event happens
    //use fetch api
    const REGISTER_STUDENT_URL = 'http://localhost:5890/api/v1/newStudent';
    try {
      setLoading(true)
      const response = await fetch(REGISTER_STUDENT_URL,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      })
      if(response.ok){
        console.log("registered successfully")
        const data = await response.json()
        console.log(data)
        // Show success toast
        toast.success('Registration successful!')
        navigate('/successPage')
      }else{
        try {
          console.log(response)
          const errorData = await response.json();
          console.log(errorData)
          toast.error(`${errorData.data}`);
        } catch (error) {
          console.error("Error parsing JSON from response", error);
          toast.error('Failed to register. Please try again.');
        } finally {
          setLoading(false)
        }
      }
  
    } catch (error) {
      console.error(error.message)
      
    }
    
  }
  

  
  

  return (
    <div className='container'>
        {loading && (
        <div className='spinner-overlay'>
          <BarLoader color='#123abc' loading={loading} height={4} width={150} />
          <p>Registering in progress...</p>
        </div>
      )}
        <h1>Student Account Registeration</h1>

        <div className='container-sm'>
          <form action="" className='registerForm' onSubmit={handleSubmit}>
            <div className="formElement">
              <label htmlFor="firstName" >First Name</label>
              <input type="text" name ="firstName" onChange={handleChange}/>
            </div>

            <div className="formElement">
              <label htmlFor="lastName" >Last Name</label>
              <input type="text" name ="lastName" onChange={handleChange}/>
            </div>

            <div className="formElement">
              <label htmlFor="email" >Email</label>
              <input type="email" name ="email" onChange={handleChange}/>
            </div>

            <div className="formElement">
              <label htmlFor="password" >Password</label>
              <input type="password" name ="password" onChange={handleChange}/>
            </div>

            <div className="formElement">
                <label htmlFor="gender">Gender</label>
                <div>
                  <input type="radio" name="gender" value="Male" onChange={handleChange}/>
                  <label htmlFor="genderMale">Male</label>
                </div>
                <div>
                  <input type="radio" name="gender" value="Female" />
                  <label htmlFor="genderFemale" onChange={handleChange}>Female</label>
                </div>
                <div>
                  <input type="radio" name="gender" value="Other" />
                  <label htmlFor="genderOther" onChange={handleChange}>Other</label>
                </div>
            </div>




            <div className="formElement">
              <label htmlFor="role" >Role</label>
              <select name="role" id="role" onChange={handleChange} value = {studentData.role} >
                <option value="">Choose your Role</option>
                <option value="student">Student</option>
                <option value="professor">Professor</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className='formElement'>
              <button className='btn' type='submit' disabled = {loading}>
                
                {loading ? <ClipLoader size={15} color={'#fff'} /> : 'Register'}
              </button>

            </div>

            
          </form>
        </div>

    </div>
  )
}

export default RegisterStudent