import React from 'react';
import {Routes, Route} from "react-router-dom";
import LandingPage from "./Auth/LandingPage";
import Register from "./Auth/Register";
import MainPage from "./Pages/MainPage";
import RotatingImages from './Pages/RotatingImages';
import RiV2 from './Pages/RiV2'


function WebPath() {
  return (
  
    <Routes> 
  
      <Route path="/" element={<RiV2 />} /> 
      <Route path="/Register" element={<Register />} /> 
      <Route path="/MainPage" element={<MainPage />} /> 
    
    </Routes>


  );
}
export default WebPath;
