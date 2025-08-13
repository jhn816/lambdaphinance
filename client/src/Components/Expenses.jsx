import React, { useState, useEffect } from "react";
import "./css/Expenses.css"
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal.jsx";

import HelloChart from "./ExpenseCharts.jsx";

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
    const [editingExpense, setEditingExpense] = useState(null);
    
    const [deletedItem, setDeletedItem] = useState(null);
    const [sortExpense, setSortExpense] = useState("Sort By:");
    const [dropSort, setDropSort] = useState(false);

    const [netGain, setNetGain] = useState(0);
    const [netLoss, setNetLoss] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    
    const [allExpenses, setAllExpenses] = useState([]);

    const [allCollections, setAllCollections] = useState([]);


    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");

    const [showModal, setShowModal] = useState("none");
    const [errors ,setErrors] = useState([]);

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
            getUserCollections(result.user.email);
            getUserExpenses(expenseSheet);
        })
    }, [token, navigate, expenseSheet]);

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
            if (expenseSheet === "Choose Expenses ▼") {
                setExpenseSheet(result.collections[0].collectionName);
            }
            let current_collection = result.collections.find(item => item.collectionName === expenseSheet);
            try {
                setNetGain(current_collection.netGain)
                setNetLoss(current_collection.netLoss)
                setTotalBalance(current_collection.totalBalance);
            } catch (error) {
                return;
            }
        }) .catch((error) => {
            console.error("Error:", error);
        });
    };

    const getUserExpenses = (expenseSheet) => {
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
            setAllExpenses(result.expenses);
        }) .catch((error) => {
            console.error("Error:", error);
        });
    };

    const addExpense = (event) => {
        event.preventDefault();

        if (expenseSheet === "Create New +") {
            errors.push("a collection");
        }
        if (category === "Category↴") {
            errors.push("a category");
        }
        if (value === "0" || value === "") {
            errors.push("a valid amount");
        }
        if (errors.length > 0) {
            setShowModal("error");
            return;
        }

        const timestamp = Date.now();
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
          });

        const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true // remove if you want 24-hour format
        });

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
                formattedTimestamp: `${formattedDate} ${formattedTime}`,
            })
        }).then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            getUserExpenses(expenseSheet);
            getUserCollections(email);
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
            console.log(item);
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
                savedPerson,
                email
            })
        }) .then((res) => res.json())
        .then ((result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            getUserExpenses(expenseSheet);
            getUserCollections(email);
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
                email
            })
        }) .then((res) => res.json() )
        .then( (result) => {
            if (result.error) {
                console.log(result.error);
                return;
            }
            getUserExpenses(expenseSheet);
            getUserCollections(email);
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

    const handleMoneyChange = (setter) => (e) => {
        const raw = String(e.target.value).replace(/[^0-9.]/g, "");   // strip anything not 0-9 or .
        if ((raw.match(/\./g) || []).length > 1) return;              // only one dot
        if (/^\d*\.?\d{0,2}$/.test(raw)) setter(raw);                 // max 2 decimals
    };

    const handleSavedChange = (e) => {
        const raw = String(e.target.value);
      
        if (raw === "-") { setSavedValue(raw); return; }
      
        if (/^-?\d*\.?\d{0,2}$/.test(raw)) {
          setSavedValue(raw);
        }
      };

    const selectCollection = (e) => {
        setExpenseSheet(e.target.value);
    }

    const submitCollection = (collectionName) => {
        if (collectionName === "") {
            alert("Please enter a collection name");
            return;
        }

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
            } else if (result.message === "Collection with that name already exists") {
                alert("Collection with that name already exists");
                return;
            }
            setExpenseSheet(collectionName);
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
        setEditingExpense(null);
        setDropSort(false);
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
        setDropSort(false);
        setDropCategory(false);
    }

    const selectSort = (e) => {
        let sort = e.target.value;
        setDropSort(!dropSort);
        setSortExpense(sort);
        setAllExpenses(prev => {
            const arr = [...prev];
        
            if (sort === "Category (A to Z)") {
              arr.sort((a,b) => (b.category || "").localeCompare(a.category || ""));
            } else if (sort === "Value (H to L)") {
              arr.sort((a,b) => Number(a.value) - Number(b.value));
            } else if (sort === "From/To (A to Z)") {
              arr.sort((a,b) => (b.person || "").localeCompare(a.person || ""));
            } else if (sort === "Time (Latest)") {
              arr.sort((a,b) => new Date(b.date || b.formattedTimestamp) - new Date(a.date || a.formattedTimestamp));
            } else if (sort === "Time (Oldest)") {
              arr.sort((a,b) => new Date(a.date || a.formattedTimestamp) - new Date(b.date || b.formattedTimestamp));
            }
            return arr;
          });
        
          setEditingExpense(null);
          setDropCategory(false);
    }

    return (
        <div className="expense-page">
            <div className="add-container">
                <div className="tracker-headers">
                    {(expenseSheet === "Choose Expenses ▼" || expenseSheet === "Create New +") ? ( <h4> Finance Book</h4>) : (<h4> {expenseSheet} Finance Book</h4>)}
                </div>
                <div className="tracker-content">
                    <div className="left-add">
                        <p className="header-collection" style={{borderTop:"0px"}}>Your Collections</p>
                        <div className="your-collection">
                            <div className="expense-sheets">
                                <div className="scroll-collection">
                                    <button type="button" value="Create New +" onClick={() => setShowModal("create")}>Create New +</button>
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
                        <form onSubmit={addExpense} style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                            <div className="expense-amount">
                                <h3 style={{fontSize:"20px"}}>Amount to add:</h3>
                                <div className="amount-box">
                                    <input 
                                        type="text" 
                                        placeholder="Enter amount..." 
                                        value={value ? `$${value}` : ""} 
                                        onChange={handleMoneyChange(setValue)} 
                                        maxLength={9} 
                                        style={{color: gain ? "green" : "red"}}
                                        onKeyDown={(e) => {
                                            if (["e","E","+","-"].includes(e.key)) e.preventDefault();
                                            if (e.key === "." && e.currentTarget.value.includes(".")) e.preventDefault();
                                          }}
                                    />
                                </div>
                                </div>

                            <div className="expense-inputs">
                                <div className="dropdownmenu">
                                    <button type="button" onClick={dropdownCategory} className="customize-expense">{category}</button>

                                    {dropCategory && <span className="categories">
                                        <button type="button" onClick={dropdownCategory} value="Groceries">Groceries</button>
                                        <button type="button" onClick={dropdownCategory} value="Alcohol">Alcohol</button>
                                        <button type="button" onClick={dropdownCategory} value="Brotherhood">Brotherhood</button>
                                        <button type="button" onClick={dropdownCategory} value="Fundraiser">Fundraiser</button>
                                        <button type="button" onClick={dropdownCategory} value="Dues">Dues</button>
                                        <button type="button" onClick={dropdownCategory} value="Open">Open</button>
                                        <button type="button" onClick={dropdownCategory} value="Misc.">Misc.</button>
                                    </span>}
                                </div>

                                <button type="button" value="true" className="customize-expense" onClick={() => setGain(!gain)} style={{width:"45%"}}> + / -</button>
                            </div>
                            
                            <div className="expense-inputs" style={{marginTop:"0px"}}>
                                <input type="text" placeholder="From/to who (optional)" value={person} onChange={(e) => (setPerson(e.target.value))} maxLength={15} />
                            </div>
                            
                            <div className="form-buttons">
                                <button type="button" onClick={clearExpense} className="class-clear">Clear Expense</button>
                                <button type="submit" className="class-submit">Add Expense</button>
                            </div>
                        
                        </form>

                        <span style={{borderTop:"1px solid gray"}}/>
                        <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", margin:"5px", padding:"15px 20px 15px 20px",  backgroundColor: "rgb(55, 92, 167)", borderRadius:"20px", filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.10))"}}>
                                <h4 style={{margin:"0px", color:"white", fontSize:"22px"}}>Balance</h4>
                                <p style={{margin:"0px", color:"white", fontSize: "28px"}}>${totalBalance ? totalBalance.toFixed(2) : "0.00"}</p>
                            </div>  
                            
                            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", margin:"5px", padding:"15px 20px 15px 20px",  backgroundColor: "rgb(96 176 96)", borderRadius:"20px", filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.10))"}}>
                                <h4 style={{margin:"0px", color:"white", fontSize:"20px"}}>Income</h4>
                                <p style={{margin:"0px", color:"white", fontSize: "28px"}}>${netGain ? netGain.toFixed(2) : "0.00"}</p>
                            </div>

                            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", margin:"5px", padding:"15px 20px 15px 20px",  backgroundColor: "rgb(205 73 78)", borderRadius:"20px", filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.10))"}}>
                                <h4 style={{margin:"0px", color:"white", fontSize:"20px"}}>Expenses</h4>
                                <p style={{ margin:"0px", color:"white", fontSize: "28px"}}>${netLoss ? netLoss.toFixed(2) : "0.00"}</p>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="transaction-information">
            <div className="expense-sheet">
                    <div className="transaction-chart">
                        <div className="sheet-headers">
                            <p className="date-expense">All Transactions</p>
                            <p className="sort-dropdown">
                                <button className="sort-expense" onClick={selectSort} value="Sort By:"> {sortExpense}</button>
                                {dropSort && <span className="sort-dropmenu">
                                    <button type="button" onClick={selectSort} value="Time (Latest)"> Time (Oldest)</button>
                                    <button type="button" onClick={selectSort} value="Time (Oldest)"> Time (Latest)</button>
                                    <button type="button" onClick={selectSort} value="Category (A to Z)"> Category (A to Z)</button>
                                    <button type="button" onClick={selectSort} value="Value (H to L)"> Value (High to Low)</button>
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
                            
                            {allExpenses.slice().reverse().map((item, index) => (
                                <div key={index} className="expense-row" style={{ display:"flex", justifyContent:"space-between", borderBottom: index !== allExpenses.length - 1 ? "1px solid gray" : "0px", margin:"0px 15px 0px 15px"}}>
                                    { (editingExpense !== item._id) ? (
                                        <>
                                        <div className="transaction-category-time-stamp" style={{display:"flex", flexDirection:"column", width:"70%", textAlign:"left", margin:"15px"}}>
                                            {item.value < 0? (<p style={{margin:"0px", fontSize:"18px", fontWeight:"1000"}}>Payment to {item.person}</p>) : (<p style={{margin:"0px", fontSize:"18px", fontWeight:"1000"}}> Payment from {item.person}</p>) }
                                            <p style={{margin:"0px", fontSize:"14px"}}className="date-expense">{item.date || "none"}</p>
                                            <p style={{margin:"0px", fontSize:"14px"}}className="date-expense">{item.category}</p>
                                        </div>
                                        {item.value < 0 ? (<p style={{color:"rgb(205 73 78)", margin:"0px 35px 0px 35px", display:"flex", alignItems:"center", fontSize:"22px", width:"25%", justifyContent:"flex-end"}}>{String(item.value).replace('-', '-$')}</p>) : (
                                            <p style={{color:"rgb(96 176 96)", margin:"0px 35px 0px 35px", display:"flex", alignItems:"center", fontSize:"22px", width:"25%", justifyContent:"flex-end"}}>+${item.value}</p>
                                        ) }

                                        <button onClick={(e) => {editExpense(item); setDropCategory(false); setDropSort(false); setSavedDropCategory(false);}} style={{fontSize:"16px", border:"1px solid gray", width:"125px", borderRadius:"10px", padding:"5px 10px 5px 10px", transition:".3s", margin:"15px"}} className="transaction-edit">Edit</button>

                                        </>
                                    ):(
                                        <>  
                                            <div className="transaction-category-time-stamp" style={{display:"flex", flexDirection:"column", gap:"5px", textAlign:"left", margin:"15px 0px 15px 15px"}}>
                                                <input value={savedPerson} onChange={(e) => setSavedPerson(e.target.value)} maxLength={15}/>
                                                <p style={{margin:"0px", fontSize:"14px"}}className="date-expense">{item.date || "none"}</p>
                                            </div>
                                            <div className="dropdown-menu" style={{fontSize:"0px"}}>
                                                <button type="button" onClick={dropdownSavedCategory} className="customize-expense" style={{width:"100px"}}>{savedCategory}</button>
                                                {dropSavedCategory && <span className="categories" style={{width:"100px"}}>
                                                    <button type="button" onClick={dropdownSavedCategory} value="Groceries">Groceries</button>
                                                    <button type="button" onClick={dropdownSavedCategory} value="Alcohol">Alcohol</button>
                                                    <button type="button" onClick={dropdownSavedCategory} value="Brotherhood">Brotherhood</button>
                                                    <button type="button" onClick={dropdownSavedCategory} value="Fundraisers">Fundraisers</button>
                                                    <button type="button" onClick={dropdownSavedCategory} value="Dues">Dues</button>
                                                    <button type="button" onClick={dropdownSavedCategory} value="Open">Open</button>
                                                    <button type="button" onClick={dropdownSavedCategory} value="Misc.">Misc.</button>
                                                </span>}
                                            </div>
                                            <input 
                                                style={{width:"70px"}}
                                                type="text" 
                                                value={savedValue} 
                                                onChange={handleSavedChange}
                                                onKeyDown={(e) => {
                                                    if (["e","E","+"].includes(e.key)) e.preventDefault();
                                                    if (e.key === "." && e.currentTarget.value.includes(".")) e.preventDefault();
                                                  }}
                                                maxLength={9}
                                                step="0.01" 
                                                min="0" 
                                                placeholder="Enter amount..."
                                            />
                                            
                                            <div className="edit-dropdown">
                                                {editingExpense === item._id && 
                                                    <div className="edit-menu">  
                                                        <button className="edit-cancel" type="button" onClick={() => setEditingExpense(null)}>Cancel</button>
                                                        <button className="edit-save" type="button" onClick={() => (saveExpense(item))}>Save</button>
                                                        <button className="edit-delete" onClick={() => {setShowModal("delete"); setDeletedItem(item)}}>Delete </button>
                                                    </div>}
                                            </div>
                                        </> 
                                    )}             
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="transaction-sheet">
                    <div className="transaction-data-block">
                            <div className="transaction-data-header" style={{height:"25%"}}>
                                <p>Recent Revenue/Spending</p>
                            </div>
                            <div className="transaction-data" style={{height:"75%"}}> 
                                <HelloChart expenses={allExpenses} type={"gainloss"} />
                            </div>
                    </div>
                    <div className="transaction-data-block">
                            <div className="transaction-data-header" style={{height:"25%"}}>
                            <p>Net Income in Each Month</p>
                            </div>
                            <div className="transaction-data" style={{height:"75%"}}> 
                                <HelloChart expenses={allExpenses} type={"total"} />
                            </div>
                    </div>
                    <div className="transaction-data-block">
                            <div className="transaction-data-header" style={{height:"25%"}}>
                                <p>Spending in Each Category</p>
                            </div>
                            <div className="transaction-data" style={{height:"75%"}}> 
                                <HelloChart expenses={allExpenses} type={"category"} />
                            </div>
                    </div>
                </div>
            </div>
            {showModal === "delete" && 
            <Modal 
                header={"Confirm deletion?"}
                content={"Deleting this content is permanent and cannot be recovered."} 
                type={"YesNo"}
                onClose={() => setShowModal("none")}
                onAnswer={(confirm) =>  {
                    if (confirm) {
                        deleteExpense(deletedItem);
                    } 
                    setShowModal("none")
                }}
            />
            }

            {showModal === "create" && 
            <Modal 
                header={"Create a Collection Name"}
                content={"This can always be changed later."} 
                type={"Create"}
                onClose={() => setShowModal("none")}
                onAnswer={(collectionName) =>  submitCollection(collectionName)}
            />
            }

            {showModal === "error" && 
            <Modal 
                header={"An Expense needs to have..."}
                content={errors} 
                type={"Okay"}
                onClose={() => {setShowModal("none"); setErrors([])}}
                onAnswer={(collectionName) =>  submitCollection(collectionName)}
            />
            }
        </div>
    );
};

export default Expenses;
