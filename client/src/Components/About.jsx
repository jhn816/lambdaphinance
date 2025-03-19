import React, { useState, useEffect} from "react";
// import "./css/About.css"
import { Link, useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect( () => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <div> 
            <p>Made by Justin "M.E.T.A." Nguyen</p>
            <p>Crossed in Fall 2022 with the Beta Theta Battalion</p>
        </div>
    )
}

export default About;