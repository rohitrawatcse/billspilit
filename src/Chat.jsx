import React, { useEffect } from 'react';
import './css/chatbox.css'
import './css/chatpage.css'
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { db, storage } from './firebase';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, LinearProgress, Snackbar } from '@mui/material';
import Navbar from './Navbar'
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import VideocamIcon from '@mui/icons-material/Videocam';
import { red, teal } from '@mui/material/colors';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import './css/Responsive.css'
import ReactTimeAgo from 'react-time-ago'
import Split from './split';
import cryptoRandomString from 'crypto-random-string';




function Chat(props) {
    const [input, setInput] = useState("")
    const [message, setMessage] = useState([])
    const [uploading, setUploading] = useState(false)
    const [isSplit, setisSplit] = useState(false)
    const [splitAmount, setSplitAmount] = useState()
    const [splitTitle, setSplitTitle] = useState("")
    const [type, setType] = useState("text")
    const [members, setmembers] = useState([])
    const [updatedmembers, setupdatedmembers] = useState([])

    const [splitUsers, setSplitUsers] = useState([])
    const [splitUsersName, setSplitUsersName] = useState([])
    const [splitUsersPhoto, setSplitUsersPhoto] = useState([])
    const docId = cryptoRandomString({length: 10, type: 'base64'});


    // const q = query(collection(db, "messages"), orderBy('timestamp', 'asc'));
    const qr = query(collection(db, props.roomid), orderBy('timestamp', 'asc'));
    // const q1 = query(collection(db, "messages"),where(documentId(),'==', '3PPly1FEJjtJntqPEFAb'));
    // const document=doc(db, "messages", "153yJtULNbDsTSRSfdCR");
    // getDoc(document).then((e)=>{
    //     console.log(e.data());
    // })
    const [open, setOpen] = React.useState(true);
    const [openAdd, setOpenAdd] = React.useState(false);

    const map = new Map();


    useEffect(
        () => {
            onSnapshot(qr, (snapshot) => setupdatedmembers(snapshot.docs.map((doc) => [{ name: doc.data().name, img: doc.data().userimg }])))
            

        }
        , [props.roomid]);
    useEffect(
        () => {
            let membersArray = Array.from(map, ([name, img]) => ({ name, img }));
            // console.log(membersArray)            

        }
        , [updatedmembers]);

        updatedmembers.forEach((item) => {
            map.set(item[0].name, item[0].img);
        })

        
        // useEffect(() => {
        //     setupdatedmembers(members.filter((e) => e[0].name !== props.name))
        // }, [members])

        // let array = [...new Set(updatedmembers.map((e) => e[0].name))];
        // console.log(array)

        // array.map((e) => {
        //     if (e !== props.name) {
        //         map.set(e, updatedmembers.find((i) => i[0].name === e)[0].img)
        //     }
        // })


        // updatedmembers&&updatedmembers.length>0&&{
                    
                    
        //                 Array.from(map, ([key, value]) => {
                            
        //                         // setupdatedmembers([...updatedmembers, { name: key, img: value }])
        //                         // <div key={key} className="people" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '16px', marginBottom: '12px' }}>
        //                         //     {/* <FiberManualRecordIcon color="disabled" style={{ width: '10px', marginLeft: '29.99px', marginTop: '1px' }} /> */}
        //                         //     <div className="imagebox" style={{ width: '36px', height: '36px', borderRadius: '100%', marginLeft: '20px' }}>
        //                         //         <img src={value} style={{ width: '34px', height: '34px', borderRadius: '11px' }} alt="" />
        //                         //     </div>
        //                         //     <p style={{ color: '#B9B6B6', marginLeft: '10px', font: 'Montesterrat', fontWeight: '500', fontStyle: 'normal', fontSize: '18px', letterSpacing: '-0.035em' }}>{key}</p>
        //                         // </div>
        //                         console.log(key)
        //                         console.log(value)

                                
        //                 })
        //             }

       let membersArray = Array.from(map, ([name, img]) => ({ name, img }));
    //    console.log(membersArray)
                        // console.log(updatedmembers)
                        // setupdatedmembers(membersArray)
                        // console.log(updatedmembers)
                    
               

           

    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseSplit = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(true);
    };
    

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
        handleClick()
    };
    function inputhandler(e) {
        setInput(e.target.value)
    }

    useEffect(
        () => {
            onSnapshot(qr, (snapshot) => setMessage(snapshot.docs.map((doc) => doc.data())))
        }
        , [props.roomid]);
    useEffect(() => {
        updateScroll()
    }, [message])
    async function sendMessage() {
        if (input) {
            const msg = input;
            setInput("")
            await addDoc(collection(db, props.roomid), {
                name: props.name,
                text: msg,
                userimg: props.photo,
                timestamp: serverTimestamp()
            });
        }
    }

    const handleCheck = (event) => {
        // console.log(event.target.id)
        // setSplitUsers([...splitUsers, event.target.value])
        event.target.checked ? setSplitUsers([...splitUsers, event.target.value]) : setSplitUsers(splitUsers.filter((e) => e !== event.target.value))
        event.target.checked ? setSplitUsersName([...splitUsersName, event.target.name]) : setSplitUsersName(splitUsersName.filter((e) => e !== event.target.name))
        event.target.checked ? setSplitUsersPhoto([...splitUsersPhoto, event.target.id]) : setSplitUsersPhoto(splitUsersPhoto.filter((e) => e !== event.target.id))
    };


    async function sendSplitMsg() {
        if (splitTitle && splitAmount && splitUsersName.length!==0 && splitUsersPhoto.length!==0 ) { 
        const title = splitTitle;
        const amount = splitAmount;
        const usersname = splitUsersName;
        const usersphoto = splitUsersPhoto;
        const splitBy = props.name;
        const usersPaid = 0;
        // setSplitTitle("")
        // setSplitAmount(0)
        await addDoc(collection(db, props.roomid), {
            id: docId,
            name: props.name,
            // text: msg,
            splitTitle: title,
            splitAmount: amount,
            userimg: props.photo,
            timestamp: serverTimestamp(),
            splitUsersName: usersname,
            splitUsersPhoto: usersphoto,
            splitBy: splitBy,
            usersPaid: usersPaid,
            // splitUsers: splitUsers,

        });
        setisSplit(true)
        setSplitTitle("")
        setSplitAmount()
        setSplitUsers([])
        setSplitUsersName([])
        setSplitUsersPhoto([])
        handleCloseAdd()

    }
    else if(splitUsersName.length===0 && splitUsersPhoto.length===0){
        toast.error('Please select atleast one user', {
            duration: 1200,
            position: 'top-center',
            style: {    
                fontFamily: 'Poppins',
                fontSize: '12.5px',
                color: '#fff',
                background: '#f44336',
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            }
        })
    }

    else if(splitTitle==="" || splitAmount===""){
        toast.error('Please fill all the fields', {
            duration: 1200,
            position: 'top-center',
            style: {
                fontFamily: 'Poppins',
                fontSize: '12.5px',
                color: '#fff',
                background: '#f44336',
                borderRadius: '5px',
                padding: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            }
        })
    }

    }
    function updateScroll() {
        var element = document.getElementById("custom");
        element.scrollTop = element.scrollHeight;
    }
    function handlefiles(e) {
        // console.log(e.target.files[0]);
        setType("file")
        if (e.target.files[0].type === "image/png" || e.target.files[0].type === "application/pdf" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "video/mp4" || e.target.files[0].type === "audio/mpeg") {
            upload(e.target.files[0]);
        }
        else {
            toast.error('Unsupported file format', {
                duration: 1200,
                position: 'top-center',
                style: {
                    fontFamily: 'Poppins',
                    fontSize: '12.5px'
                },
            });
        }
    }
    function handleEnterButton(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    }
    function upload(file) {
        const storageRef = ref(storage, 'files/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        setUploading(true);
        toast('Uploading your file ...', {
            icon: '⏳',
            duration: 2000,
            position: 'top-center',
        });
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const msg = downloadURL;
                    sendfile()
                    setUploading(false)
                    async function sendfile() {
                        await addDoc(collection(db, props.roomid), {
                            name: props.name,
                            text: msg,
                            userimg: props.photo,
                            timestamp: serverTimestamp(),
                            filename: file.name,
                            filetype: file.type
                        });
                    }
                    toast.success('Done uploading', {
                        duration: 1200,
                        position: 'top-center',
                        style: {
                            fontFamily: 'Poppins',
                            fontSize: '12.5px'
                        },
                    });
                });
            }
        );
    }
    // console.log(props.uid)
    // console.log(members);
    // console.log(updatedmembers);
    // console.log(splitUsers);
    // console.log(splitUsersName);
    // console.log(splitUsersPhoto);

    return (
        <div className='chatbox'>
            <Toaster />
            <div className="chat__header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Navbar roomid={props.roomid} roomImg={props.roomImg}></Navbar>
            </div>
            <div className="uploadprogress">
                {
                    uploading ? (<LinearProgress sx={{ height: '1px' }} />) : (<></>)
                }
            </div>

            <div className="chat__body" id="custom">
                {
                    message.map((item, index) => {
                        return (<div key={index}>
                            {
                                (item.alert === true) ? (
                                    (Math.abs(Date.parse(item.date) - Date.parse(new Date().toString())) < 3000) ?
                                        (item.name !== props.name) ?
                                            <Snackbar
                                                open={open}
                                                autoHideDuration={2500}
                                                onClose={handleClose}
                                                message={item.text}
                                                sx={{ fontFamily: 'Poppins' }}
                                            /> : <></> : <></>

                                ) :
                                    <div className="messageboxcont">
                                        <div className="imgbox" >
                                            <img className='imgboximg' src={item.userimg} alt="" style={{ marginTop: '23px' }} />
                                        </div>
                                        <div className="messagebox">

                                            {


                                                <><div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <p className='fontemmm' style={{ fontSize: '16px', marginBottom: '2px', marginLeft: '1px' }}>{item.name}</p>
                                                    <div className="timestamp" style={{ marginLeft: '11.25px', marginBottom: '-2px' }}>
                                                        <p className='tieemmm' style={{ fontSize: '11.5px', color: '#828282', lineHeight: '25px', letterSpacing: '-0.035em', fontFamily: 'Poppins' }}>{item.timestamp ?
                                                            <ReactTimeAgo date={Date.parse(item.timestamp.toDate())} locale="en-US" /> : <></>}</p>


                                                    </div>

                                                </div>

                                                    {/* {<Split splitTitle={item.splitTitle} splitAmount={item.splitAmount} />} */}



                                                </>
                                            }

                                            {/* hjsgdbsfsf */}
                                            {/* {type==="text" ? <div>
                                                text
                                            </div>
                                                : type==="file" ? <div>
                                                file
                                            </div>
                                                    : type==="split" ? <div>
                                                        split
                                                        </div>
                                                        : <></>} */}


                                            {/* jhdsdhsjdsd */}

                                            {/* <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <p className='fontemmm' style={{fontSize:'16px',marginBottom:'2px' ,marginLeft:'1px'}}>{item.name}</p>
                                                <div className="timestamp" style={{ marginLeft: '11.25px', marginBottom: '-2px' }}>
                                                    <p className='tieemmm' style={{ fontSize: '11.5px', color: '#828282', lineHeight: '25px', letterSpacing: '-0.035em', fontFamily: 'Poppins' }}>{
                                                        item.timestamp ?
                                                            <ReactTimeAgo date={Date.parse(item.timestamp.toDate())} locale="en-US" /> : <></>
                                                    }</p>
                                                </div>

                                            </div> */}

                                            {
                                                item.text ? (

                                                    <div className="file" style={{ border: '0px solid #616161', padding: '2px 2px', marginTop: '5px', overflowX: 'auto', zIndex: '99', minWidth: 'inherit', padding: '15px', backgroundColor: '#0073FF', borderRadius: '15px' }}>
                                                        <a key={index} href={item.text} target="_blank" className="chat__body__message" rel="noreferrer" style={{ paddingTop: '0px', textDecoration: 'none', MarginRight: '9px', marginLeft: '-3px', marginBottom: '-3px', fontSize: '13px' }}>
                                                            {

                                                                (item.filetype === "image/png" || item.filetype === "image/jpg" || item.filetype === "image/jpeg") ? (
                                                                    <ImageIcon style={{ marginRight: '7.5px', fontSize: '24px', color: 'white' }}></ImageIcon>
                                                                ) : (<></>)
                                                            }
                                                            {

                                                                (item.filetype === "application/pdf") ? (
                                                                    <PictureAsPdfIcon sx={{ color: red[500] }} style={{ marginRight: '7.5px', fontSize: '24px' }}></PictureAsPdfIcon>
                                                                ) : (<></>)
                                                            }
                                                            {

                                                                (item.filetype === "audio/mpeg") ? (
                                                                    <LibraryMusicIcon sx={{ color: teal[500] }} style={{ marginRight: '7.5px', fontSize: '24px' }}></LibraryMusicIcon>
                                                                ) : (<></>)
                                                            }
                                                            {

                                                                (item.filetype === "video/mp4") ? (
                                                                    <VideocamIcon color="secondary" style={{ marginRight: '7.5px', fontSize: '24px' }}></VideocamIcon>
                                                                ) : (<></>)
                                                            }
                                                            {
                                                                (item.filetype) ? (item.filename) : (item.text)
                                                            }

                                                        </a>
                                                    </div>
                                                ) : (<Split splitTitle={item.splitTitle} splitAmount={item.splitAmount} roomid={props.roomid} uid={props.uid} splitid={props.uid} username={props.name} />)

                                            }

                                            {/* {type == "text" ? <div className='message__text__box' style={{ padding: '10px', backgroundColor: '#0073FF', borderRadius: '15px', width: 'fit-content' }}>

                                                <p key={index} className="chat__body__message">
                                                    {item.text}

                                                </p>
                                            </div>
                                                : <></>
                                            } */}

                                        </div>
                                    </div>}
                        </div>
                        )
                    })
                }
            </div>

            <div className="chat__footer">
                <div className="forbginput chat__footer" >
                    {/* <label htmlFor='filein' style={{ border: 'none', outline: 'none', cursor: 'pointer',marginTop:'7px', marginRight:'2px' }}><EmojiEmotionsOutlined /></label> */}

                    <input value={input} type="text" placeholder='Type a message...' onKeyPress={(e) => handleEnterButton(e)} onChange={inputhandler} />
                    <button className='splitBtn' style={{ width: '200px',height:"40px", padding: '10px', borderRadius: '100px', marginRight: '20px', backgroundColor: '#c3edff', border: 'none',cursor:'pointer',fontSize:'16px' }} onClick={() => { handleClickOpenAdd() }}>Split <span className='expenseSpan'>Expense</span></button>
                    <Dialog PaperProps={{
                        sx: {
                            width: "100%",
                            maxWidth: "480px!important",
                        }, style: { borderRadius: '11px' }
                    }} open={openAdd} onClose={handleCloseAdd}>
                        <div style={{ backgroundColor: '#252329' }}>
                            <DialogTitle>Split An Expense</DialogTitle>
                            <DialogContent>
                                {/* <h4>Enter Title</h4> */}
                                <input
                                    style={{ width: '92%', marginTop: '18px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
                                    placeholder="Enter Title"
                                    type='text'
                                    value={splitTitle} onChange={e => setSplitTitle(e.target.value)}
                                    required={true}

                                />
                                {/* <h4>Enter Amount</h4> */}
                                <input
                                    style={{ width: '92%', marginTop: '18px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
                                    placeholder="Enter Amount"
                                    type='number'
                                    coun
                                    value={splitAmount} onChange={e => setSplitAmount(e.target.value)}
                                    required={true}

                                />
                                <p style={{ marginTop: '18px',color:'#969696' }}>Select Members</p>
                                <FormGroup>
                                    {
                                       membersArray.map((item) => {
                                        // console.log(item)

                                            return (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            // defaultChecked
                                                            onChange={(e) => { handleCheck(e) }}
                                                            name={item.name}
                                                            itemID={item.id}
                                                            id={item.img}
                                                            color="primary"     
                                                            inputProps={{'img':item.img}}
                                                            
                                                        />
                                                    }
                                                    label={item.name===props.name?item.name + " (You)":item.name}
                                                />
                                            )
                                        }
                                        )

                                    }
                                </FormGroup>

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseAdd} style={{ fontFamily: 'Poppins' }}>Cancel</Button>
                                <Button onClick={() => { sendSplitMsg(); setType("split") }} style={{ fontFamily: 'Poppins' }}>Add</Button>
                            </DialogActions>
                        </div>

                    </Dialog>
                    <input type="file" name="" onChange={(e) => { handlefiles(e) }} id="filein" hidden />
                    <label htmlFor='filein' style={{ border: 'none', outline: 'none', cursor: 'pointer', marginTop: '3px' }}><AttachmentIcon /></label>

                    {
                        input ? (<Button onClick={() => { sendMessage(); setType("text") }} style={{ height: '35px', marginRight: '-13px', width: '30px' }} size="small">
                            <SendIcon sx={{ fontSize: "21px", color: 'white' }}></SendIcon>
                        </Button>) : (<Button disabled style={{ height: '35px', marginRight: '-13px', width: '30px' }} size="small">
                            <SendIcon sx={{ fontSize: "21px" }}></SendIcon>
                        </Button>)
                    }

                </div>
            </div>
        </div >
    );
}

export default Chat;
