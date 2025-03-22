import React, { useState } from "react";
import "./css/Signup.css"
import { Link } from "react-router-dom";
import Money from "../assets/money.jpg"

const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setErrors] = useState({});

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
        if (error) {
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
        })
        .catch(error => console.error("Error:", error));
    }

    return (
        <div className="signup-containers">
            <div className="signup-titles">
                <img src={Money} alt="money" className="money"/>
                <h1> Lambda Phinance</h1>
                <h3>a nu chapter</h3>
            </div>

            <div className="signup-information">   
                <h2>REGISTER</h2>     
                <form onSubmit={submitAccount}>
                    <div className="signup-box">
                        <div className="signup-input">
                            <h4> Email </h4>
                            <input type="email" onChange= {(e) => setEmail(e.target.value)} placeholder="type here..." />
                            {error.email && <p>{error.email}</p>}
                        </div>

                        <div className="signup-input">
                            <h4> Username </h4>
                            <input maxLength={15} type="text" onChange={(e)=> setUsername(e.target.value)} placeholder="type here..." />
                            <div className="input-info">
                                <p id="character-count">{username.length}/15</p>
                                {!error.username && <p>{error.username}</p>}
                            </div>
                        </div>

                        <div className="signup-input">
                            <h4> Password </h4>
                            <input type="password" onChange={(e)=> setPassword(e.target.value)} placeholder="type here..." />
                            {error.password && <p>{error.password}</p>}
                        </div>

                        <div className="signup-input">
                            <h4> Confirm Password </h4>
                            <input type="password" onChange={(e)=> setConfirmPassword(e.target.value)}placeholder="type here..." />
                            {error.passwordmatch && <p>{error.passwordmatch}</p>}

                        </div>

                    </div>          
                    <button type="submit"> create</button>  
                    <h6> Already have an account? <Link to="/"> Login</Link></h6>

                </form>
            </div>
        </div>
    )
}

export default Signup;