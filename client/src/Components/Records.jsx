import React, { useState, useEffect } from "react";
import "./css/Records.css"
import { Link, useNavigate } from "react-router-dom";

const Records = () => {
    const [email, setEmail] = useState("");
    const [allCollections, setAllCollections] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
  
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
            setEmail(result.user.email)
        })
    }, [token, navigate]);

    useEffect( () => {
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
    }, [email])

    const makeFriend = () => {

    }

    return (
        <div className="wholerecords">
            <div className="records-page">
                <div className="record-container">
                    <div className="records">
                        <h2>Your Collections</h2>
                        <div className="collections">
                        { allCollections.map((item, index) => (
                            <div key={index} className="collection-box"> 
                                <p class="collection-name">{item.collectionName} </p>
                                <div className="collection-details">
                                    <div className="div-balance">
                                        <p className="collection-balance" style={{"color":"green"}}> Balance $40</p>
                                    </div>
                                    <div className="div-indices">
                                        <p className="collection-indices">(3)</p>
                                    </div>
                                    <div className="div-manage">
                                        <button className="collection-manage"> Manage {item.collectionName}</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                        
                    <div className="records-debts">
                        <h2>Your Debts</h2>
                        <div className="debts">

                        </div>
                    </div>
                </div>

                <div className="friends-container">
                    <div className="makefriend">
                        <div className="addinfo">
                            <form onSubmit={makeFriend}>
                                <h2>Add a Friend</h2>
                                <div className="addfriend">
                                    <input type="email" placeholder="Enter their email..."/>
                                    <button>Done</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="friendslist">
                        <h3>Friends List</h3>
                        <div className="friends">
                            <div className="friend-box">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Records;