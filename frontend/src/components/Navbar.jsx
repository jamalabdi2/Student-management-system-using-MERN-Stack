import {Link} from "react-router-dom"
import "./NavbarCss.css"
import React from 'react'

function Navbar() {
  return (
    <nav className="nav">
        <ul className="nav-link">
            <li className="nav-link-item">
                <Link to={"/"}>Home</Link>
            </li>
            <li className="nav-link-item">
                <Link to={"/registerStudent"}>Register</Link>
            </li>
            <li className="nav-link-item">
                <Link to={"/loginStudent"}>Login</Link>
            </li>
        </ul>
        <div>
            <p>Hey</p>
        </div>
    </nav>
  )
}

export default Navbar