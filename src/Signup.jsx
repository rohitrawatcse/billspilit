import { Button } from '@mui/material'
import { createUserWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React from 'react'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { storage, } from './firebase'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import cryptoRandomString from 'crypto-random-string';


export default function Signup(props) {
    const imgId = cryptoRandomString({length: 5, type: 'base64'});
    const auth = getAuth()
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')
    const [name, setName] = useState('')
    const [img, setImg] = useState(() => {
        console.log(imgId);
        return `https://api.multiavatar.com/${imgId}.svg`
    })
    function handlefiles(e) {
        // console.log(e.target.files[0]);
        if (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/jpeg") {
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
    function upload(file) {
        const storageRef = ref(storage, 'files/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
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
                    setImg(downloadURL)
                });
            }
        );
    }

    async function signup() {
        if (!email) {
            toast.error('Enter email', {
                style: {
                    fontFamily: 'Poppins',
                    fontSize: '12.5px'
                },
            });
            return
        }
        if (!password) {
            toast.error('Enter Password', {
                style: {
                    fontFamily: 'Poppins',
                    fontSize: '12.5px'
                },
            });
            return
        }
        if (!name) {
            toast.error('Enter Name', {
                style: {
                    fontFamily: 'Poppins',
                    fontSize: '12.5px'
                },
            });
            return
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.debug(user)
                updateProfile(auth.currentUser, {
                    displayName: name, photoURL: img
                }).then(() => {
                    // console.log(auth.currentUser);
                    props.getuser(auth.currentUser)
                }).catch((error) => {
                });

            })
            .catch((error) => {
                toast.error(error.message.slice(16), {
                    style: {
                        fontFamily: 'Poppins',
                        fontSize: '12.5px'
                    },
                })
            });
    }



    return (
        <div className='login' style={loginstyle}>
            <Toaster />
            <h3 style={{ color: 'white', fontWeight: '400', fontSize: '20px', marginBottom: '18px', marginTop: '-20px' }}>Signup</h3>
            <div className="image" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="imginput">
                    <img src={img} style={{ width: '135px', borderRadius: '12px', marginTop: '25px', position: 'relative', cursor: 'pointer' }} alt="" />
                    <div style={{cursor:'pointer',padding:'5px',paddingRight:'12px',paddingLeft:'12px',backgroundColor:'#2D2D2F',borderRadius:'50px',fontSize:'14px'}}>Choose Image</div>
                </label>
                <input onChange={(e) => handlefiles(e)} type="file" id='imginput' hidden />
            </div>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '85%', marginTop: '29px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
                placeholder="Choose a Usename"
            />
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '85%', marginTop: '29px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
                placeholder="Enter email"
            />

            <input
                type="password"
                value={password}
                onChange={e => setpassword(e.target.value)}
                style={{ width: '85%', marginTop: '29px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
                placeholder="Enter password"
            />
            

            <button onClick={() => signup()} style={{ marginTop: '35px', width: '115px', backgroundColor: '#4F64FD', color: 'white', padding: '12px 5px', borderRadius: '8px', cursor: 'pointer', fontSize:'16px' }} >Sign Up</button>
            <Button onClick={() => props.setSignUp(false)} sx={{ marginBottom: '5px', marginTop: '21px',fontFamily: 'Poppins', color: 'white', fontSize: '13px', textTransform: 'lowercase' }}>Already have an account ?</Button>
        </div>
    )
}
const loginstyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '452px',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'fit-content',
    padding: '62px 21px',
    backgroundColor: '#252329',
    borderRadius: '18px',
    textAlign: 'center',
}
