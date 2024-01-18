import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./Firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Authenticate from './Authenticate';
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import {Button, CssBaseline, TextField, FormControlLabel, Checkbox, Paper,Box,Grid,Typography, Alert, AlertTitle  } from '@mui/material';
import '../CSS/Register.css'

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [passwordConfirm, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false) 

    const database = getDatabase();

    let navigate = useNavigate();
    const { authUser } = Authenticate(); 

    const signUp = async (e) => { 
        e.preventDefault(); 

        if (password !== passwordConfirm) { //checking if entered in password and confirmed password matches 
            return setError("Passwords do not match")
        }

        setError("")
        setLoading(true)

        createUserWithEmailAndPassword(auth, email, password)
          .then( async (userCredential) => { 
            console.log(userCredential);// returns a promise to wait until resovled and get back user credentials
            const user = userCredential.user; 
            try {
                set(ref(database, 'Users/' + user.uid), {  // adds user information to realtime database
                    Username: displayName,
                    Email: email,
                })

                console.log("Successfully Added Account!");

              } catch (e) {
                console.error("Error registering Account!: ", e);
              }

            navigate("/")
          }) 
          .catch((error) => {
            console.log(error.message);
            setError(error.message);
          });
          setLoading(false)
      };

  return (
    <>
        <Grid sx={{ height: '100vh'}} container component="main">
        <CssBaseline />
        
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box  sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Typography component="h2" variant="h4">
              Register
            </Typography>
            {error && <Alert variant="danger">{error}</Alert>}
            <Box sx={{ mt: 1 }} component="form" onSubmit={signUp}>

              <TextField value = {email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" 
                         name="email" label="Email Address" margin="normal" autoComplete="email" autoFocus required fullWidth /> 

              <TextField value = {displayName} onChange={(e) => setDisplayName(e.target.value)} id="displayName" type="displayName"
                         label="Username" margin="normal" autoFocus required fullWidth/> 

              <TextField value = {password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" 
                         name="password" label="Password"  margin="normal" required fullWidth/> 

              <TextField value = {passwordConfirm} onChange={(e) => setConfirmPassword(e.target.value)} id="passwordConfirm" type="password"
                         name="passwordConfirm" label="Confirm Password"  margin="normal" autoFocus required fullWidth sx={{ mb: 3 }}/>

              <Button className="butn" type="submit" variant="contained" fullWidth sx={{ mb: 3 }}>
                Register
              </Button>
              <Grid item>
                <div >
                  Existing Account? <Link to="/"> Login</Link>
                </div>
              </Grid>
            </Box>
          </Box>
        </Grid>  
        <Grid className="picture" item xs={false} sm={4} md={7} />
      </Grid>

    </>
    );
};

export default Register;