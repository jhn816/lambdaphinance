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

    //save expense arguments
    const [savedValue, setSavedValue] = useState(0);
    const [savedCategory, setSavedCategory] = useState(null);
    const [savedPerson, setSavedPerson] = useState("");
    const [dropSavedCategory, setSavedDropCategory] = useState(false);

    // drop down menu
    const [dropCategory, setDropCategory] = useState(false);
    const [expenseSheet, setExpenseSheet] = useState("Choose Expenses ▼");
    const [dropExpense, setDropExpense] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [sortExpense, setSortExpense] = useState("Sort By:");
    const [dropSort, setDropSort] = useState(false);

    const [netGain, setNetGain] = useState(0);
    const [netLoss, setNetLoss] = useState(0);
    
    const [changedExpenses, setChangedExpenses] = useState(false);
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
                localStorage.removeItem("token");
                navigate("/");
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
        }) .catch((error) => {
            console.error("Error:", error);
        });
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
            setSortExpense("Sort By:");
            setNetLoss(0);
            setNetGain(0);
            setAllExpenses(result.expenses);
        }) .catch((error) => {
            console.error("Error:", error);
        });
    }, [changedExpenses, expenseSheet])

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
        } else if (category === "Category↴") {
            alert("Please select a category");
            return;
        }else if (value === "0" || value === "") {
            alert("Please enter a valid amount");
            return;
        }

        const timestamp = Date.now();
        const date = new Date(timestamp);
        const formattedTimestamp = date.toLocaleString()

        const finalPerson = person.trim() === "" ? "None" : person;

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
                person: finalPerson,
                formattedTimestamp,
            })
        }).then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            setChangedExpenses(!changedExpenses);
            setValue("");
            setCategory("Category↴")
            setGain(true);
            setPerson("")
            console.log("Expense saved successfully", result.expense);
        })
        .catch(error => console.error("Error:", error));
    }

    const editExpense = (item) => {
        if (editingExpense === item._id) {
            setEditingExpense(null);
            setSavedDropCategory(false);
            setSavedCategory("");
            setSavedValue(0);
            setSavedPerson("");
        } else {
            setEditingExpense(item._id);
            setSavedCategory(item.category);
            setSavedValue(item.value);
            setSavedPerson(item.person);
        }
    };

    const saveExpense = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expense`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                savedID: item._id,
                savedCategory,
                savedValue,
                savedPerson
            })
        }) .then((res) => res.json())
        .then ((result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            setChangedExpenses(!changedExpenses);
            console.log("Expense updated successfully", result.expense);
        })
        setEditingExpense(null)
    }
    

    const deleteExpense = (item) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/expense`, {
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
            setChangedExpenses(!changedExpenses);
            if (result.expense.deletedCount == 1) {
                console.log("message",result.message);
                console.log("deletedExpense",result.expense);
            }
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
        if (collectionName === "") {
            alert("Please enter a collection name");
            return;
        }
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

    const dropdownSavedCategory = (e) => {
        if (dropSavedCategory === false) {
            let dropSavedCategory = true;
            setSavedDropCategory(dropSavedCategory);
        } else {
            if (e.target.value) {
                let savedCategory = e.target.value;
                setSavedCategory(savedCategory);

            }
            let dropSavedCategory = false;
            setSavedDropCategory(dropSavedCategory);
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

    const selectSort = (e) => {
        let sort = e.target.value;
        setDropSort(!dropSort);
        setSortExpense(sort);

        if (sort === "Category (A to Z)") {
            const sortExpenses = allExpenses.sort ( (a,b) => a.category.localeCompare(b.category));
            setAllExpenses(sortExpenses);
        } else if (sort === "Value (L to H)") {
            const sortExpenses = allExpenses.sort ( (a,b) => a.value - b.value);
            setAllExpenses(sortExpenses);
        } else if (sort === "From/To (A to Z)") {
            const sortExpenses = allExpenses.sort ( (a,b) => a.person.localeCompare(b.person));
            setAllExpenses(sortExpenses);
        }  else if (sort === "Time (Latest)") {
            const sortExpenses = allExpenses.sort ( (a,b) => new Date(b.date) - new Date(a.date));
            setAllExpenses(sortExpenses);
        }  else if (sort === "Time (Oldest)") {
            const sortExpenses = allExpenses.sort ( (a,b) => new Date(a.date) - new Date(b.date));
            setAllExpenses(sortExpenses);
        }    
    }

    return (
        <div className="expense-page">
            <div className="add-container">
                <div className="tracker-headers">
                    {(expenseSheet === "Choose Expenses ▼" || expenseSheet === "Create New +") ? ( <h4> Finance Book</h4>) : (<h4> {expenseSheet} Finance Book</h4>)}
                    <div className="dropdownmenu">
                        {expenseSheet === "Create New +" && <div className="collection-sheets"> 
                            <input placeholder="Enter Collection Name..." onChange={(e) => (setCollectionName(e.target.value))} maxLength={10}/>
                            <button type="button" onClick={submitCollection}>Create</button>
                            <button type="button" onClick={selectCollection} value="Choose Expenses ▼">Cancel</button>
                        </div>}
                    </div>
                </div>
                <div className="tracker-content">
                    <div className="left-add">
                        <p className="header-collection">Your Collections</p>
                        <div className="your-collection">
                            <div className="expense-sheets">
                                <div className="scroll-collection">
                                    <button type="button" value="Create New +"onClick={selectCollection}>Create New +</button>
                                    {allCollections.map((item ,index) => (
                                        <button key={index} type="button" value={item.collectionName} onClick={selectCollection}>{item.collectionName}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <p className="header-collection">Shared with You</p>
                        <div className="your-collection">
                            <div className="expense-sheets">
                                <div className="scroll-collection">

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right-add">
                        <form onSubmit={addExpense}>
                            <div className="expense-amount">
                                <h3>Amount to add:</h3>
                            </div>
                            <div className="expense-amount">
                                <div className="amount-box">
                                    { gain ? ( <h3 style={{ color: "green" }}> ${value || "0"} </h3> )
                                    : <h3 style={{ color: "red" }}> -${value || "0"} </h3>}
                                </div>
                            </div>

                            <div className="expense-inputs">
                                <div className="dropdownmenu">
                                    <button type="button" onClick={dropdownCategory} className="customize-expense">{category}</button>

                                    {dropCategory && <span className="categories">
                                        <button type="button" onClick={dropdownCategory} value="Groceries">Groceries</button>
                                        <button type="button" onClick={dropdownCategory} value="Alcohol">Alcohol</button>
                                        <button type="button" onClick={dropdownCategory} value="Brotherhood">Brotherhood</button>
                                        <button type="button" onClick={dropdownCategory} value="Rush">Rush</button>
                                    </span>}
                                </div>

                                <button type="button" value="true" className="customize-expense" onClick={() => setGain(!gain)}> + / -</button>
                            </div>

                            <div className="expense-inputs">
                                <input type="text" placeholder="Enter amount..." value={value} onChange={handleChange} maxLength={6}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}/>
                            </div>
                            
                            <div className="expense-inputs">
                                <input type="text" placeholder="From/to who (optional)" value={person} onChange={(e) => (setPerson(e.target.value))} />
                            </div>
                            
                            <div className="form-buttons">
                                <button type="submit" className="class-submit">Add Expense</button>
                                <button type="button" onClick={clearExpense} className="class-clear">Clear Expense</button>
                            </div>
                        
                        </form>
                        <div className="expense-information">
                            <div className="net-expenses">
                                <div className="expense-card">
                                    <header style={{"background-color":"#c9ffd1"}}>
                                        <h3>Net Gain</h3>
                                    </header>
                                    <p style={{ color: "green", "font-family": "Arial, Helvetica, sans-serif"}}>${netGain}</p>
                                </div>

                                <div className="expense-card">
                                    <header style={{"background-color":"#ffc9c9"}}>
                                        <h3>Net Loss</h3>
                                    </header>
                                    <p style={{ color: "red", "font-family": "Arial, Helvetica, sans-serif"}}>${netLoss}</p>
                                </div>  
                            </div>
                            <div className="balance-card">
                                    <header>
                                        <h3>Total Balance</h3>
                                    </header>
                                    <p style={{"font-family": "Arial, Helvetica, sans-serif"}}>${netGain}{" - $"}{netLoss}{" = $"}{netGain - netLoss}</p>
                                </div>  
                        </div>
                    </div>
                </div>
            </div>

            <div className="expense-sheet">
                <div className="sheet-headers">
                    <p className="date-expense">Date</p>
                    <p>Category</p>
                    <p>Value</p>
                    <p>From/To</p>
                    <p className="sort-dropdown">
                        <button className="sort-expense" onClick={selectSort} value="Sort By:"> {sortExpense}</button>
                        {dropSort && <span className="sort-dropmenu">
                            <button type="button" onClick={selectSort} value="Time (Latest)"> Time (Latest)</button>
                            <button type="button" onClick={selectSort} value="Time (Oldest)"> Time (Oldest)</button>
                            <button type="button" onClick={selectSort} value="Category (A to Z)"> Category (A to Z)</button>
                            <button type="button" onClick={selectSort} value="Value (L to H)"> Value (Low to High)</button>
                            <button type="button" onClick={selectSort} value="From/To (A to Z)"> From/To (A to Z)</button>
                        </span>
                        }
                    </p>
                </div>
                <div className="scroll-chart">
                    {expenseSheet === "Choose Expenses ▼" ? 
                        (<h3> Select a Collection of Expenses</h3>) :
                    (<>
                        {allExpenses.length === 0 && <p>No Expenses Found</p>}
                    </>) }
                    
                    {allExpenses.map((item, index) => (
                        <div key={index} className="expense-row">
                            { (editingExpense !== item._id) ? (
                                <>
                                <p className="date-expense">{item.date || "none"}</p>
                                <p>{item.category}</p>
                                {item.value < 0 ? (<p style={{color:"red"}}>${item.value}</p>) : (
                                    <p style={{color:"green"}}>${item.value}</p>
                                ) }
                                <p>{item.person}</p>
                                </>
                            ):(
                                <>
                                    <p className="date-expense">{item.date || "none"}</p>
                                    <div className="save-category-dropdown">
                                        <button type="button" onClick={dropdownSavedCategory} className="saved-category">{savedCategory}</button>
                                        {dropSavedCategory && <span className="save-category-menu">
                                            <button type="button" onClick={dropdownSavedCategory} value="Groceries">Groceries</button>
                                            <button type="button" onClick={dropdownSavedCategory} value="Alcohol">Alcohol</button>
                                            <button type="button" onClick={dropdownSavedCategory} value="Brotherhood">Brotherhood</button>
                                            <button type="button" onClick={dropdownSavedCategory} value="Rush">Rush</button>
                                        </span>}
                                    </div>
                                    <input type="number" value={savedValue} onChange={(e) => setSavedValue(e.target.value)} />
                                    <input value={savedPerson} onChange={(e) => setSavedPerson(e.target.value)}/>
                                </> 
                            )}             
                        <div className="edit-dropdown">    
                            <button onClick={(e) => editExpense(item)} className="edit-expense">Edit</button>
                            {editingExpense === item._id && (
                                <div className="edit-menu">  
                                    <button className="edit-delete" onClick={() => deleteExpense(item)}>Delete </button>
                                    <button className="edit-save" type="button" onClick={() => (saveExpense(item))}>Save</button>
                                    <button className="edit-cancel" type="button" onClick={() => setEditingExpense(null)}>Cancel</button>
                                </div>
                            )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Expenses;
