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

    const [friendInput, setFriendInput] = useState(""); // email generating friend request
    const [listFriends, setListFriends] = useState([]); // all added friends
    const [listRequests, setListRequests] = useState([]); // all received requests
    const [listSents, setListSents] = useState([]); // all sent requests
    const [requestTab, setRequestTab] = useState("receive"); // track request tab
    const [manageFriend, setManageFriend] = useState(null); // friend manage dropdown
  
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
        console.log("Email:", email);
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

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/sents`, {
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
            setListSents(result.listSents);
        })
    }

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
            getUserCollections(email);
            if (result.collection.deletedCount === 1) {
                console.log("deletedCollection",result.collection);
            }
        })
        .catch(error => console.error("Error:", error));
    }

    const changeCollection = (item) => {
        if (item.collectionName === editCollectionName) {
            alert("That's the same name!");
            return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/collection`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                _id:item._id,
                name: editCollectionName,
                email,
                })
            }) .then ((res) => res.json() )
            .then ((result) => {
                if (result.error) {
                    console.log(result.error);
                    return;
                } else if (result.message === "Collection with that name already exists") {
                    alert("Collection with that name already exists");
                    return;
                }
                console.log ("message:", result.message);
                console.log("editedCollection:", result.editedCollection);
                setManageCollection(null);
                getUserCollections(email);
            })
    }

    const openCollection = (item) => {
        if (item.collectionName === manageCollection) {
            setManageCollection(null);
        } else {
            setManageCollection(item.collectionName);
            setManageFriend(null);
        }
    }

    const openFriend = (item) => {
        if (item._id === manageFriend) {
            setManageFriend(null);
        } else {
            setManageFriend(item._id);
            setManageCollection(null);
        }
    }


    const makeFriend = (event) => {
        event.preventDefault();

        if (friendInput === "" || friendInput === email) {
            alert("Enter a friend's email!");
            return;
        }
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/friend`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                sender: email,
                recipient: friendInput
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            } else if (result.acceptedRequest) {
                console.log("Request", result.acceptedRequest);
            }
            console.log("message",result.message);
            getUserFriends(email);
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
                recipient: email,
                sender: item.email
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            console.log("message",result.message);
            console.log("Request", result.acceptedRequest);
            getUserFriends(email);
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
                recipient: email,
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
            getUserFriends(email);
        })
        .catch(error => console.error("Error:", error));
    }

    const cancelFriend = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/friend`, {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                sender: email,
                recipient: item.email
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            console.log("message",result.message);
            console.log("Request", result.deletedRequest)
            getUserFriends(email);
        })
        .catch(error => console.error("Error:", error));
    }

    const deleteFriend = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/friends`, {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                sender: email,
                recipient: item.email
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            console.log("message",result.message);
            console.log("Request", result.deletedFriend)
            getUserFriends(email);
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
                        { allCollections.length === 0 && <div className="collection-box"> Get started in Expenses!</div>}
                        { allCollections.map((item, index) => (
                            <div key={index} className="collection-box"> 
                                {(manageCollection !== item.collectionName) ? 
                                    (<p className="collection-name">{item.collectionName}</p>)
                                        : (<input type="text" maxLength={20} onChange={(e) => setEditCollectionName(e.target.value)} value={editCollectionName}/>)}
                                     {(manageCollection !== item.collectionName) ? ( <div className="collection-details">
                                         <div className="div-balance">
                                             <p className="collection-balance" style={{"color":"green"}}> Balance ${item.totalBalance}</p>
                                         </div>
                                         <div className="div-indices">
                                             <p className="collection-indices">({item.indices})</p>
                                         </div>
                                         <div className="div-manage">
                                             <button className="collection-manage" onClick={(e) => { openCollection(item); setEditCollectionName(item.collectionName); }}> Manage {item.collectionName}</button>
                                         </div>
                                     </div>
                                     ) : ( <div className="edit-details">
                                             <button onClick={() => (changeCollection(item))}> Edit Name </button>
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
                                <div className="request-tabs">
                                    <h5 id="received-request" onClick={() => setRequestTab("receive")}>Received Requests</h5>
                                    <h5 id="sent-request" onClick={() => setRequestTab("sent")}>Sent Requests</h5>
                                </div>
                                <div className="request-box">
                                    {(requestTab === "receive") ? (<>
                                        {listRequests.length === 0 && <p> No Received Requests :(</p>}
                                        {listRequests.map((item, index) => {
                                            return (
                                                <div key={index} className="accept-friend">
                                                    <img src={item.profileImage} alt="Profile"/>
                                                    <div className="accept-info">
                                                        <p>{item.username}</p>
                                                        <div className="accept-buttons">
                                                            <button onClick={() => acceptFriend(item)} className="friend-accept" type="button"> Accept</button>
                                                            <button onClick={() => rejectFriend(item)} className="friend-reject" type="button"> Reject</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>) : ( <>
                                        {listSents.length === 0 && <p> No Sent Requests :(</p>}
                                        {listSents.map((item, index) => {
                                            return (
                                                <div key={index} className="accept-friend">
                                                    <img src={item.profileImage} alt="Profile"/>
                                                    <div className="accept-info">
                                                        <p>{item.username}</p>
                                                        <div className="accept-buttons">
                                                            <button onClick={() => cancelFriend(item)} className="friend-cancel" type="button"> Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </> )
                                    }
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
                                    <img src={item.profileImage} alt="Profile" height= "90" />
                                    <div className="friend-information">
                                        <p>user: {item.username}</p>
                                        <div className="friend-buttons">
                                            <button> Message</button>
                                            <button onClick={() => (openFriend(item))}> Manage</button>
                                                {manageFriend === item._id &&
                                                <div className="friend-dropmenu">
                                                    <button style={{borderBottomLeftRadius:"0px", borderBottomRightRadius:"0px"}} id="favorite-friend">Favorite</button>
                                                    <button style={{borderRadius:"0px"}}id="share-friend">Share</button>
                                                    <button onClick={() => (deleteFriend(item))} style={{borderTopLeftRadius:"0px", borderTopRightRadius:"0px"}} id="delete-friend">Delete</button>
                                                </div>
                                                }
                                            </div>
                                        </div>
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