import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function LoginStudent() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the post request to the server
    try {
      const LOGIN_URL = 'http://localhost:5890/api/v1/student/login';
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful');
        console.log(data);
        toast.success(`${data.message}`);
        
        navigate(`/student/${data.data}`);
      } else {
        const errorData = await response.json();
        console.error(errorData);
        toast.error(`Failed to login: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to login. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h1>Student Account Login</h1>

      <div className='container-sm'>
        <form action="" className='loginForm' onSubmit={handleSubmit}>
          <div className='formElement'>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' onChange={handleChange} />
          </div>

          <div className='formElement'>
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' onChange={handleChange} />
          </div>

          <div className='formElement'>
            <button className='btn' type='submit'>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginStudent;
