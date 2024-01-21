import React, { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getStorage,
  deleteObject,
} from "firebase/storage";
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

  const folderName = localStorage.getItem('currentProject'); 

  const imagesListRef = ref(storage, `${folderName}/`);

  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(`${folderName}_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const getFromLocalStorage = (key) => {
    try {
      const storedValue = localStorage.getItem(`${folderName}_${key}`);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error("Error getting from local storage:", error);
      return null;
    }
  };

  const uploadFile = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `${folderName}/${folderName}_${totalImageCount + 1}`);

    try {
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);

      setImageUrls((prevUrls) => [...prevUrls, url]);
      setTotalImageCount((prevCount) => prevCount + 1);

      saveToLocalStorage('imageURLs', [...imageUrls, url]);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const deleteImage = () => {
    const desertRef = ref(storage, `${folderName}/${folderName}_${totalImageCount}`);
    deleteObject(desertRef)
      .then(() => {
        setTotalImageCount((prevCount) => prevCount - 1);
        setImageUrls((prev) => prev.slice(0, -1));

        saveToLocalStorage('imageURLs', imageUrls.slice(0, -1));
      })
      .catch((error) => {
        console.log(error);
      });
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
      const storedImageURLs = getFromLocalStorage('imageURLs');
      if (storedImageURLs) {
        setImageUrls(storedImageURLs);
      } else {
        const response = await listAll(imagesListRef);
        const urls = await Promise.all(
          response.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return url;
          })
        );

        setImageUrls(urls);

        saveToLocalStorage('imageURLs', urls);
      }
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

  useEffect(() => {
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