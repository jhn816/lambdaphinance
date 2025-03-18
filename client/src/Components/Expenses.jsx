import React, { useState, useEffect } from "react";
// import "./css/Expenses.css"
import { Link } from "react-router-dom";

const Expenses = () => {
    const [value, setValue] = useState("");
    const [category, setCategory] = useState("Category");
    const [person, setPerson] = useState("");
    const [gain, setGain] = useState(null);
    const [dropCategory, setDropCategory] = useState(false);

    useEffect( () => {

    }, []);


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
        let gain;
        if (e.target.value === "true") {
            gain = true;
        } else {
            gain = false;
        }
        setGain(gain);
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

    return (
        <div>
            <form onSubmit={addExpense}>
                <div className="expense-inputs">
                    <p>${value || "0"}</p>
                    <input type="text" placeholder="Enter amount..." value={value} onChange={handleChange}
                        onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}/>
                    <button type="button" value="true" onClick={moneySign}> + </button>
                    <button type="button" value="false" onClick={moneySign}> - </button>
                    <div className="dropdownmenu">
                        <button type="button" onClick={dropdownCategory} className="dropbutton">{category}</button>
                        {dropCategory && <div className="categories">
                            <button type="button" onClick={dropdownCategory} value="Groceries">Groceries</button>
                            <button type="button" onClick={dropdownCategory} value="Alcohol">Alcohol</button>
                            <button type="button" onClick={dropdownCategory} value="Brotherhood">Brotherhood</button>
                            <button type="button" onClick={dropdownCategory} value="Rush">Rush</button>
                        </div>}
                    </div>
                    <p>hi {person}</p>
                    <input type="text" placeholder="From/to who (optional)" onChange={(e) => (setPerson(e.target.value))} />

                </div>
                <button type="submit">Add Expense</button>
            </form>
        </div>
    );
};

export default Expenses;
