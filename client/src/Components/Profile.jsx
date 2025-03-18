import React, { useEffect, useState } from "react";
import "./css/Profile.css"
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const navigate = useNavigate();

    const logOut = (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    }

    useEffect( () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
            method:"GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
        }) .then( (res) => res.json() )
        .then( (result) => {
            if (!result.user) {
                console.log("Profile not found");
                return;
            }
            setEmail(result.user.email)
            setUsername(result.user.user)
        })
    }, []);

    return (
        <div className="profile-container">
            <div className="information-container">
                <div className="account-information">
                    <h1> Profile Information</h1>
                    <p>Email: {email}</p>
                    <p>Username: {username}</p>
                </div>
                <button className="logout" onClick={logOut}> Log Out </button>
            </div>
        </div>
        
    )
}

export default Profile;