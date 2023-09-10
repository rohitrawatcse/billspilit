import './App.css';
import Chat from './Chat'
import { useEffect, useState } from 'react';
import { Login } from './Login';
import { Room } from './Room';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Leftbar } from './Leftbar';
import { Rightbar } from './Rightbar';
import Signup from './Signup';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import Split from './split';
function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const [user, setUser] = useState(null)
  const [room, setroom] = useState(null)
  const [roomImg, setroomImg] = useState(null)
  const [signup, setSignUp] = useState(false)


  const roomsArr = localStorage.getItem('rooms')

  
  

  useEffect(() => {
    if (localStorage.getItem('user')) {
      if (localStorage.getItem('user') !== 'undefined') {
        setUser(JSON.parse(localStorage.getItem('user')))
      }
    }
    if (localStorage.getItem('room')) {
      setroom(localStorage.getItem('room'))


    }
  },[])
  // console.log(room)

  function setgetuserLogin(e) {
    setUser(e)
    localStorage.setItem('user', JSON.stringify(e))
    const localRooms = getDoc(doc(db, "users", e.uid)).then((doc) => {
      if (doc.exists()) {
        console.log("Document data:", doc.data());
        localStorage.setItem('rooms', JSON.stringify(doc.data().groups))
        localStorage.setItem('room', doc.data().groups[0] )
        setroom(localStorage.getItem('room'))
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
    
  }
  function setgetuserSignup(e) {
    setUser(e)
    localStorage.setItem('user', JSON.stringify(e))
  }
  function handlelogout() {
    setUser(null)
    setroom(null)
    localStorage.removeItem('user')
    localStorage.setItem('rooms', JSON.stringify([]))
    localStorage.removeItem('room')
  }
  function roomfunc(e) {
    setroom(e)
    localStorage.setItem('room', e)
  }
  function roomswitch(item) {
    setroom(item)
    localStorage.setItem('room', item)
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        {
          (!user) ?
            (signup ? <Signup setSignUp={setSignUp} getuser={setgetuserSignup} /> : <Login setSignUp={setSignUp} getuser={setgetuserLogin} />) :
            (room ? (<div className="app__cont">
              <Leftbar photo={user.photoURL} logout={handlelogout} name={user.displayName} roomid={room} email={user.email} switchroom={roomswitch} uid={user.uid} />
              <Chat photo={user.photoURL} logout={handlelogout} name={user.displayName} roomid={room} switchroom={roomswitch} uid={user.uid} />
              <Rightbar photo={user.photoURL} logout={handlelogout} name={user.displayName} roomid={room} switchroom={roomswitch} />
              {/* <Split
              /> */}
            </div>) : <Room roomfunc={roomfunc} photo={user.photoURL} name={user.displayName} setUser={setgetuserSignup} uid={user.uid} />
            )
        }
      </div>
    </ThemeProvider>
  )
}

export default App;
