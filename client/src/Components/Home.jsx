import React, { useEffect, useState } from "react";
import Login from "./Login.jsx";
import userEvent from "@testing-library/user-event";
import "./css/Home.css";
import { useNavigate } from "react-router-dom";

const Home = ({loggedIn}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token")

    useEffect( () => {
        if (!token) {
            navigate("/");
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
            method:"GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
        }) .then( (res) => res.json() )
        .then( (result) => {
            if (!result.user) {
                console.log("Profile not found");
                localStorage.removeItem("token");
                navigate("/");
                return;
            }
        })
    }, [token, navigate]);

    return (
    (!token ? (<Login /> ) : (
        <div className="home-container">
        </div>
        
        )
    )
)

}

export default Home;