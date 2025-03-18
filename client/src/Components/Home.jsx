import React, { useEffect, useState } from "react";
import Login from "./Login.jsx";
import userEvent from "@testing-library/user-event";
import "./css/Home.css";

const Home = ({loggedIn}) => {

    const logOut = (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.reload();
    }

    const token = localStorage.getItem("token")

    return (
    (!token ? (<Login /> ) : (
        <div className="home-container">
            <form onSubmit={logOut}>
                    <button type="submit" > logout </button>
            </form>
        </div>
        
        )
    )
)

}

export default Home;