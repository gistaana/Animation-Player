import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./Firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import {Button, CssBaseline, TextField, FormControlLabel, Checkbox, Paper,Box,Grid,Typography, Alert, AlertTitle  } from '@mui/material'; 
import '../CSS/LandingPage.css'; 

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();

  //Log into user account with firebase function
  const signIn = async (e) => { //e passes the event from the form 

    e.preventDefault(); //page doesn't reload after submission 
    setError("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => { 
        console.log(userCredential); // returns a promise to wait until resovled and get back user credentials 

        // const user = userCredential.user; 

        navigate("/MainPage")//going to MySensorsPage
      }) 
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };


  return (
    <> 
      <Grid sx={{ height: '100vh'}} container component="main">
        <CssBaseline />
        <Grid className="picture" item xs={false} sm={4} md={7} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box  sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Typography component="h2" variant="h4">
              Welcome to Animation Player!
            </Typography>
            {error && <Alert variant="danger">{error}</Alert>}
            <Box sx={{ mt: 1 }} component="form" onSubmit={signIn}>
              <TextField value = {email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" 
                         name="email" label="Email Address" margin="normal" autoComplete="email" autoFocus required fullWidth />
              <TextField value = {password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" 
                         name="password" label="Password"  margin="normal" required fullWidth sx={{ mb: 3 }}/>
              <Button className="butn" type="submit" variant="contained" fullWidth sx={{ mb: 3 }}>
                Log In
              </Button>
              <Grid item>
                <div >
                  New to Animaton Player? <Link to="/Register"> Register</Link>
                </div>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </> 
  )
}

export default Login