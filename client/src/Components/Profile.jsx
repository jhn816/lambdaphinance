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

    const changeImage = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!image) {
            console.error("No image selected");
            return;
        }
    
        if (!email) {
            console.error("Email is missing before upload");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", image);
        formData.append("email", email);
    
        console.log("Uploading for email:", email);  // Debugging line
        console.log("form", formData.get("email"));
    
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/upload?email=${encodeURIComponent(email)}`,
                {
                  method: "POST",
                  body: formData,
                }
              );
              
    
            const result = await res.json();
            console.log("Upload result:", result);
    
            if (result.imageUrl) {
                setUploaded(result.imageUrl);
            } else {
                console.error("Upload failed:", result);
            }
        } catch (error) {
            console.error("Error during upload:", error);
        }
    };
    
    

    useEffect(() => {
        console.log(process.env.REACT_APP_API_BASE_URL);
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
                localStorage.removeItem("token");
                navigate("/");
                return;
            }  
            setEmail(result.user.email);
            setUsername(result.user.user);
            setUploaded(result.imageUrl);
        })
        .catch(error => console.error("Error fetching profile:", error));
    }, [token, navigate]);

    return (
        <div className="profile-container">
            <div className="information-container">
                <div className="account-information">
                    <h1> Profile Information</h1>
                    <img src={uploaded} alt="Profile" width="150" />
                    <button onClick={handleUpload}>Upload</button>
                    <input type="file" onChange={changeImage} />

                    <p>Email: {email}</p>
                    <p>Username: {username}</p>
                </div>
                <button className="logout" onClick={logOut}> Log Out </button>
            </div>
        </div>
    )
}

export default Profile;