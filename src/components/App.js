import React, {useState, useEffect} from 'react';
import "../styles/App.css";
import Post from './Post';
import {db, auth} from "../configs/firebase";
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser){
        // user has logged in...
        setUser(authUser);    
        console.log(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });
    // performing some clean up actions
    return () => unsubscribe();
  }, [user, username])


  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => { 
      setPosts(snapshot.docs.map(doc => ({ 
        post: doc.data(), 
        id: doc.id
      })));
    });
  }, [posts]);

  const signUp = e => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => authUser.user.updateProfile({displayName: username}))
    .catch(error => alert(error.message));
  }

  const signIn = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => alert(error.message));
    setOpenSignIn(false);  
  }
   
  return (
    <div className="app">
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
           <form className="app__signup">
                <center>
                  <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram logo" className="app__headerImage"/>
                </center>
                <Input placeholder="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <Input placeholder="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <Button onClick={signUp} type="submit">Sign Up</Button>
           </form>
          </div> 
        </Modal>
        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
           <form className="app__signup"> 
                <center>
                  <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram logo" className="app__headerImage"/>
                </center>
                <Input placeholder="email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <Button onClick={signIn} type="submit">Sign In </Button>
           </form>
          </div>
        </Modal>
      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram logo" className="app__headerImage"/>
        {user ? (
          <Button onClick={() => auth.signOut()}>Sign Out</Button>
          ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div> 
      <div className="app__posts">
          <div className="app__postsLeft">
            {posts.map(({post, id}) => (
              <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} key={id} postId={id} user={user} />
            ))}
          </div>
          <div className="app__postsRight">
              <InstagramEmbed
                url='https://www.instagram.com/p/CCf9_yEg0EP/'
                maxWidth={240}
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
              />
          </div>
      </div>
      {user?.displayName ? <ImageUpload username={user.displayName} /> : <h3>Login to upload</h3>}
    </div>
  )
}
