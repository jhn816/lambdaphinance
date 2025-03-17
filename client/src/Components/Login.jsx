import React, { useState } from "react";
import "./css/Login.css"
import { Link } from "react-router-dom";

const Login = () => {

    const checkAccount = (event) => {
        console.log("hi");
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
                            <h4> Username </h4>
                            <input type="text" placeholder="type here..." />
                        </div>

                        <div className="login-input">
                            <h4> Password </h4>
                            <input type="password" placeholder="type here..." />
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