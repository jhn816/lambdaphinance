import './App.css';
import React, { useState } from 'react';
import Home from "./Components/Home.jsx";
import Signup from "./Components/Signup.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Expenses from "./Components/Expenses.jsx"
import Records from "./Components/Records.jsx"
import Plan from "./Components/Plan.jsx"
import Profile from "./Components/Profile.jsx"
import About from "./Components/About.jsx"

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
    <div className="App">
      <header className="App-header">
      {localStorage.getItem("token") && <Navbar />}
          <Routes>
            <Route path="/" element= {<Home loggedIn={loggedIn} />}/>
            <Route path="/register" element= {<Signup />}/>

            {/* Navigation Bar */}
            <Route path="/expenses" element= {<Expenses />}/>
            <Route path="/records" element= {<Records />}/>
            <Route path="/plan" element= {<Plan />}/>

            <Route path="/about" element= {<About />}/>
            <Route path="/profile" element= {<Profile />}/>

          </Routes>
      </header>
    </div>
    </ Router>
  );
}

export default App;
