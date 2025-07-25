import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const checkAccount = (event) => {
        event.preventDefault();

        let error = {};

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, { 
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(result => {
            if (result.token) {
                localStorage.setItem("token", result.token);
                window.location.reload();
                navigate('/');
                console.log("Login successful!");
            } else {
                if (result.error) {
                    console.log("Login failed:", result.error);
                    error.match = result.error;
                    setError(error);
                    return;
                } else {
                    console.log("Login failed:", result.error);
                }
            }
        })
        .catch(error => console.error("Error:", error));
    }

    return (
        <div className="login-page">
            <div className="login-containers">
                <form onSubmit={checkAccount}>
                    <div className="login-information">
                        <div className="login-box">
                            <h2 style={{marginBottom:"10px"}}>LOG IN</h2>
                            <div className="login-input">
                                {/* Static label for maximum compatibility */}
                                <input
                                    id="emailInput"
                                    type="email"
                                    autoComplete="username"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="login-input" style={{marginBottom:"15px"}}>
                                <input
                                    id="passwordInput"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="login-buttons" style={{width:"100%"}}>
                                <button type="submit" style={{marginBottom:"10px"}}>Enter</button>
                                <Link to="/register" id="login-register">Sign Up</Link>
                            </div>
                        </div>
                    </div>
                    {error.match && (
                        <div id="modal-container">
                            <div className="modal-header">
                                <h3>Oh no!</h3>
                            </div>
                            <p>{error.match}</p>
                            <button type="button" onClick={() => setError({})}>Close</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Login;
