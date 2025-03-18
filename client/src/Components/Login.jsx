import React, { useState } from "react";
import "./css/Login.css"
import { Link } from "react-router-dom";
import Money from "../assets/money.jpg"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState({});

    const checkAccount = (event) => {
        event.preventDefault();
        
        let error = {};

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, { 
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
                if (result.error){
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
        <div className="login-containers">
            <div className="login-titles">
                <img src={Money} alt="money" class="money"/>
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
                            {error.match && <p>{error.match}</p>}
                        </div>
                    </div>      
                    <button type="submit" > done</button> 
                    <h6> Don't have an account? <Link to="/register"> Register</Link></h6> 
                </div>
            </form>
        </div>
    )
}

export default Login;