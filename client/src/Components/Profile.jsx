import React, { useEffect, useState } from "react";
import "./css/Profile.css"
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [image, setImage] = useState(null);
    const [uploaded, setUploaded] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const logOut = (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    }

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(result => {
            if (!result.user) {
                console.log("Profile not found");
                localStorage.removeItem("token");
                navigate("/");
                return;
            }
            setEmail(result.user.email);
            setUsername(result.user.user);
            fetchImage(result.user.email);
        })
    }, [token, navigate]);
    
    const fetchImage = async (email) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/uploads/${email}`);
            if (!response.ok) throw new Error("Image not found");
            setUploaded(URL.createObjectURL(await response.blob()));
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }
    };
    

    const changeImage = (e) => {
        setImage(e.target.files[0]);
    }

    const handleUpload = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append("image", image);
        formData.append("email", email);
    
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload`, {
            method: "POST",
            body: formData,
        });
    
        const result = await response.json();
        console.log(result);
    };

    return (
        <div className="profile-container">
            <div className="information-container">
                <div className="account-information">
                    <h1> Profile Information</h1>
                    <img src={uploaded || "default_profile.png"} alt="Profile" width="100px" />
                    <button onClick={handleUpload}>Upload</button>
                    <input type="file" onChange={(e) => changeImage(e)} />
                    <p>Email: {email}</p>
                    <p>Username: {username}</p>
                </div>
                <button className="logout" onClick={logOut}> Log Out </button>
            </div>
        </div>
    )
}

export default Profile;