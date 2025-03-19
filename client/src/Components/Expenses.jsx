import React, { useState, useEffect, use } from "react";
import "./css/Expenses.css"
import { Link, useNavigate } from "react-router-dom";
import { clear } from "@testing-library/user-event/dist/clear";

const Expenses = () => {
    // expense arguments
    const [value, setValue] = useState("");
    const [category, setCategory] = useState("Category↴");
    const [person, setPerson] = useState("");
    const [gain, setGain] = useState(true);

    // drop down menu
    const [dropCategory, setDropCategory] = useState(false);
    const [expenseSheet, setExpenseSheet] = useState("Choose Expenses ▼");
    const [dropExpense, setDropExpense] = useState(false);

    const [netGain, setNetGain] = useState(0);
    const [netLoss, setNetLoss] = useState(0);
    
    const [addedExpense, setAddedExpense] = useState(false);
    const [allExpenses, setAllExpenses] = useState([]);

    const [allCollections, setAllCollections] = useState([]);
    const [collectionName, setCollectionName] = useState("");


    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");


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
                return;
            }
            setEmail(result.user.email)
            setUsername(result.user.user)
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
        })  
    }, [expenseSheet, email])

    useEffect( () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expenses`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                collection: expenseSheet
            })
        }) .then( (res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log("Error", result.error);
                return;
            }
            setNetLoss(0);
            setNetGain(0);
            setAllExpenses(result.expenses);
        })
    }, [addedExpense, expenseSheet])

    useEffect ( () => {
        for (let expense of allExpenses) {
            if (expense.collection === expenseSheet) {
                if (expense.value < 0) {
                    setNetLoss(prevLoss => prevLoss - expense.value);
                } else {
                    setNetGain(prevGain => prevGain + expense.value);
                }
            }
        }
    }, [allExpenses])

    const addExpense = (event) => {
        event.preventDefault();

        if (expenseSheet === "Choose Expenses ▼") {
            alert("Please select a collection");
            return;
        } else if (value === "0" || value === "") {
            alert("Please enter a valid amount");
            return;
        } else if (gain === null) {
            alert("Please indicate if the expense is positive or negative")
            return;
        } else if (category === "Category") {
            alert("Please select a category");
            return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/addexpense`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                collection:expenseSheet,
                value,
                category,
                gain,
                person,
            })
        }).then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            setAddedExpense(!addedExpense);
            setValue("");
            setCategory("Category↴")
            setGain(true);
            setPerson("")
            console.log("Expense saved successfully", result.expense);
        })
        .catch(error => console.error("Error:", error));
    }

    const deleteExpense = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expense`, {
            method:"DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                id:item._id,
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            setAddedExpense(!addedExpense);
            console.log("message",result.message);
            console.log("deletedExpense",result.expense);
        })
        .catch(error => console.error("Error:", error));
    }

    const clearExpense = (event) => {
        event.preventDefault();

        setValue("");
        setCategory("Category↴")
        setGain(true);
        setPerson("");
    }

    const handleChange = (e) => {
        let rawValue = e.target.value.replace(/,/g, "");

        if (/^\d*$/.test(rawValue)) {
            setValue(Number(rawValue).toLocaleString());
        }
    };

    const selectCollection = (e) => {
        setExpenseSheet(e.target.value);
        setDropExpense(false);
    }

    const submitCollection = (event) => {
        event.preventDefault();

        setExpenseSheet(collectionName);
        setDropExpense(false);

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/addcollection`, {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                collectionName,
                email
            })
        }).then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            console.log("Collection saved successfully", result.collection);
            setAllCollections(prevCollections => [...prevCollections, result.collection]);
        })
        .catch(error => console.error("Error:", error));
    }

    const dropdownCategory = (e) => {
        if (dropCategory === false) {
            let dropCategory = true;
            setDropCategory(dropCategory);
        } else {
            if (e.target.value) {
                let category = e.target.value;
                setCategory(category);

            }
            let dropCategory = false;
            setDropCategory(dropCategory);
        }
    }

    const dropdownExpense = (e) => {
        if (dropExpense === false) {
            let dropExpense = true;
            setDropExpense(dropExpense);
        } else {
            if (e.target.value) {
                let expenseSheet = e.target.value;
                setExpenseSheet(expenseSheet);

            }
            let dropExpense = false;
            setDropExpense(dropExpense);
        }
    }

    return (
        <div className="expense-page">
            <div className="add-container">
                <form onSubmit={addExpense}>
                    <div className="tracker-headers">
                        <h4> {username}'s Financial Book</h4>
                        <div className="dropdownmenu">
                            <p>Looking At</p>
                            {expenseSheet !== "Create New +" && 
                            <button type="button" className="expense-button" onClick={dropdownExpense}>{expenseSheet}</button>}

                            {expenseSheet === "Create New +" && <div className="collection-sheets"> 
                                <input placeholder="Enter Collection Name..." onChange={(e) => (setCollectionName(e.target.value))}/>
                                <button type="button" onClick={submitCollection}>Create</button>
                                <button type="button" onClick={selectCollection} value="Choose Expenses ▼">Cancel</button>
                            </div>}

                            {dropExpense && <div className="expense-sheets">
                                <p>Your Collections</p>
                                {allCollections.map((item ,index) => (
                                    <button key={index} type="button" value={item.collectionName} onClick={selectCollection}>{item.collectionName}</button>
                                ))}
                                <button type="button" value="Create New +"onClick={selectCollection}>Create New +</button>
                                <p>Shared with You</p>
                                <button type="button">None</button>
                            </div>}

                        </div>
                    </div>

                    <div className="expense-amount">
                        <h3>Amount to add:</h3>
                        { gain ? ( <h3 style={{ color: "green" }}> ${value || "0"} </h3> )
                        : <h3 style={{ color: "red" }}> -${value || "0"} </h3>}
                    </div>

                    <div className="expense-inputs">
                        <div className="dropdownmenu">
                            <button type="button" onClick={dropdownCategory} className="customize-expense">{category}</button>

                            {dropCategory && <div className="categories">
                                <button type="button" onClick={dropdownCategory} value="Groceries">Groceries</button>
                                <button type="button" onClick={dropdownCategory} value="Alcohol">Alcohol</button>
                                <button type="button" onClick={dropdownCategory} value="Brotherhood">Brotherhood</button>
                                <button type="button" onClick={dropdownCategory} value="Rush">Rush</button>
                            </div>}
                        </div>

                        <button type="button" value="true" className="customize-expense" onClick={() => setGain(!gain)}> + / -</button>
                        <input type="text" placeholder="Enter amount..." value={value} onChange={handleChange} maxLength={20}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}/>
                        <input type="text" placeholder="From/to who (optional)" value={person} onChange={(e) => (setPerson(e.target.value))} />
                    </div>
                    <div className="form-buttons">
                        <button type="button" onClick={clearExpense} className="class-clear">Clear Expense</button>
                        <button type="submit" className="class-submit">Add Expense</button>
                    </div>
                
                </form>
                <div className="expense-information">
                    <div className="net-expenses">
                        <div className="expense-card">
                            <header>
                                <h3>Net Gain</h3>
                            </header>
                            <p style={{ color: "green" }}>${netGain}</p>
                        </div>

                        <div className="expense-card">
                            <header>
                                <h3>Net Loss</h3>
                            </header>
                            <p style={{ color: "red" }}>${netLoss}</p>
                        </div>
                    </div>

                    <div className="balance-card">
                        <header>
                            <h3>Total Balance</h3>
                        </header>
                        <p>${netGain - netLoss}</p>
                    </div>
                </div>
            </div>

            <div className="expense-sheet">
                {allExpenses.map((item, index) => (
                    <div key={index} className="expense-row">
                        <p>{item.category}</p>
                        <p>{item.value}</p>
                        <p>{item.person}</p>
                        <button onClick={(e) => deleteExpense(item)}>delete</button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Expenses;
