import React, { useEffect, useState } from "react";
import Signup from "./Signup.jsx";
import userEvent from "@testing-library/user-event";



const Home = ({loggedIn}) => {
    useEffect(() => {

        console.log("Log in state", loggedIn);

    }, []);

    return (
    (!loggedIn ? (<Signup /> ) : (

        <p>Home</p>
        
        )
    )
)

}

export default Home;