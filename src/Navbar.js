import * as React from 'react';

export default function AccountMenu(props) {
    const room = localStorage.getItem('room')
    return (
        <div className='navbarmenu' >
            <div style={{display:'flex', alignItems:'center'}}>
        <div style={{backgroundColor:'#024391', padding: '10px 17px', borderRadius: '50%', marginRight: '15px',marginLeft: '10px', fontSize: '14px',boxShadow:'-8px -6px 33px 16px rgba(0,0,0,0.1),12px 15px 32px -5px rgba(0,0,0,0.1)' }} className="box">{room?room.slice(0, 1):<></>}
                
        </div>
        <p style={{ fontSize: '17px' }}>{room}</p>
            </div>

        {/* <div className='addFriend' style={{backgroundColor:'#2D2D2F',padding:'8px',paddingRight:'25px',paddingLeft:'25px',cursor:'pointer',borderRadius:'50px',marginRight:'10px'}}>Add a Friend</div> */}
        
        </div>

            
        
    );
}
