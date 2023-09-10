import { Button, } from '@mui/material'
import React, { useState } from 'react'
import LoginIcon from '@mui/icons-material/Login';
import { db } from './firebase';
import { addDoc, collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
export const Room = (props) => {
  const [roomid, setRoomid] = useState("")


  const roomsArr = localStorage.getItem('rooms')
  const newroomid = roomid 



  const docref = doc(db, "users", props.uid);

  async function savegroup() {
   
        await setDoc(docref, {
            groups: [...JSON.parse(roomsArr), roomid],
            timestamp: serverTimestamp()
        });
    
}

async function handleRoomID() {
  const localRooms = localStorage.getItem('rooms')
  if (!localRooms) {
    localStorage.setItem('rooms', JSON.stringify([roomid]))
  } else {
    localStorage.setItem('rooms', JSON.stringify([...JSON.parse(localRooms), roomid]))
  }
  const q = query(collection(db, roomid), where("alert", "==", true), where("name", "==", props.name));
  const querySnapshot = await getDocs(q);
  let arr = []
  querySnapshot.forEach((doc) => {
    arr.push(doc.id, " => ", doc.data());
  });
  if (arr.length === 0) {
    const msg = `${props.name} joined the chat`;
    await addDoc(collection(db, roomid), {
      alert: true,
      name: props.name,
      text: msg,
      userimg: props.photo,
      timestamp: serverTimestamp(),
      date: new Date().toString()
    });
  }
  props.roomfunc(roomid)

  savegroup()
  
}

  function handleGenerate() {
    const random = new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString() + props.name.slice(0, Math.floor(Math.random() * 4)) + props.photo.slice(9, 10).toString()
    setRoomid(random)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '21px', alignItems: 'center', backgroundColor: '#252329', padding: '83px 56px', borderRadius: '18px', width: '422px' }}>
      <div className="usernameandall" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img style={{ width: '135px', height: '135px', borderRadius: '11px' }} alt={props.name} src={props.photo} />
        <h2 style={{ margin: 'auto', marginTop: '20px', color: 'white', fontFamily: 'Poppins', marginBottom: '10px', fontWeight: '400' }}>{props.name}</h2>
      </div>
      <input placeholder="Enter a room Id" value={roomid}
        style={{ width: '85%', marginTop: '9px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
        onChange={(e) => { setRoomid(e.target.value) }} />
      <div className="btns">

      </div>
      <Button sx={{ fontFamily: 'Poppins', color: 'white', textTransform: 'lowercase', marginTop: '-10px' }} onClick={() => { handleGenerate() }}>Generate one</Button>
      {
        roomid ? (<Button onClick={() => { handleRoomID() }} sx={{ width: "179px", margin: 'auto', fontFamily: 'Poppins', color: 'white', backgroundColor: '#2F80ED', textTransform: 'lowercase' }} >Join Room <LoginIcon style={{ marginLeft: '9px', width: '25px', height: '24px', color: 'white', }}></LoginIcon></Button>) : (<Button disabled sx={{ width: "179px", margin: 'auto', fontFamily: 'Poppins', textTransform: 'lowercase', backgroundColor: '#5c84b8' }}>Join Room <LoginIcon style={{ marginLeft: '9px', width: '25px', height: '24px' }}></LoginIcon></Button>)
      }
      <Button onClick={() => { props.setUser(null) }} style={{ position: 'absolute', bottom: 0, marginTop: '19px', marginLeft: "19px", color: 'white', marginBottom: '21px', textTransform: 'lowercase', fontSize: '14px', fontFamily: 'Poppins' }}>Signout</Button>

    </div>
  )
}
