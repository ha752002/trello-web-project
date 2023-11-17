import React from 'react';
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App(props) {
    return (
       <>
           <Router>
               <Routes>
                   <Route path="/" element={<Home/>} />
                   <Route path="/home" element={<Home/>} />
                   <Route path="/login" element={<Login/>} />
               </Routes>
           </Router>
       </>
    );
}

export default App;