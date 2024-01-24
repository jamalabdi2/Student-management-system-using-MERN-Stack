import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserDashboard() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const URL = `http://localhost:5890/api/v1/student/${userId}`;
        const response = await fetch(URL);

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUserData(data.data.student); // Update this line based on the actual structure
        } else {
          console.error('Error retrieving user info');
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div>
      {loading && <p>Loading user data...</p>}

      {userData && (
        <>
        <h1>Welcome {userData.firstName} {userData.lastName}</h1>
          <h3>User Information:</h3>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>Email: {userData.email}</p>
          
        </>
      )}
    </div>
  );
}

export default UserDashboard;
