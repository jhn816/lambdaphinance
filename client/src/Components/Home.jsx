import React, { useEffect, useState } from "react";
import Login from "./Login.jsx";
import userEvent from "@testing-library/user-event";
import "./css/Home.css";

const Home = ({loggedIn}) => {

    const token = localStorage.getItem("token")

    return (
    (!token ? (<Login /> ) : (
        <div className="home-container">
        </div>
        
        )
    )
)

}

export default Home;