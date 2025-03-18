import './App.css';
import React, { useState } from 'react';
import Home from "./Components/Home.jsx";
import Signup from "./Components/Signup.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";


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
          </Routes>
      </header>
    </div>
    </ Router>
  );
}

export default App;
