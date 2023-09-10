import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, getIdToken } from "firebase/auth";
import Button from '@mui/material/Button';
import toast, { Toaster } from 'react-hot-toast';
import { DialogContentText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import logo from './ico/logo.png'


export const Login = (props) => {
    const auth = getAuth();
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')
    const [open3, setOpen3] = React.useState(false);
    const [resetemail, setresetemail] = useState("")
    const [roomid, setRoomid] = useState("")


    const localRooms = localStorage.getItem('rooms')


    const handleClickOpen3 = () => {
        setOpen3(true);
    };

    const handleClose3 = () => {
        setOpen3(false);
    };

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
        paddingBottom: '45px'
    }
    async function senduserdetails() {
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
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // console.log(user);
                props.getuser(user)
            })
            .catch((error) => {
                toast.error(error.message.slice(16), {
                    style: {
                        fontFamily: 'Poppins',
                        fontSize: '12.5px'
                    },
                })
            });
            
            

            // localStorage.setItem('rooms', JSON.stringify([...JSON.parse(localRooms), roomid]))
            


    }

    const resetPassword = () => {
        sendPasswordResetEmail(auth, resetemail)
            .then(() => {
                toast.success("Check your mail for password reset link ", {
                    style: {
                        fontFamily: 'Poppins',
                        fontSize: '12.5px'
                    },
                })
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

    const getIdTokenPromise = () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                if (user) {
                    getIdToken(user).then((idToken) => {
                        resolve(idToken);
                    }, (error) => {
                        resolve(null);
                    });
                } else {
                    resolve(null);
                }
            });
        });
    };
    getIdTokenPromise()
    return (

        <div className='login' style={loginstyle}>
            <Toaster />
            <img src={logo} style={{ width: '140px', marginBottom: '15px', marginTop: '-10px' }} alt="" />
            <h3 style={{ color: 'white', fontWeight: '400', fontSize: '20px', marginBottom: '18px', }}>Sign In</h3>
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
            <Button sx={{ marginTop: '21px', fontFamily: 'Poppins', color: 'white', fontSize: '13px', textTransform: 'lowercase' }} onClick={handleClickOpen3} variant="text">Forgot Password ?</Button>
            <Dialog PaperProps={{
                style: { borderRadius: '11px' }
            }} open={open3} onClose={handleClose3}>
                <div style={{ backgroundColor: '#252329', padding: '10px 12px' }}>
                    <DialogTitle sx={{ fontFamily: 'Poppins', fontSize: '17px' }}>Forgot Password ? </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ fontSize: '13.05px', fontFamily: 'Poppins' }}>
                            Enter your email to get password reset link
                        </DialogContentText>
                        <input
                            value={resetemail}
                            onChange={e => setresetemail(e.target.value)}
                            style={{ width: '92%', marginTop: '18px', fontSize: '13.75px', fontFamily: 'Poppins', backgroundColor: '#3C393F', height: '45px', border: 'none', outline: 'none', borderRadius: '7px', color: 'white', padding: '6px 13px' }}
                            placeholder="Enter email"
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ fontFamily: 'Poppins', color: 'white', fontSize: '13px', textTransform: 'lowercase' }} onClick={handleClose3}>Cancel</Button>
                        <Button sx={{ fontFamily: 'Poppins', color: 'white', fontSize: '13px', textTransform: 'lowercase', backgroundColor: '#2F80ED' }} onClick={resetPassword}>Reset</Button>
                    </DialogActions>
                </div>
            </Dialog>
            <button style={{ marginTop: '19px', width: '115px', backgroundColor: '#4F64FD', color: 'white', padding: '12px 5px', borderRadius: '12px', cursor: 'pointer', fontSize:'16px',boxShadow:'20px' }} onClick={senduserdetails}>Sign In</button>
            <Button onClick={() => props.setSignUp(true)} sx={{ marginBottom: '5px', marginTop: '21px', fontFamily: 'Poppins', color: 'white', fontSize: '13px', textTransform: 'lowercase' }}>Don't have an account ?</Button>

        </div>
    );
};
