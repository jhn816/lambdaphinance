import React, { useState, useEffect } from "react";
import "./css/Expenses.css"
import { Link } from "react-router-dom";

const Expenses = () => {
    const [value, setValue] = useState("0");
    const [category, setCategory] = useState("Category↴");
    const [person, setPerson] = useState("");
    const [gain, setGain] = useState(null);
    const [dropCategory, setDropCategory] = useState(false);
    const [expenseSheet, setExpenseSheet] = useState("Which Expenses ▼");
    const [dropExpense, setDropExpense] = useState(false);


    useEffect( () => {

    }, []);

    const clearExpense = (event) => {
        event.preventDefault();

        setValue("0");
        setCategory("Category↴")
        setGain(true);
        setPerson("");
    }

    const addExpense = (event) => {
        event.preventDefault();

        if (value === "0" || value === "") {
            alert("Please enter a valid amount");
        } else if (gain === null) {
            alert("Please indicate if the expense is positive or negative")
        } else if (category === "Category") {
            alert("Please select a category");
        }
    };

    const handleChange = (e) => {
        let rawValue = e.target.value.replace(/,/g, "");

        if (/^\d*$/.test(rawValue)) {
            setValue(Number(rawValue).toLocaleString());
        }
    };

    const moneySign = (e) => {
        setGain(!gain);
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
                        <h2> Financial Tracker</h2>
                        <button type="button" class="expense-button" onClick={dropdownExpense}>{expenseSheet}</button>
                        {dropExpense && <div className="expense-sheets">
                            <p>Your Expenses</p>
                            <p>Expenses shared with You</p>
                        </div>}
                        
                    </div>
                    <h3>Amount to add:{!gain && "-"}${value || "0"}</h3>
                    <div className="expense-inputs">
                        <div className="dropdownmenu">
                            <button type="button" onClick={dropdownCategory} className="dropbutton">{category}</button>
                            {dropCategory && <div className="categories">
                                <button type="button" onClick={dropdownCategory} value="Groceries">Groceries</button>
                                <button type="button" onClick={dropdownCategory} value="Alcohol">Alcohol</button>
                                <button type="button" onClick={dropdownCategory} value="Brotherhood">Brotherhood</button>
                                <button type="button" onClick={dropdownCategory} value="Rush">Rush</button>
                            </div>}
                        </div>

                        <button type="button" value="true" onClick={moneySign}> + / -</button>
                        <input type="text" placeholder="Enter amount..." value={value} onChange={handleChange}
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
                                <h3>net gain</h3>
                            </header>
                            <p>$0</p>
                        </div>

                        <div className="expense-card">
                            <header>
                                <h3>net loss</h3>
                            </header>
                            <p>$0</p>
                        </div>
                    </div>

                    <div className="balance-card">
                        <header>
                            <h3>total balance</h3>
                        </header>
                        <p>$0</p>
                    </div>

                </div>
            </div>

            <div className="expense-sheet">
                <p>sheet</p>
            </div>
        </div>
    );
};

export default Expenses;
