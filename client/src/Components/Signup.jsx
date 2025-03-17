import React, { useState } from "react";
import "./css/Signup.css"
import { Link } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const submitAccount = (event) => {
        event.preventDefault();

        if (email === "") {
            alert("Fill in Email!");
            return;
        } else if (username === "") {
            alert("Fill in username!");
            return;
        } else if (password === "") {
            alert("Fill in password!");
            return;
        } else if (password !== confirmPassword) {
            alert("Passwords do not match!");
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
                        </div>

                        <div className="signup-input">
                            <h4> Username </h4>
                            <input type="text" onChange={(e)=> setUsername(e.target.value)} placeholder="type here..." />
                        </div>

                        <div className="signup-input">
                            <h4> Password </h4>
                            <input type="password" onChange={(e)=> setPassword(e.target.value)} placeholder="type here..." />
                        </div>

                        <div className="signup-input">
                            <h4> Confirm Password </h4>
                            <input type="password" onChange={(e)=> setConfirmPassword(e.target.value)}placeholder="type here..." />
                        </div>

                        <h6> Already have an account? <Link to="/"> Login</Link></h6>
                    </div>      
                    <button type="submit"> create</button>  
                </form>
            </div>
        </div>
    )
}

export default Signup;