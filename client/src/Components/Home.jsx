import React, { useEffect, useState } from "react";
import Login from "./Login.jsx";
import userEvent from "@testing-library/user-event";
import "./css/Home.css";
import { useNavigate } from "react-router-dom";


const Home = ({loggedIn}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    const [username, setUsername] = useState("");

    const [allCollections, setAllCollections] = useState([]);
    const [listFriends, setListFriends] = useState([]);

    const [viewAllCards, setViewAllCards] = useState(false);

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
            setUsername(result.user.username);
            getUserCollections(result.user.email);
        })
    }, [token, navigate]);

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
            getUserFriends(result.user.email);
            getUserCollections(result.user.email);
        })
    }, [token, navigate]);

    const getUserCollections = (email) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/collections`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email
            })
        }) .then( (res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log("Error", result.error);
                return;
            }
            setAllCollections(result.collections);
        }) .catch((error) => {
            console.error("Error:", error);
        });
    }

    const getUserFriends = (email) => {
        // console.log("Email:", email);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/friends`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email
            })
        }) .then ((res) => res.json())
        .then((result) => {
            if (result.error) {
                console.log("Error", result.error);
                return;
            }
            setListFriends(result.listFriends);
        })
    }

    return (
    (!token ? (<Login /> ) : (
        <div className="home-page">
            <div className="left-home">
                <div className="landing-page">
                    <h1 style={{fontSize:"42px"}}> Good Afternoon, {username}</h1>
                    <p style={{fontSize:"26px"}}> What are we doing today?</p>
                </div>

                <div className="home-content">
                    <div className="home-collections">

                        <div className="home-debts-header">
                            <h4> Collection Cards </h4>
                            <div className="home-debts-category">
                                <button onClick={() => setViewAllCards(!viewAllCards)}> View All </button>
                            </div>
                        </div>

                        <div className= { viewAllCards ? "home-collections-container-view-all" : "home-collections-container"}>
                            { viewAllCards && allCollections.map((item, index) => (
                                    <div key={index} className="home-collections-box">

                                        <div className="home-collections-top"> 
                                            <p> {item.collectionName} </p>
                                            <button> Manage </button>
                                        </div>

                                        <div className="home-collections-down"> 
                                            {item.totalBalance < 0 ? (<p style={{fontSize:"34px", color:"#b4ffab"}}> {String(item.totalBalance).replace('-', '-$')} </p>) :(
                                                <p style={{fontSize:"34px", color:"#b4ffab"}}> ${item.totalBalance} </p>
                                            )}
                                            <p style={{fontSize:"22px", fontWeight:"1000"}}> Balance </p>
                                            
                                        </div>
                                    </div>
                                ))}
                            { !viewAllCards && allCollections.slice(0,3).map((item, index) => (
                                <div key={index} className="home-collections-box">

                                    <div className="home-collections-top"> 
                                        <p> {item.collectionName} </p>
                                        <button> Manage </button>
                                    </div>

                                    <div className="home-collections-down"> 
                                        {item.totalBalance < 0 ? (<p style={{fontSize:"34px", color:"#b4ffab"}}> {String(item.totalBalance).replace('-', '-$')} </p>) :(
                                            <p style={{fontSize:"34px", color:"#b4ffab"}}> ${item.totalBalance} </p>
                                        )}
                                        <p style={{fontSize:"22px", fontWeight:"1000"}}> Balance </p>
                                        
                                    </div>
                                </div>
                            ))}
                        
                        </div>
                    </div>

                    <div className="home-quick-access">
                        <h5> Quick Access</h5>

                        <div className="home-quick-access-buttons">
                            <button>
                                <div className="quick-button">
                                    <p> Make An Expense </p>
                                </div>
                            </button>

                            <button>
                                <div className="quick-button">
                                    <p> Add A Debt </p>
                                </div>
                            </button>

                            <button>
                                <div className="quick-button">
                                    <p> Share A Collection </p>
                                </div>
                            </button>

                            <button>
                                <div className="quick-button">
                                    <p> Add a Friend</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="home-debts">
                        <div className="home-debts-header">
                            <h6> Your Debts </h6>
                            <div className="home-debts-category">
                                <button> To You </button>
                                <button> From You </button>
                            </div>
                        </div>

                        <div className="home-debts-container">

                        </div>
                    </div>
                </div>
            </div>

            <div className="right-home"> 
                <div> 
                    <h3> Recent Transactions</h3>
                </div>

                <div> 
                    <h3> Friends Lists</h3>
                </div>
            </div>
        </div>
        
        )
    )
)

}

export default Home;