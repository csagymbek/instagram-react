import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import firebase from "firebase";
import { db, storage } from '../configs/firebase';
import "../styles/ImageUpload.css";

export default function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = e => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image); 
        uploadTask.on("state_changed", snapshot => {
            // progress function logic
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
        }, error => console.log(error),
            // complete function logic
           () => storage.ref("images").child(image.name).getDownloadURL().then(url => {
            //    post image inside db 
            db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption,
                imageUrl: url,
                username
            });
            setProgress(0);
            setCaption("");
            setImage(null);
           }));
    }

    return (
        <div className="imageupload">
            {/* progress bar  */}
            <progress value={progress} max="100" className="imageupload__progress"/>
            {/* caption input  */}
            <input type="text" value={caption} placeholder="Enter a caption..." onChange={e => setCaption(e.target.value)}/>
            {/* file picker  */}
            <input type="file" onChange={handleChange}/>
            {/* post button  */}
            <Button className="imageupload__button" onClick={handleUpload}>Upload</Button>
        </div>
    );
}
