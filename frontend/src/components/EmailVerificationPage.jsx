import React, { useState,useEffect } from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEnvelope} from "@fortawesome/free-solid-svg-icons"
import "./RegisterFormCss.css"
import {useParams, useNavigate} from "react-router-dom"

function EmailVerificationPage() {
  const navigate = useNavigate()
  const { id,token } = useParams
  const [verificationStatus, setVerificationStatus] = useState("pending")

  useEffect(() =>{
    
    const verifyEmail = async () =>{
      try {
        const response = await fetch(`http://localhost:5890/api/v1/student/verify/${id}/${token}`)
        const data = await response.json()
        console.log("___________ Response _______")
        console.log(response)
        console.log("___________ Data _______")
        console.log(data)

        //check if verification is successfull
        if (response.ok){
          setVerificationStatus("success")
          navigate('/loginStudent')
        } else {
          setVerificationStatus("error")
        }
      } catch (error) {
        console.error(error)
        console.error(error.message)
        setVerificationStatus("error")
      }
    }
    verifyEmail()


  },[id,token])
  return (
    <div className='verification'>

      {verificationStatus === 'pending' && (
        <>
          <p><FontAwesomeIcon icon={faEnvelope} size='3x'/></p>
          <h2>Check your mail</h2>
          <p>We've sent verification link to your email.</p>
          <p>Please verify your email to login</p>
        </>

      )}
      { verificationStatus === 'success' && (
          <>
              <p><FontAwesomeIcon icon={faEnvelope} size='3x' /></p>
              <h2>Email Verified</h2>
              <p>Your email has been successfully verified.</p>
              <p>You can now log in.</p>
          </>
      )}

      {verificationStatus === 'error' && (
          <>
              <p><FontAwesomeIcon icon={faEnvelope} size='3x' /></p>
              <h2>Verification Error</h2>
              <p>There was an error verifying your email.</p>
              <p>Please contact support for assistance.</p>
          </>
        )}

    </div>
  )
}

export default EmailVerificationPage