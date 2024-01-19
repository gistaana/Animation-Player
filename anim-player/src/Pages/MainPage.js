import React from 'react'; 
import Authenticate from '../Auth/Authenticate';

const MainPage = () => { 
    const { authUser } = Authenticate(); 

    if (authUser) {
        const userUid = authUser.uid;
        const userName = authUser.userName

        console.log(userUid);
    }
 
    return (
    
        <h1>hello</h1>

    );
}

export default MainPage; 