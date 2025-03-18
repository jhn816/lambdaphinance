import React, { useEffect, useState } from "react";
// import "./css/Profile.css"
import { Link } from "react-router-dom";

const Profile = () => {
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");


    useEffect( () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
            method:"GET",
            header: {
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
            setUsername(result.user.username)
        })
    });

    return (
        <div>
            <p>{email}</p>
            <p>{username}</p>
        </div>
        
    )
}

export default Profile;