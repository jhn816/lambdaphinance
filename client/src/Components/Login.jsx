import React, { useState } from "react";
import "./css/Login.css"
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const checkAccount = (event) => {
        event.preventDefault();
        
        fetch("http://localhost:8000/api/login", {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }) .then( (res) => res.json() )
        .then ( (result) => {
            if (result.token) {
                localStorage.setItem("token", result.token);
                window.location.reload();
                console.log("Login successful!");
            } else {
                console.log("Login failed:", result.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }

    return (
        <div className="login-containers">
            <div className="login-titles">
                <h1> Lambda Phinance</h1>
                <h3> track all your expenses</h3>
            </div>
            <form onSubmit={checkAccount}>
                <div className="login-information">   
                    <h2>LOGIN</h2>     
                    <div className="login-box">

                        <div className="login-input">
                            <h4> Email </h4>
                            <input type="email" onChange = {(e) => setEmail(e.target.value)} placeholder="type here..." />
                        </div>

                        <div className="login-input">
                            <h4> Password </h4>
                            <input type="password" onChange = {(e) => setPassword(e.target.value)} placeholder="type here..." />
                        </div>

                        <h6> Don't have an account? <Link to="/register"> Register</Link></h6>
                    </div>      
                    <button type="submit" > done</button>  
                </div>
            </form>
        </div>
    )
}

export default Login;