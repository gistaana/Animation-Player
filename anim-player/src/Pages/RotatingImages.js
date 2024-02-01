import React, { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getStorage,
  deleteObject,
} from "firebase/storage";
import {
    doc,
    setDoc,
    getDocs,
    orderBy,
    getFirestore,
    serverTimestamp, 
    collection,
    query,
    deleteDoc,
    limit
} from "firebase/firestore";
import { Box, DialogContent, DialogContentText } from "@mui/material";
import NavigationBar from '../Features/NavigationBar';
import { Typography, Card, CardContent } from "@mui/material";
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const RotatingImages = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [totalImageCount, setTotalImageCount] = useState(0);
  const [intervals, setIntervals] = useState(1);
  const [imgWidth, setWidth] = useState(700);
  const [imgHeight, setHeight] = useState(503);
  const storage = getStorage();
  const firestore = getFirestore();

  const folderName = localStorage.getItem('currentProject'); 

  const imagesListRef = ref(storage, `${folderName}/`);

  const uploadFile = async () => {
    if (imageUpload == null) return;

    const imageName = `${folderName}_${totalImageCount + 1}`;

    // Set the document name explicitly using doc function
    const projRef = doc(collection(firestore, folderName), imageName);

    const imageRef = ref(storage, `${folderName}/${imageName}`);

    try {
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);    // Saves to database while getting the the Download URL
      const currTime = serverTimestamp();

      setImageUrls((prevUrls) => [...prevUrls, url]);      // array of added urls in order of upload time
      setTotalImageCount((prevCount) => prevCount + 1);

      await setDoc(projRef, {
        URL: url,
        Time: currTime
      });
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};


const deleteImage = async () => {
  const imageName = `${folderName}_${totalImageCount}`;
  const desertRef = ref(storage, `${folderName}/${imageName}`);
  const projRef = doc(collection(firestore, folderName), imageName);

  try {
      // Delete the image from storage
      await deleteObject(desertRef);

      // Delete the document from Firestore
      await deleteDoc(projRef);

      setTotalImageCount((prevCount) => prevCount - 1);
      setImageUrls((prev) => prev.slice(0, -1));
  } catch (error) {
      console.log(error);
  }
};

  const play = () => {
    setAnimation(true);
  }

  const pause = () => {
    setAnimation(false);
  }

  const firstPage = () => {
    setCurrentImageIndex(0);
  }

  const lastPage = () => {
    setCurrentImageIndex(totalImageCount - 1);
  }

  const countImages = async () => {
    const response = await listAll(imagesListRef);
    return response.items.length;
  };

  const fetchImageUrls = async () => {
    try {
      const response = await getDocs(
        query(collection(firestore, folderName), orderBy("Time", "asc"))
      );
      const urls = response.docs.map((doc) => doc.data().URL);
      setImageUrls(urls);
      
    } catch (error) {
      console.error("Error fetching image URLs:", error);
    }
  };

  useEffect(() => {
    fetchImageUrls();
  }, [totalImageCount]);

  useEffect(() => {
    const fetchImageCount = async () => {
      const totalCount = await countImages();
      setTotalImageCount(totalCount);
    };

    fetchImageCount();
  }, []);

  useEffect(() => {       // rotates the images around in order, can be stopped by setting animation either true or false
    if (animation) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
      }, intervals * 1000);

      return () => clearInterval(interval);
    }
  }, [imageUrls, animation]);

  console.log(imageUrls);

  return (
    <>
      <NavigationBar /> 
        <Box align="center" mb={3}>
          <Typography align="center" variant="h2" sx={{ fontWeight: 900, color: "#0066CC" }}>
              {folderName}
          </Typography>
          <Typography textalign="center" variant="h7" sx={{ fontWeight: 600, color: "black", mb: 3 }} gutterBottom>
            Note: It is good practice to pause the animation before making changes/exiting the page
          </Typography>
        </Box>
      
  
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3 }}>
        <div className="App">
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
  
          <button onClick={uploadFile}> Upload Image</button>
          <button onClick={play}> Play</button>
          <button onClick={pause}> Pause</button>
          <button onClick={deleteImage}> Delete Last Image</button>
          <button onClick={firstPage}> First Page</button>
          <button onClick={lastPage}> Last Page</button>
  
          <DialogContent>
            <DialogContentText>Change Intervals</DialogContentText>
            <TextField autoFocus margin="dense" id="intervals" variant="outlined" label="seconds" type="intervals" fullWidth value={intervals} onChange={(e) => setIntervals(e.target.value)} />
          </DialogContent>
  
          <div>Total Images: {totalImageCount}</div>
          <Box sx={{ border: 1 }} gridColumn="span 3" gridRow="span 3" p="30px">
            {imageUrls.map((url, index) => (
              <img
                width={imgWidth} height={imgHeight}
                key={index}
                src={url}
                style={{ display: index === currentImageIndex ? "block" : "none" }}
              />
            ))}
          </Box>
  
          <DialogContent>
            <DialogContentText>Change Width</DialogContentText>
            <TextField autoFocus margin="dense" id="imgWidth" variant="outlined" label="px" type="imgWidth" fullWidth value={imgWidth} onChange={(e) => setWidth(e.target.value)} />
  
            <DialogContentText>Change Height</DialogContentText>
            <TextField autoFocus margin="dense" id="imgHeight" variant="outlined" label="px" type="imgHeight" fullWidth value={imgHeight} onChange={(e) => setHeight(e.target.value)} />
          </DialogContent>
        </div>
      </div>
    </>
  );
}
export default RotatingImages;