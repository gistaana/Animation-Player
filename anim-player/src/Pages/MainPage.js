import React from 'react'; 
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

import NavigationBar from '../Features/NavigationBar';
import mpStyle from '../CSS/MainPage.css';


const MainPage = () => { 
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

    const [userProjects, setUserProjects] = useState([""]);
    const [registeredProjects, setRegisteredProjects] = useState([""]);
    const [projectNum, setProjectNum] = useState('');

    const openAddNewProject = () => {
        setOpenNewProject(true);
    };

    const closeAddNewProject = () => {
        setOpenNewProject(false);
    };

    const handleProjectCard = () => {
      const addedProject = `Name: ${projectName}`;
      setUserProjects([...userProjects, addedProject]);
      setProjectNum(projectNum + 1);
      setProjectName("");
      setDescr("");
    }

    const handleClickProject = (index) => {
      const projectPage = userProjects[index];
      const dataToSend = projectPage;
      localStorage.setItem('currentProject', dataToSend);
      navigate(`/RotatingImages`);
    }

    const fetchProjects = useCallback(async() => { 
      try {
        if (authUser) {
          const userUid = authUser.uid;
          
          const userRef = ref(database, `Users/${userUid}/PROJECTS`);
          const snapshot = await get(userRef); 
          if (snapshot.exists()) { 
            const projects = snapshot.val(); 
    
            let nameOfProject;
              
            nameOfProject = Object.keys(projects); 
            
            setRegisteredProjects(nameOfProject); 
  
            return nameOfProject
          } else {
            console.log('No info found for this user.');
          }
        } else {
          setError('You must be logged in to see projects.');
        }
      } catch (error) {
        
      }
      return [];
    },[authUser, database, setError]);

    const addingProject = async (e) => {
        if (e) {
          e.preventDefault();
        }
    
        if (authUser) {
          
          const userUid = authUser.uid;
    
          update(ref(database, `Users/${userUid}/PROJECTS`), {   
            [projectName]: { Description: descr, Pages: 0 }, 
          })
    
            .then(() => {
              closeAddNewProject();
              localStorage.setItem('currentProject', projectName);
              navigate(`/RotatingImages`);

            })
            .catch((error) => {
              console.error("Error adding Project: ", error);
            });
        } else {
          setError("You must be logged in to add a Project.");
        }
    };

    const loadProjects = async (nameOfProjects) => { 
      if (nameOfProjects) {
        setUserProjects(nameOfProjects);
        setProjectNum(nameOfProjects.length); 
      }
    }

    useEffect(() => {
      const fetchData = async () => {
        const nameOfProject = await fetchProjects();
        await loadProjects(nameOfProject);
      };
    
      fetchData();
    }, [fetchProjects]);
  
 
    return (
    <> 

      <NavigationBar/>
      <Box>
            <Box align = "center">
                <Typography align="center" variant="h2" sx={{ fontWeight: 900, color: "#0066CC" }}>
                    All Projects
                </Typography>
                <Typography textalign="center" variant="h7" sx={{ fontWeight: 600, color: "black" }} gutterBottom>
                     Welcome to Animation Player where your art comes to life ! Please click an existing project you'd like to animate or create a new project !
                </Typography> 
            </Box>
        </Box>

      <Box>        
          {Array.from({ length: projectNum }, (_, index) => (
              <div key={index}>
                  <Card style = {{marginBottom: '49px', marginTop: '49px', cursor: 'pointer', boxshadow:'15',  variant:"outlined" }} > 
                  <Typography gutterBottom variant='h7' component='div' align="center"> </Typography>
                      <CardContent style={{ display: 'flex', flexDirection: 'row' }}>
                    
                          <Grid container spacing={2}>
                              <Grid item xs={14} onClick={handleClickProject.bind(null, index)}>
                                  <Typography variant="h5" color="textSecondary" align = 'center'>
                                    {registeredProjects[index]}
                                  </Typography>
                              </Grid>

              
                          </Grid>
                      </CardContent>
                  </Card>
              </div>
          ))}
      </Box>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <React.Fragment>
          <Button variant="outlined" onClick={openAddNewProject}>
              Add New Project
          </Button>
          <Dialog open={openNewProject} onClose={closeAddNewProject} fullWidth>
              <DialogTitle>Add Project</DialogTitle>

              <DialogContent>
              <DialogContentText>Add Project Name:</DialogContentText>
              <TextField autoFocus margin="dense" id="project" variant="outlined" label="Project Name" type="projectName" fullWidth value={projectName} onChange={(e) => setProjectName(e.target.value)}/>
              <DialogContentText>Add Project Description:</DialogContentText>
              <TextField autoFocus margin="dense" id="description" variant="outlined" label="Project Description" type="descr" fullWidth value={descr} onChange={(e) => setDescr(e.target.value)}/>
              </DialogContent>

              <DialogActions>
                <Button onClick={closeAddNewProject}>Cancel</Button>
                <Button onClick={() => { addingProject(); handleProjectCard()}}>Add</Button>
              </DialogActions>
          </Dialog>
        </React.Fragment>
      </div>
      </div> 
      </>

    );
}

export default MainPage; 