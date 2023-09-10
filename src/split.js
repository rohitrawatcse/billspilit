import { LinearProgress } from '@mui/material';
import { fontWeight } from '@mui/system';
import { collection, doc, documentId, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import './css/split.css'
import { db } from './firebase';
import logo from './ico/logo.png'

const Split = ({ splitTitle, splitAmount, uid, roomid, username }) => {

  const [splitUsersName, setSplitUsersName] = useState([])
  const [splitUsersPhoto, setSplitUsersPhoto] = useState([])
  const [splitUsers, setSplitUsers] = useState([])
  const [usersPaid, setUsersPaid] = useState(0)
  const [seeUsers, setseeUsers] = useState([])
  const [docId, setdocId] = useState()
  const [finaldocId, setFinaldocId] = useState()
  const [isDisabled, setIsDisabled] = useState(false)
  const [splitUsersCount, setSplitUsersCount] = useState(0)
  const [splitBy, setSplitBy] = useState([])
  const [load, setLoad] = useState(false)


  const qr = query(collection(db, roomid), orderBy('splitAmount', 'asc'));

  useEffect(() => {
    onSnapshot(qr, (snapshot) => {
      setSplitUsers(snapshot.docs.map((doc) => doc.data()))
    })


  }, [roomid])

  useEffect(() => {
    setLoad(!true)
  }, [roomid])

  useEffect(() => {
    onSnapshot(qr, (snapshot) => {
      setdocId(snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() })))
    })


  }, [roomid, splitUsers])

  // console.log(splitUsers)

  // useEffect(() => {

  //   setdocId(splitUsers.map((item) => {
  //     if (item.splitTitle === splitTitle && item.splitAmount === splitAmount) {
  //       return item.id
  //     }
  //     else {
  //       return null
  //     }

  //   }))
  //     setdocId(docId => docId.filter(item => item !== null))

  // }, [splitUsers])
  // console.log(docId[0]?.docId)


  useEffect(() => {
    setSplitUsersPhoto(splitUsers.map((item) => {
      if (item.splitTitle === splitTitle && item.splitAmount === splitAmount) {
        return item.splitUsersPhoto
      }
      else {
        return null
      }
    }))
  }, [splitUsers])



  useEffect(() => {
    setSplitUsersName(splitUsers.map((item) => {
      if (item.splitTitle === splitTitle && item.splitAmount === splitAmount) {
        return item.splitUsersName

      }
      else {
        return null
      }
    }))

    setSplitUsersName(splitUsersName => splitUsersName.filter(item => item !== null))


  }, [splitUsers])

  useEffect(() => {

    setUsersPaid(splitUsers.map((item) => {
      if (item.splitTitle === splitTitle && item.splitAmount === splitAmount) {
        return item.usersPaid

      }
      else {
        return null
      }
    }))

    setUsersPaid(splitUsersName => splitUsersName.filter(item => item !== null))



  }, [splitUsers])


  // const docref = doc(db, roomid, "3BlsWPkI2dphZFQ6oVdo")
  // useEffect(() => {
  //   console.log(usersPaid)
  //   updateDoc(docref, {
  //     usersPaid: usersPaid[0]
  //     });
  //   console.log(usersPaid)




  // }, [usersPaid])


  useEffect(() => {
    setSplitUsersCount(splitUsersPhoto.map((item) => {
      if (item !== null) {
        return item.length
      }
      else {
        return null
      }
    }))

    setSplitUsersCount(splitUsersCount => splitUsersCount.filter(item => item !== null))


  }, [splitUsersPhoto])

  useEffect(() => {
    setSplitUsersCount(splitUsersPhoto.map((item) => {
      if (item !== null) {
        return item.length
      }
      else {
        return null
      }
    }))

    setSplitUsersCount(splitUsersCount => splitUsersCount.filter(item => item !== null))


  }, [splitUsersPhoto])




  // console.log(splitUsersPhoto)
  // console.log(splitUsersCount[0])







  useEffect(() => {
    setseeUsers(splitUsers.map((item) => {
      if (item.splitTitle === splitTitle && item.splitAmount === splitAmount) {
        return item.splitBy
      }
      else {
        return null
      }
    }))
    setseeUsers(seeUsers => seeUsers.filter(item => item !== null))
    setSplitBy(seeUsers[0])
  }, [splitUsers])

  //  console.log(splitBy)
  // console.log(splitUsers)
  // console.log(splitUsersName)
  // console.log(username)


  // console.log(splitUsersCount)
  const laodscript = (src) => {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = src

      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }

      document.body.appendChild(script)
    })
  }


  const handleRazorpay = async (docref) => {

    const res = await laodscript('https://checkout.razorpay.com/v1/checkout.js')
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const options = {
      key: 'rzp_test_D4QKUfd4DWNLdV',
      amount: (Math.round(splitAmount / splitUsersCount[0] * 100) / 100) * 100,
      currency: 'INR',
      name: 'Contri',
      description: 'Thank you for using Contri',
      image: logo,
      handler: function (response) {
        updateDoc(docref, {
          usersPaid: usersPaid[0] + 1
        });
        toast.success('Payment Successful');
        setIsDisabled(true)
      },
      prefill: {
        name: username,
        email: 'test@gmail.com',
        contact: '9999999999'
      },
      theme: {
        color: '#0156BD'
      }
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()


  }

  const handlePay = async () => {
    const finaldocId = docId
      .filter(item => item.splitTitle === splitTitle && item.splitAmount === splitAmount)
      .map(item => item.docId);

    if (finaldocId.length === 0) {
      console.log('Error: docId not found');
      return;
    }
    try {

      const docref = doc(db, roomid, finaldocId[0]);

      if ((usersPaid[0] < splitUsersCount[0]-1) && splitUsersName[0]?.includes(seeUsers[0])) {
        await handleRazorpay(docref);
      }
      else if ((usersPaid[0] < splitUsersCount[0]) && !splitUsersName[0]?.includes(seeUsers[0])) {
        await handleRazorpay(docref);
      }
       else {
        toast.error('All Payments Done');
      }
    } catch (error) {
      console.log('Payment Failed', error);
      toast.error('Payment Failed');
    }

    console.log(usersPaid);
  }



  return (
    <div>
      <div className='splitBox'>
        <div className='splitTitle'>
          <p>{splitTitle}</p>
        </div>
        {/* <div className='splitDescription'>
                <p>Split Description</p>
        </div> */}
        <div className='splitAmount'>
          <h1 ><span style={{ fontFamily: "sans-serif", fontWeight: '200' }}>₹ </span>{Math.round(splitAmount / splitUsersCount[0] * 100) / 100}</h1>
        </div>
        <div className='progressBarDiv'>
          <LinearProgress className='progressBar' variant="determinate" value={((splitUsersName[0]?.includes(seeUsers[0]) ? usersPaid[0] + 1 : usersPaid[0]) * 100) / splitUsersCount} />
          <p className='countNum'>{splitUsersName[0]?.includes(seeUsers[0]) ? usersPaid[0] + 1 : usersPaid[0]}/{splitUsersCount} paid</p>
        </div>
        <div className='splitUsersImg'>
          <div className='splitAvatarDiv'>
            {
              splitUsersPhoto.map((item) => {
                if (item !== null) {
                  return item.map((item) => {
                    return <img className='splitAvatar' src={item} alt='splitUsersPhoto' />
                  })
                }
                else {
                  return null
                }
              })

            }
          </div>

        </div>
        <div className='splitPayDiv'>
          {

            seeUsers.map((item) => {
              // console.log(splitUsersName[0])
              // console.log()
              if (item !== null && item !== username && splitUsersName[0].includes(username)) return <button className='splitPay' onClick={handlePay} disabled={isDisabled}>Pay</button>
              else if (item !== null && !splitUsersName[0].includes(username)) return <button className='splitPayDisabled' disabled>Pay</button>
              else if (item !== null && item === username) {
                return <button className='splitPayDisabled' disabled>Pay</button>
              }
              // 

            })
            // seeUsers.map((item) => {
            //   console.log(item)
            //   if (item !== null) {
            //     return item.map((item) => {
            //       return <button className='splitPay' onClick={handlePay}>Pay</button>
            //     })
            //   }
            //   else {
            //     return null
            //   }
            // })


            // ?<button className='splitPay' onClick={handlePay}>Pay</button>
            // :<button className='splitPayDisabled' disabled>Pay</button>


          }

        </div>
      </div>
    </div>
  )
}

export default Split
