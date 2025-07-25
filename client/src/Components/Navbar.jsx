import React, { useEffect, useState} from "react";
import "./css/Navbar.css";
import userEvent from "@testing-library/user-event";
import { Link, useLocation} from "react-router-dom";
import Hamburger from "../assets/hamburg.png";
import Close from "../assets/closeham.png";


const Navbar = () => {
    const [ham, setHam] = useState(false);
    const [closing, setClosing] = useState(false);
    const location = useLocation();


    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setHam(!ham);
            setClosing(false);
        }, 500);
      };

    return ( <>
        <div className="desktop-bar">
            <ul className = "nav-links">
                <a href="/" style={{textDecoration: location.pathname === "/" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Home</a>

                {/* expenses tracker of your own account, with total amounts and separate net gain/loss*/}
                <a href="expenses" style={{textDecoration: location.pathname === "/expenses" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Expenses</a>
                {/* debts owed to or form, accounts can request from each other, also where friends list is and you can share your expenses*/}
                <a href="records" style={{textDecoration: location.pathname === "/records" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Records</a>
                {/* financials goals you wanna set, with graphs and charts*/}
                <a href="plan" style={{textDecoration: location.pathname === "/plan" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Plan</a>

                <a className="about-nav" href="about" style={{textDecoration: location.pathname === "/about" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>About</a>
                <a className="profile-nav" href="profile" style={{textDecoration: location.pathname === "/profile" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Profile</a>
            </ul>
        </div>

        <div className="mobile-bar">
            <ul className = "nav-links" style={{flexDirection:"column", justifyContent:"center"}}>
                {!ham && <img src={Hamburger} alt="hamburger-menu" onClick={() => setHam(!ham)}/>}
                {ham && <img src={Close} alt="hamburger-menu" onClick={handleClose}/>}
            </ul>
        </div>

        { ham && <div className={closing ? "hamburger-close" : "hamburger-open"}>
        <a href="/">Home</a>
        {/* expenses tracker of your own account, with total amounts and separate net gain/loss*/}
        <a href="expenses">Expenses</a>
        {/* debts owed to or form, accounts can request from each other, also where friends list is and you can share your expenses*/}
        <a href="records">Records</a>
        {/* financials goals you wanna set, with graphs and charts*/}
        <a href="plan">Plan</a>
        <a className="about-nav" href="about">About</a>
        <a className="profile-nav" href="profile">Profile</a>
        </div> }
        </>
    )

}

export default Navbar;