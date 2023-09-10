import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase';
import './css/Responsive.css'
import toast, { Toaster } from 'react-hot-toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import VideocamIcon from '@mui/icons-material/Videocam';
import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu';
import  {Info} from '@mui/icons-material';



export const Rightbar = (props) => {
    const [showRight, setShowRight] = useState(false)
    const [user, setUser] = useState([])
    const [message, setMessage] = useState([])

    







    const qr = query(collection(db, props.roomid));



    const map = new Map();
    useEffect(
        () => {
            onSnapshot(qr, (snapshot) => setUser(snapshot.docs.map((doc) => [{ name: doc.data().name, img: doc.data().userimg }])))
        }
        , [props.roomid]);
    useEffect(
            () => {
                onSnapshot(qr, (snapshot) => setMessage(snapshot.docs.map((doc) => doc.data())))
            }
            , [props.roomid]);

            // console.log(message);

    user.forEach((item) => {
        map.set(item[0].name, item[0].img);
    })
    let sharedArray = [];

    // console.log(user);
    function menu() {
        if (showRight === false) {
          document.getElementById('showright').style.display = "block"
          document.getElementById('showright').style.position = "absolute"
          document.getElementById('showright').style.left = "15vw"
          setShowRight(!showRight)
        }
        else {
          document.getElementById('showright').style.display = "none"
          setShowRight(!showRight)
        }
      }






    return (
        <>
            <Toaster />
            <div className="hamburger">
        {
          (!showRight) ? (<button onClick={() => { menu() }} style={{ width: 'fit-content', margin: '0', outline: 'none', border: 'none', backgroundColor: 'transparent', cursor: 'pointer',position:'absolute',left:'75vw',color:'white',display:'flex',alignItems:'center' }}>Info  <span> <Info/></span></button>) : (<button onClick={() => { menu() }} style={{ width: 'fit-content', margin: '0', outline: 'none', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'white', position: 'absolute', left: '80vw',top:'1vh' }}><ClearIcon style={{ fontSize: '24px', marginBottom: '-8.85px' }}></ClearIcon></button>)
        }

      </div>


            <div className='rightbar' id='showright' style={{ backgroundColor: '#252329', minWidth: '300px', position: 'relative', height: '100%', flex: '0.17', transition: 'all 0.25s',overflow:'auto'}}>
                <div className="rommspecificidandp" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent:'center', marginTop: '30px',padding:'20px', backgroundColor:'#03336E', margin:'10px', borderRadius:'10px' }}>
                    <p style={{ color: 'white', fontFamily: 'cursive', fontWeight: '500', fontStyle: 'normal', fontSize: '32px', letterSpacing: '-0.035em', marginLeft: '31px', marginRight: '26px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>{props.roomid.length>11?props.roomid.slice(0,10) + '....': props.roomid  }<ContentCopyIcon style={{ fontSize:'32px', marginLeft: '12px', width: '30px', marginBottom: '-1.8px', cursor: 'pointer', color: '#B9B6B6' }} onClick={() => {
                        navigator.clipboard.writeText(props.roomid); toast.success('Room id copied to clipboard', {
                            style: {
                                fontFamily: 'Poppins',
                                fontSize: '12.5px'
                            },
                        });
                    }} /></p>

                </div>
                
               { user&&user.length>0&&
                <div className="sepater" style={{ overflowY: 'auto', maxHeight: '300px', padding:'5px', backgroundColor:'#2D2D2F', margin:'10px', borderRadius:'10px'  }}>
                <h5 className="memheader" style={{fontFamily:'cursive'}}>Members</h5>
                    
                    {
                        Array.from(map, ([key, value]) => {
                            return (
                                <div key={key} className="people" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '16px', marginBottom: '12px' }}>
                                    {/* <FiberManualRecordIcon color="disabled" style={{ width: '10px', marginLeft: '29.99px', marginTop: '1px' }} /> */}
                                    <div className="imagebox" style={{ width: '36px', height: '36px', borderRadius: '100%', marginLeft: '20px' }}>
                                        <img src={value} style={{ width: '34px', height: '34px', borderRadius: '11px' }} alt="" />
                                    </div>
                                    <p style={{ color: '#B9B6B6', marginLeft: '10px', font: 'Montesterrat', fontWeight: '500', fontStyle: 'normal', fontSize: '18px', letterSpacing: '-0.035em' }}>{key}</p>
                                </div>)
                        })
                    }
                </div>}
               { message&&message.length>0&&
                <div className="sepater" style={{overflowY:'auto', maxHeight: '300px', padding:'5px', backgroundColor:'#2D2D2F', margin:'10px', borderRadius:'10px'  }}>
                <h5 className="memheader" style={{fontFamily:'cursive' ,marginBottom:'15px',marginLeft:'12px'}}>Shared Files</h5>
                {
                    message&&message.length>0&&message.map((item)=>{

                    
                    // console.log(sharedArray)
                        {   
                            //image
                            if((item.filetype==="image/jpeg" || item.filetype==="image/png" || item.filetype==="image/jpg")&& !sharedArray.includes(item.text)){
                           sharedArray.push(item.text)
                                return (
                                <a key={item.text} href={item.text} target="_blank" className="chat__body__message" rel="noreferrer" style={{ paddingTop: '0px', textDecoration: 'none', MarginRight: '9px', marginLeft: '10px', marginBottom: '5px', fontSize: '13px'}}>
                                <div className='fileDiv' style={{display:'flex',flexDirection:'row', padding:'5px',backgroundColor:'#3C393F',borderRadius:'10px',width:'90%'}}>

                                <ImageIcon style={{ marginRight: '7.5px', fontSize: '24px', color: 'violet' }}></ImageIcon> <span style={{ marginRight: '7.5px', fontSize: '13px'}} >{item.filename}</span>
                                </div>
                                 </a>
                            
                            )

                            //pdf
                            }else if(item.filetype==="application/pdf" && !sharedArray.includes(item.text) ){
                                sharedArray.push(item.text)
                                return (
                                    <a key={item.text} href={item.text} target="_blank" className="chat__body__message" rel="noreferrer" style={{ paddingTop: '0px', textDecoration: 'none', MarginRight: '9px', marginLeft: '10px', marginBottom: '5px', fontSize: '13px' }}>
                                <div className='fileDiv' style={{display:'flex',flexDirection:'row', padding:'5px',backgroundColor:'#3C393F',borderRadius:'10px',width:'90%'}}>
        
                                <PictureAsPdfIcon style={{ marginRight: '7.5px', fontSize: '24px', color: 'red' }}></PictureAsPdfIcon> <span style={{ marginRight: '7.5px', fontSize: '13px'}}>{item.filename}</span>
                                </div>
                                 </a>
                            
                            )

                            //video
                            }else if(item.filetype==="video/mp4" && !sharedArray.includes(item.text) ){
                                sharedArray.push(item.text)
                                return (
                                    <a key={item.text} href={item.text} target="_blank" className="chat__body__message" rel="noreferrer" style={{ paddingTop: '0px', textDecoration: 'none', MarginRight: '9px', marginLeft: '10px', marginBottom: '5px', fontSize: '13px' }}>
                                <div className='fileDiv' style={{display:'flex',flexDirection:'row', padding:'5px',backgroundColor:'#3C393F',borderRadius:'10px',width:'90%'}}>
                            
                                <VideocamIcon style={{ marginRight: '7.5px', fontSize: '24px', color: 'pink' }}></VideocamIcon> <span style={{ marginRight: '7.5px', fontSize: '13px'}}>{item.filename}</span>
                                 </div>
                                 </a>

                            
                            )

                            //audio
                            }else if(item.filetype==="audio/mpeg" && !sharedArray.includes(item.text)){
                                sharedArray.push(item.text)
                                return (
                                    
                                    <a key={item.text} href={item.text} target="_blank" className="chat__body__message" rel="noreferrer" style={{ paddingTop: '0px', textDecoration: 'none', MarginRight: '9px', marginLeft: '10px', marginBottom: '5px', fontSize: '13px' }}>
                                <div className='fileDiv' style={{display:'flex',flexDirection:'row', padding:'5px',backgroundColor:'#3C393F',borderRadius:'10px',width:'90%'}}>

                                <LibraryMusicIcon style={{ marginRight: '7.5px', fontSize: '24px', color: 'teal' }}></LibraryMusicIcon> <span style={{ marginRight: '7.5px', fontSize: '13px'}}>{item.filename}</span>
                                 </div>
                                 </a>
                            
                            )




                            }

                                        
                        }

                    })
                }
                
                </div>  
}



            </div>
        </>
    )
}
