import React, { useEffect, useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import { collection, limit, onSnapshot, orderBy, query, getDocs, serverTimestamp, addDoc, updateDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './css/Responsive.css'
import toast, { Toaster } from 'react-hot-toast';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

export const Leftbar = (props) => {

  const [show, setShow] = useState(false)
  const [user, setUser] = useState([])
  const [currRoom, setcurrRoom] = useState(props.roomid);
  const [latestMessage, setlatestMessage] = useState('Click to See Messages')
  const qr = query(collection(db, props.roomid));
  const [open, setOpen] = React.useState(false);
  const [filtered, setFiltered] = useState([])
  const [openAdd, setOpenAdd] = React.useState(false);
  const [showReload, setshowReload] = useState(true)

  

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const map = new Map();
  useEffect(
    () => {
      onSnapshot(qr, (snapshot) => setUser(snapshot.docs.map((doc) => [{ name: doc.data().name, img: doc.data().userimg }])))
      // onSnapshot(qr, (snapshot) => setlatestMessage(snapshot.docs.map((doc) => doc.data().text).slice(-1)[0]))
      loadgroup()
    }
    
    , [props.roomid]);
    
  user.forEach((item) => {
    map.set(item[0].name, item[0].img);
  })

  function menu() {
    if (show === false) {
      document.getElementById('showleft').style.display = "block"
      setShow(!show)
    }
    else {
      document.getElementById('showleft').style.display = "none"
      setShow(!show)
    }
  }
  const roomsArr = localStorage.getItem('rooms')
  const [newroomid, setNewRoomid] = useState('')

  const docref = doc(db, "users", props.uid);
  async function loadgroup() {
   
        const docSnap = await getDoc(docref);
        if (docSnap.exists()) {
            localStorage.setItem('rooms', JSON.stringify(docSnap.data().groups))
        } else {
            console.log('No such document!');
        }
}

  async function savegroup() {
   
        await setDoc(docref, {
            groups: [...JSON.parse(roomsArr), newroomid],
            timestamp: serverTimestamp()
        });
    
}

async function updateLocal() {
    if (!newroomid) return toast.error('invalid room id')
    if (JSON.parse(roomsArr).includes(newroomid)) return toast.error('room already exists')
    
    localStorage.setItem('rooms', JSON.stringify([...JSON.parse(roomsArr), newroomid]))
    await addDoc(collection(db, newroomid), {
      alert: true,
      name: props.name,
      text: props.name + ' Joined ' + newroomid,
      userimg: props.photo,
      timestamp: serverTimestamp(),
      date: new Date().toString()
    }).then(() => {
      toast.success(`Group ${newroomid} added successfully`)
      }).catch((error) => {
        toast.error('Error adding room')
        });
    setNewRoomid('')
    props.switchroom(newroomid)
    setcurrRoom(newroomid)
    savegroup()
    handleCloseAdd()
  }

  function setFilter(text) {
    setFiltered(JSON.parse(roomsArr).filter(item => item.toLowerCase().includes(text.toLowerCase())))
    console.log(filtered);
  }

  return (
    <div style={{zIndex:'99'}}>
      <Toaster />
      <div className="hamburger">
        {
          (!show) ? (<button onClick={() => { menu() }} style={{ width: 'fit-content', margin: '0', outline: 'none', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}><MenuIcon style={{ margin: '0', fontSize: '22px', marginBottom: '-6.15px', color: 'white', marginLeft: '-4.95px' }} ></MenuIcon></button>) : (<button onClick={() => { menu() }} style={{ width: 'fit-content', margin: '0', outline: 'none', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'white', position: 'absolute', left: '60vw' }}><ClearIcon style={{ fontSize: '28px',padding:'5px' }}></ClearIcon></button>)
        }

      </div>
      <div className='leftbar' id='showleft' style={{ backgroundColor: '#252329', minWidth: '330px', position: 'relative', height: '100%', flex: '0.17', transition: 'all 0.25s' }}>
        <div className="channelheader" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '52px', borderBottom: '1px solid rgb(35 35 35)' }}>
          
           <p style={{ fontSize: '16px', marginLeft: '34px', fontWeight: 'bold' }}> Rooms</p><div onClick={() => { handleClickOpenAdd() }} style={{ marginLeft: 'auto', marginRight: '20px', backgroundColor: '#252329', padding: '5px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', cursor: 'pointer' }}><AddIcon className='addBtn' /></div>

           
          
        </div>
        <Dialog PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "480px!important",
          }, style: { borderRadius: '11px' }
        }} open={openAdd} onClose={handleCloseAdd}>
          <div style={{ backgroundColor: '#252329' }}>
            <DialogTitle>Add Room</DialogTitle>
            <DialogContent>
              <input
                style={{ width: '92%', marginTop: '18px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
                placeholder="Enter roomid"
                value={newroomid} onChange={e => setNewRoomid(e.target.value)} 
              />

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAdd} style={{ fontFamily: 'Poppins' }}>Cancel</Button>
              <Button onClick={() => updateLocal()} style={{ fontFamily: 'Poppins' }}>Add</Button>
            </DialogActions>
          </div>

        </Dialog>
        
          

            <div className="people" style={{ display: 'flex', flexDirection: 'column', marginTop: '16px', marginBottom: '12px', marginLeft: '28.59px', overflow: 'scroll', height: '88vh' }}>
              <div className="searchbox" style={{ backgroundColor: '#3C393F', width: '90%', borderRadius: '8px', padding: '3.5px 0px', marginBottom: '22px', marginTop: '15px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <SearchIcon sx={{ marginLeft: '12px' }} />
                <input onChange={e => setFilter(e.target.value)} style={{ border: 'none', outline: 'none', padding: '10px 15px', backgroundColor: 'transparent', color: 'white' }} type="text" placeholder='Search' />
              </div>
              {
                roomsArr && filtered.length === 0 && JSON.parse(roomsArr).map(item => (
                 
                  console.log(item),
                  currRoom===item?
                  <div onClick={() => { props.switchroom(item);setcurrRoom(item)}} key={item} style={{ width:'80%',display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '5px',marginBottom: '5px',padding:'15px',backgroundColor:'#0156BD', cursor: 'pointer',borderRadius:'15px',boxShadow:'-32px -32px 50px -5px rgba(0,0,0,0.1),32px 31px 50px -5px rgba(0,0,0,0.1)',transitionDuration:'200ms' }}>
                    <div style={{backgroundColor:'#0169E5', padding: '11px 18px', borderRadius: '50%', marginRight: '15px', fontSize: '15px',boxShadow:'-8px -6px 33px 16px rgba(0,0,0,0.1),12px 15px 32px -5px rgba(0,0,0,0.1)' }} className="box">{item.slice(0, 1)}</div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <p style={{ fontSize: '17px' }}>{item.length>15?item.slice(0,10) + '....': item  }</p>
                      {/* <p style={{ fontSize: '13px',color:'#B9B6B6'}}>{latestMessage}</p> */}
                    </div>

                    </div>
                    
                    :
                    <div onClick={() => { props.switchroom(item);setcurrRoom(item)}}  key={item} style={{ width:'80%',display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '5px',marginBottom: '5px',padding:'15px',backgroundColor:'#3C393F', cursor: 'pointer',borderRadius:'15px',boxShadow:'-32px -32px 50px -5px rgba(0,0,0,0.1),32px 31px 50px -5px rgba(0,0,0,0.1)',transitionDuration:'200ms' }}>
                    <div style={{backgroundColor:'#0169E5', padding: '11px 18px', borderRadius: '50%', marginRight: '15px', fontSize: '15px',boxShadow:'-8px -6px 33px 16px rgba(0,0,0,0.1),12px 15px 32px -5px rgba(0,0,0,0.1)' }} className="box">{item.slice(0, 1)}</div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <p style={{ fontSize: '17px' }}>{item.length>15?item.slice(0,10) + '....': item  }</p>
                      <p style={{ fontSize: '13px',color:'#7C7C7C'}}>{latestMessage}</p>
                    </div> 
                    </div>
                    
                ))
              }
              {
                filtered.map(item => (
                  currRoom===item?
                  <div onClick={() => { props.switchroom(item);setcurrRoom(item)}} key={item} style={{ width:'80%',display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '5px',marginBottom: '5px',padding:'15px',backgroundColor:'#0156BD', cursor: 'pointer',borderRadius:'15px',boxShadow:'-32px -32px 50px -5px rgba(0,0,0,0.1),32px 31px 50px -5px rgba(0,0,0,0.1)',transitionDuration:'200ms' }}>
                    <div style={{backgroundColor:'#0169E5', padding: '11px 18px', borderRadius: '50%', marginRight: '15px', fontSize: '15px',boxShadow:'-8px -6px 33px 16px rgba(0,0,0,0.1),12px 15px 32px -5px rgba(0,0,0,0.1)' }} className="box">{item.slice(0, 1)}</div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <p style={{ fontSize: '17px' }}>{item.length>15?item.slice(0,10) + '....': item  }</p>
                      {/* <p style={{ fontSize: '13px',color:'#B9B6B6'}}>{latestMessage}</p> */}
                    </div>                    
                    </div>
                    :
                    <div onClick={() => { props.switchroom(item);setcurrRoom(item)}}  key={item} style={{ width:'80%',display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '5px',marginBottom: '5px',padding:'15px',backgroundColor:'#3C393F', cursor: 'pointer',borderRadius:'15px',boxShadow:'-32px -32px 50px -5px rgba(0,0,0,0.1),32px 31px 50px -5px rgba(0,0,0,0.1)',transitionDuration:'200ms' }}>
                    <div style={{backgroundColor:'#0169E5', padding: '11px 18px', borderRadius: '50%', marginRight: '15px', fontSize: '15px',boxShadow:'-8px -6px 33px 16px rgba(0,0,0,0.1),12px 15px 32px -5px rgba(0,0,0,0.1)' }} className="box">{item.slice(0, 1)}</div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <p style={{ fontSize: '17px' }}>{item.length>15?item.slice(0,10) + '....': item  }</p>
                      <p style={{ fontSize: '13px',color:'#7C7C7C'}}>{latestMessage}</p>
                    </div>
                    </div>
                ))
              }
            </div>

            
           
        

        <div className="userdetails" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: '0px', height: '57px', backgroundColor: '#0B090C', width: '100%', borderTop: '1px solid rgb(22 21 21)' }}>
          <img src={props.photo} style={{ width: '35px', height: '35px', borderRadius: '11px', marginLeft: '24px', marginTop: '-1.0px' }} alt="" />
          <div style={{display:'flex' , flexDirection:'column'}}>

          <h4 style={{ marginLeft: '12px', font: 'Noto Sans', fontWeight: '500', fontStyle: 'normal', fontSize: '18px', letterSpacing: '-0.035em', zIndex: '99', color: '#C4C1C1' }}>{props.name}</h4>
          <h5 style={{ marginLeft: '12px', font: 'Noto Sans',fontFamily:'cursive', fontWeight: '500', fontStyle: 'normal', fontSize: '14px', letterSpacing: '-0.035em', zIndex: '99', color: '#828282' }}>{props.email}</h5>
          </div>
          <button onClick={() => { handleClickOpen() }} style={{ cursor: 'pointer', width: 'fit-content', marginLeft: '270px', outline: 'none', border: 'none', backgroundColor: 'transparent', position: 'absolute', left: '29px', marginTop: '4px' }}><LogoutIcon style={{ width: '20.2px', color: 'white' }}></LogoutIcon></button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              style: { borderRadius: '11px' }
            }}
          >
            <DialogTitle id="alert-dialog-title" sx={{ fontFamily: 'Poppins' }}>
              Logout
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" sx={{ fontFamily: 'Poppins' }}>
                Are you sure , do you want to logout
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button sx={{ fontFamily: 'Poppins', color: 'white' }} onClick={() => props.logout()}>yes</Button>
              <Button sx={{ fontFamily: 'Poppins', color: 'white' }} onClick={handleClose} autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
