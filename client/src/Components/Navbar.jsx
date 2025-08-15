import React, { useEffect, useState} from "react";
import "./css/Navbar.css";
import userEvent from "@testing-library/user-event";
import { Link, useLocation} from "react-router-dom";
import Hamburger from "../assets/hamburg.png";
import Close from "../assets/closeham.png";
import Logo from "../assets/logo.png";
import NotificationCenter from "./Notifications";



const Navbar = () => {
    const [ham, setHam] = useState(false);
    const [closing, setClosing] = useState(false);
    const location = useLocation();

    const [notiToggle, setNotiToggle] = useState(false);


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
                <Link to="/">
                    <img 
                    src={Logo} 
                    alt="Home" 
                    style={{ height: "50px", cursor: "pointer" }} 
                    />
                </Link>

                <a href="/" style={{textDecoration: location.pathname === "/" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Home</a>

                {/* expenses tracker of your own account, with total amounts and separate net gain/loss*/}
                <a href="expenses" style={{textDecoration: location.pathname === "/expenses" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Transactions</a>
                {/* debts owed to or form, accounts can request from each other, also where friends list is and you can share your expenses*/}
                <a href="records" style={{textDecoration: location.pathname === "/records" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Records</a>
                {/* financials goals you wanna set, with graphs and charts*/}
                <a href="plan" style={{textDecoration: location.pathname === "/plan" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>Plan</a>
                
                <a className="about-nav" href="about" style={{textDecoration: location.pathname === "/about" ? "underline" : "none", textUnderlineOffset: "5px", textDecorationThickness: "1px"}}>About</a>
                <img 
                src={Logo} 
                alt="Home" 
                style={{ height: "50px", cursor: "pointer" }} 
                onClick={() => setNotiToggle(!notiToggle)}
                />
                {notiToggle && <NotificationCenter />}
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
        <Link to="/">
            <img 
            src="../assets/logo.png" 
            alt="Home" 
            style={{ height: "40px", cursor: "pointer" }} 
            />
        </Link>
        <a href="/">Home</a>
        {/* expenses tracker of your own account, with total amounts and separate net gain/loss*/}
        <a href="expenses">Transactions</a>
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