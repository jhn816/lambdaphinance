import React, { useEffect, useState } from "react";
import "./css/Login.css"
import { Link } from "react-router-dom";
import Money from "../assets/money.jpg"


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState({});

    useEffect( () => {
        window.scrollTo(0, document.body.scrollHeight);
    })

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
        <div className="login-page">
            <div className="login-containers">
                <div className="login-titles">
                    <img src={Money} alt="money" className="money"/>
                    <h1> Lambda Phinance</h1>
                    <h3> track all your expenses</h3>
                </div>
                <form onSubmit={checkAccount}>
                    <div className="login-information">   
                        <div className="login-box">
                            <h2 style={{marginBottom:"10px"}}>LOG IN</h2>     

                            <div className="login-input">
                                <input name="emailInput" type="email" autocomplete="off" placeholder=""  onChange = {(e) => setEmail(e.target.value)} />
                                <label className="login-label" for="emailInput"> Enter your email </label>
                            </div>

                            <div className="login-input" style={{marginBottom:"15px"}}>
                                <input name="passwordInput" type="password" autocomplete="new-password" placeholder=" " onChange = {(e) => setPassword(e.target.value)} />
                                <label className="login-label" for="passwordInput"> Enter your password </label>
                            </div>

                            <div style={{width:"100%"}}>
                                <button type="submit" style={{marginBottom:"10px"}} > Enter</button> 
                                <a type="button" href="/register" data-discover="true" id="login-register"> Sign Up </a> 
                            </div>
                        </div>      
                    </div>
                    {error.match && 
                    <div id="modal-container">
                        <div className="modal-header">
                            <h3>Oh no!</h3>
                        </div>
                        <p>{error.match}</p>
                        <button type="button" onClick={() => (setError({}))}> Close </button>
                    </div>}
                </form>
            </div>
        </div>
    )
}

export default Login;