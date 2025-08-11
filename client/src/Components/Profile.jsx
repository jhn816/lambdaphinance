import React, { useEffect, useState } from "react";
import "./css/Profile.css"
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [image, setImage] = useState(null);
    const [uploaded, setUploaded] = useState(null);
    const [savedImage, setSavedImage] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const logOut = (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    }

    const changeImage = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!image) {
            alert("No image selected");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", image);
        formData.append("email", email);
    
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/upload?email=${encodeURIComponent(email)}`,
                {
                  method: "POST",
                  body: formData,
                }
              );
            const result = await res.json();
            setUploaded(result.imageUrl);
            imageAppear();
        } catch (error) {
            console.error("Error during upload:", error);
        }
    };

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
            if (result.error === "jwt verify" || !result.user) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }  
            setEmail(result.user.email);
            setUsername(result.user.username);
            setUploaded(result.imageUrl);
        })
        .catch(error => console.error("Error fetching profile:", error));
    }, [token, navigate]);

    const imageAppear = () => {
        setSavedImage(true)
        setTimeout(() => setSavedImage(false), 5000);
    };

    return (
        <div className="profile-page">
            <div className="profile-information-container">
                <div className="information-inputs">
                    <div className="user-box">

                        <div className="profile-section">
                            <h1> Profile Information</h1>
                            <div className="user-inputs">
                                <div className="input-box">
                                    <p className="input-header">Email</p>
                                    <p className="input-text">{email}</p>
                                </div>
                                <div className="input-box">
                                    <p className="input-header">Displayed Username</p>
                                    <p className="input-text">{username}</p>
                                </div>
                            </div>
                            <div className="account-functions">
                                <button className="logout" onClick={logOut}> Log Out </button>
                                <button className="delete" onClick={() => {}}> Delete Account </button>
                            </div>
                        </div>

                        <div className="site-features">

                            <button className="site-button">
                                <div className="site-button-mark">  </div>
                                <h4>Your Groups</h4>
                            </button>

                            <button className="site-button">
                                <div className="site-button-mark">  </div>
                                <h4>Finance Statistics</h4>
                            </button>

                            <button className="site-button">
                                <div className="site-button-mark">  </div>
                                <h4>Collection Permissions</h4>
                            </button>

                            <button className="site-button">
                                <div className="site-button-mark">  </div>
                                <h4>Debt Permissions</h4>
                            </button>

                            <button className="site-button">
                                <div className="site-button-mark">  </div>
                                <h4>View Blocked Users</h4>
                            </button>

                        </div>

                    </div>

                    <div className="information-box"> 
                        <div className="image-info">
                            <div className="image-buttons">
                                <div className="picture-box">
                                    <img id="user-picture" src={uploaded} alt="Profile" />
                                    {savedImage && <p id="saved-picture">Picture Saved</p>}
                                </div>
                                <div className="picture-buttons"> 
                                    <input type="file" onChange={changeImage} />
                                    <button onClick={handleUpload}>Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Profile;