import { Avatar } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { db } from '../configs/firebase';
import "../styles/Post.css";
import firebase from "firebase"; 

export default function Post({username, imageUrl, caption, postId, user}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => doc.data()));
            });
        }
        return () => unsubscribe();
    }, [postId])

    const postComment = e => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    }

    return (
        <div className="post">
           {/* header */}
           {/* avatar and username  */}
           <div className="post__header">
                <Avatar className="post__avatar" alt="Oliver Sykes" src="https://avatars.dicebear.com/api/:sprites/:seed.svg" />
                <h3>{username}</h3>
           </div>
           {/* post image */}
           <img src={imageUrl} alt="" className="post__image"/>

           {/* username and caption  */}
           <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
           {/* comment section form  */}
            <div className="post__coments">
                {
                    comments.map(comment => (
                        <p><strong>{comment.username}</strong> {comment.text}</p>
                    )) 
                }
            </div>
            {user && (
                <form className="post__commentBox">
                    <input type="text" placeholder="Add a comment..." className="post__input" onChange={e => setComment(e.target.value)} value={comment}/>
                    <button type="submit" onClick={postComment} className="post__button" disabled={!comment}>Post</button>
                </form>
            )}
        </div>
    )
} 
