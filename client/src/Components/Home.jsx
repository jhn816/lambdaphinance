import React, { useEffect, useState } from "react";
import Login from "./Login.jsx";
import userEvent from "@testing-library/user-event";
import "./css/Home.css";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal.jsx";


const Home = ({loggedIn}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    const [username, setUsername] = useState("");

    const [allCollections, setAllCollections] = useState([]);
    const [listFriends, setListFriends] = useState([]);

    const [viewAllCards, setViewAllCards] = useState(false);

    const [showModal, setShowModal] = useState("none");
    const [collectionCollapse, setCollectionCollapse] = useState(true);

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

    const checkCollections = () => {
        if (allCollections.length < 4) {
            setShowModal("no-collections");
        } else {
            if (!collectionCollapse) {
                setCollectionCollapse(!collectionCollapse);
                const t = setTimeout( ()=> setViewAllCards(!viewAllCards), 600);
            } else {
                setCollectionCollapse(!collectionCollapse);
                setViewAllCards(!viewAllCards);
            }
        }
    }

    return (
    (!token ? (<Login /> ) : ( <>
        <div className="home-page">
            <div className="left-home">
                <div className="landing-page">
                    <h1 style={{fontSize:"42px"}}> Good Afternoon, {username}</h1>
                    <p style={{fontSize:"26px"}}> Anything NU?</p>
                </div>

                <div className="home-content">
                    <div className="home-collections">

                        <div className="home-debts-header">
                            <h4> Collection Cards </h4>
                            <div className="home-debts-category">
                                <button onClick={checkCollections}> View All </button>
                            </div>
                        </div>

                        <div className= "home-collections-container">
                            {allCollections.slice(0,3).map((item, index) => (<>
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
                                </>
                            ))}
                            {(allCollections.length > 3 && viewAllCards) && allCollections.slice(3, allCollections.length).map((item,index) => (
                                <>
                                <div key={index} className={`home-collections-box ${collectionCollapse ? "collection-slide-up" : "collection-slide-down" }`}>

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
                                </>
                            ))}
                            {allCollections.length < 3 && 
                                [...Array(3 - allCollections.length)].map((_, index) => (
                                    <div key={index} className="home-collections-box-empty" style={{opacity:"50%", filter:"drop-shadow(0px 0px 0px black)"}}>

                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="home-quick-access">
                        <h5> Quick Access</h5>

                        <div className="home-quick-access-buttons">
                            <button>
                                <div className="quick-button">
                                    <p> Make A Transaction </p>
                                </div>
                            </button>

                            <button>
                                <div className="quick-button">
                                    <p> Add A Debt </p>
                                </div>
                            </button>

                            <button>
                                <div className="quick-button">
                                    <p> View Groups </p>
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
        {showModal === "no-collections" && 
            <Modal 
                status={showModal}
                header={"Not Enough!"}
                content={"We couldn't find anymore collections from you in our database."} 
                type={"Okay"}
                onClose={() => {setShowModal("none")}}
                // onAnswer={() =>  {submitCollection(collectionName); setShowModal("none")}}
            />
            }
            </>
        
        )
    )
)

}

export default Home;