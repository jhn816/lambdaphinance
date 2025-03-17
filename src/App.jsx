import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Home from "./Components/Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
          <Home loggedIn={loggedIn} />
      </header>
    </div>
  );
}

export default App;
