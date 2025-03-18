import React, { useEffect, useState } from "react";
import "./css/Navbar.css";
import userEvent from "@testing-library/user-event";
import { Link } from "react-router-dom";

const Navbar = () => {

    return (
        <div className="navigation-bar">
            <ul className = "nav-links">
                <a href="/">Home</a>

                {/* expenses tracker of your own account */}
                <a href="expenses">Expenses</a>
                {/* debts owed to or form, accounts can request from each other */}
                <a href="records">Records</a>
                {/* financials goals you wanna set */}
                <a href="plan">Plan</a>

                <a className="profile-nav" href="profile">Profile</a>
            </ul>
        </div>
    )

}

export default Navbar;