import React, { useState } from "react";
import "./css/Signup.css"
import { Link, useNavigate } from "react-router-dom";
import Money from "../assets/money.jpg"

const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setErrors] = useState({});
    const navigate = useNavigate();

    const submitAccount = (event) => {
        event.preventDefault();
        let error = {};
        if (email === "") {
            error.email = "Fill in Email!";
        } else if (username === "") {
            error.username = "Fill in username!";
        } else if (password === "") {
            error.password = "Fill in password!";
        } else if (password !== confirmPassword) {
            error.passwordmatch = "Passwords do not match!";
        }
        if (Object.keys(error).length > 0) {
            setErrors(error);
            return;
        }
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register`, { 
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            }),
        }) .then ((res) => res.json()) 
        .then((result) => {
            console.log(result);
            navigate("/");
        })
        .catch(error => console.error("Error:", error));
    }

    return (
        <div className="signup-containers">
            <div className="signup-information">   
                <form onSubmit={submitAccount}>
                    <div className="signup-box">
                        <h2 style={{marginBottom:"10px"}}>REGISTER</h2>
                        <div className="signup-input">
                            <h4> Email </h4>
                            <input type="email" onChange= {(e) => setEmail(e.target.value)} placeholder="type here..." />
                            {error.email && <p style={{alignSelf:"flex-end"}}>{error.email}</p>}
                        </div>

                        <div className="signup-input">
                            <h4> Username </h4>
                            <input maxLength={15} type="text" onChange={(e)=> setUsername(e.target.value)} placeholder="type here..." />
                            <div className="input-info">
                                <p id="character-count" style={{marginBottom:"0px"}}>{username.length}/15</p>
                                {error.username && <p>{error.username}</p>}
                            </div>
                        </div>

                        <div className="signup-input">
                            <h4> Password </h4>
                            <input type="password" onChange={(e)=> setPassword(e.target.value)} placeholder="type here..." />
                            {error.password && <p style={{alignSelf:"flex-end"}}>{error.password}</p>}
                        </div>

                        <div className="signup-input" style={{marginBottom:"15px"}}>
                            <h4> Confirm Password </h4>
                            <input type="password" onChange={(e)=> setConfirmPassword(e.target.value)}placeholder="type here..." />
                            {error.passwordmatch && <p style={{alignSelf:"flex-end"}}>{error.passwordmatch}</p>}
                        </div>

                        <div className="signup-buttons">
                            <button type="submit"> Sign Up</button>  
                            <Link to="/" id="login-register">Log In</Link>
                        </div>

                    </div>          

                </form>
            </div>
        </div>
    )
}

export default Signup;