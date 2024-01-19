import React from 'react';
import {Routes, Route} from "react-router-dom";
import LandingPage from "./Auth/LandingPage";
import Register from "./Auth/Register";
import MainPage from "./Pages/MainPage";

function WebPath() {
  return (
  
    <Routes> 
  
      <Route path="/" element={<LandingPage />} /> 
      <Route path="/Register" element={<Register />} /> 
      <Route path="/MainPage" element={<MainPage />} /> 
      
    </Routes>


  );
}
export default WebPath;
