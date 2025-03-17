import React, { useEffect, useState } from "react";
import Login from "./Login.jsx";
import userEvent from "@testing-library/user-event";



const Home = ({loggedIn}) => {

    return (
    (!loggedIn ? (<Login /> ) : (

        <div>
            <h1>Home Page</h1>
        </div>
        
        )
    )
)

}

export default Home;