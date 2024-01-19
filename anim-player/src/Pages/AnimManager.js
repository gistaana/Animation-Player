/*import React from 'react'; 
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from "react-router-dom";

import Authenticate from '../Auth/Authenticate';
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getFirestore, collection, doc, setDoc, updateDoc } from "firebase/firestore";

import { Box, Typography, Card, CardContent } from "@mui/material";
import {  Stack, Grid, Paper } from '@mui/material'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//import { imageDb } from './Config';
import { getDownloadURL, listAll, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

const AnimManager = () => {

    const navigate = useNavigate();
    const database = getDatabase();
    const firestore = getFirestore();
    const { authUser } = Authenticate(); 
    const [error, setError] = useState("");

    const [projectName, setProjectName] = useState("");
    const [descr, setDescr] = useState("");
    const [animPage, setAnimPage] = useState("");
    const [pageNum, setPageNum] = useState("");

    const [openNewProject, setOpenNewProject] = React.useState(false);
    const [openNewPage, setOpenPage] = React.useState(false);
    const [pageTitle, setPageTitle] = useState("Add new Page to Project");

    const [image, setImage] = useState(null);


    const AddingPage = async (e) => {
        if (e) {
          e.preventDefault();
        }
    
        if (authUser) {   
          const userUid = authUser.uid; 
    
          const projectRef = ref(database, `Users/${userUid}/PROJECTS/${projectName}`);  
          
          get(projectRef) 
            .then((snapshot) => {
              if (snapshot.exists()) {
    
                const projectDocRef = doc(collection(firestore, userUid), projectName);
                  updateDoc(projectDocRef, {
                    [pageNum] : animPage
                  })
    
                .then(() => {
                  closeAddNewPage();
                  setProjectName("");
                  setAnimPage("");
                  setPageNum("");
                })
                .catch((error) => {
                  console.log("Error: ", error);
                  setError("Project doesn't exist: " + error.message);
                });
              } else {
                setPageTitle("Project doesn't exist, Try again.")
              }
            })
            .catch((error) => {
              console.log("Error: ", error);
              setError("Error");
            });
        } else {
          setError("You must be logged in to add a page.");
        }
      };


      const fileUpload = () => {

      };


  return (
  
    <h1>hello</h1>

  );
}

export default AnimManager;


<div>
        <React.Fragment align='center'>
          <Button  align= "center" variant="outlined" onClick={openAddNewPage}>
              Add Page to Project
          </Button>
          <Dialog open={openNewPage} onClose={closeAddNewPage} fullWidth>
              <DialogTitle>{pageTitle}</DialogTitle>

              <DialogContent>

                <input type="file" onChange={(event) => {
                  setImage(event.target.files[0])          
                }}
                />

                <DialogContentText>Project Name:</DialogContentText>
                <TextField autoFocus margin="dense" id="project" variant="outlined" label="Project Name" type="projectName" fullWidth value={projectName} onChange={(e) => setProjectName(e.target.value)}/>
                <DialogContentText>Page URL:</DialogContentText>
                <TextField autoFocus margin="dense" id="page" variant="outlined" label="URL" type="animPage" fullWidth value={animPage} onChange={(e) => setAnimPage(e.target.value)}/>
                <DialogContentText>Page Number:</DialogContentText>
                <TextField autoFocus margin="dense" id="num" variant="outlined" label="#" type="pageNum" fullWidth value={pageNum} onChange={(e) => setPageNum(e.target.value)}/>
              </DialogContent>
              
              <DialogActions>
                <Button onClick={closeAddNewPage}>Cancel</Button>
                <Button onClick={() => { AddingPage(); }}>Add</Button>
              </DialogActions>
          </Dialog>
        </React.Fragment>
      </div>
      
      
      
      const openAddNewPage = () => {
        setOpenPage(true);
    };
  
    const closeAddNewPage = () => {
        setPageTitle("Add new Page to Project")
        setOpenPage(false);
    };*/
