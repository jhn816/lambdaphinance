import React, { useState, useEffect } from "react";
import "./css/Records.css"
import { Link, useNavigate } from "react-router-dom";

const Records = () => {
    const [email, setEmail] = useState("");
    const [uploaded, setUploaded] = useState(null);
    const [allCollections, setAllCollections] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [manageCollection, setManageCollection] = useState(null);
    const [editCollectionName, setEditCollectionName] = useState(null);
    const [changedCollections, setChangedCollections] = useState(false);

    const [friendInput, setFriendInput] = useState("");
    const [listFriends, setListFriends] = useState([]);
    const [listRequests, setListRequests] = useState([]);

  
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
            setUploaded(result.imageUrl);
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
            console.log("message", result.message);
            setListFriends(result.listFriends);
        })

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/requests`, {
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
            console.log("message", result.message);
            setListRequests(result.listRequests);
        })
    }, [email, changedCollections])

    const deleteCollection = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/collections`, {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                _id:item._id,
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            setChangedCollections(!changedCollections);
            if (result.collection.deletedCount == 1) {
                console.log("deletedCollection",result.collection);
            }
        })
        .catch(error => console.error("Error:", error));
    }

    const openCollection = (item) => {
        if (item.collectionName === manageCollection) {
            setManageCollection(null);
        } else {
            setManageCollection(item.collectionName);
        }
    }


    const makeFriend = (event) => {
        event.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/friend`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                recepient: email,
                sender: friendInput
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            console.log("message",result.message);
            setChangedCollections(!changedCollections);
        })
        .catch(error => console.error("Error:", error));
    }

    const acceptFriend = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/friend`, {
            method:"PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                recepient: email,
                sender: item.email
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            console.log("message",result.message);
            console.log("Request", result.acceptedRequest)
            setChangedCollections(!changedCollections);
        })
        .catch(error => console.error("Error:", error));
    }

    const rejectFriend = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/friend`, {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                recepient: email,
                sender: item.email
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            console.log("message",result.message);
            console.log("Request", result.deletedRequest)
            setChangedCollections(!changedCollections);
        })
        .catch(error => console.error("Error:", error));
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
                                {(manageCollection !== item.collectionName) ? 
                                    (<p className="collection-name">{item.collectionName}</p>)
                                        : (<input type="text" onChange={(e) => setEditCollectionName(e.target.value)} value={editCollectionName}/>)}
                                     {(manageCollection !== item.collectionName) ? ( <div className="collection-details">
                                         <div className="div-balance">
                                             <p className="collection-balance" style={{"color":"green"}}> Balance $40</p>
                                         </div>
                                         <div className="div-indices">
                                             <p className="collection-indices">(3)</p>
                                         </div>
                                         <div className="div-manage">
                                             <button className="collection-manage" onClick={(e) => { openCollection(item); setEditCollectionName(item.collectionName); }}> Manage {item.collectionName}</button>
                                         </div>
                                     </div>
                                     ) : ( <div className="edit-details">
                                             <button> Edit Name </button>
                                             <button onClick={() => (deleteCollection(item))}> Delete </button>
                                             <button> Share </button>
                                             <button onClick={() => (setManageCollection(null))}> Cancel </button>
                                         </div>
                                     )}
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
                                    <input type="email" value={friendInput} onChange={(e) => setFriendInput(e.target.value)} placeholder="Enter their email..."/>
                                    <button>Done</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="request-container">
                        <div className="addinfo">
                            <form>
                                <h5>Friend Requests</h5>
                                <div className="request-box">
                                    {listRequests.map((item, index) => {
                                        return (
                                            <div className="accept-friend">
                                                <img src={item.profileImage} alt="Profile"/>
                                                <div className="accept-info">
                                                    <p>{item.username}</p>
                                                    <div className="accept-buttons">
                                                        <button onClick={(item) => acceptFriend(item)} className="friend-accept" type="button"> Accept</button>
                                                        <button onClick={(item) => rejectFriend(item)} className="friend-reject" type="button"> Reject</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="friendslist">
                        <h3>Friends List</h3>
                        <div className="friends">
                            {listFriends.map((item, index) => {
                                return (
                                <div key={index} className="friend-box">
                                    <img src={item.profileImage} alt="Profile" height="80" />
                                    <p>{item.email}</p>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Records;