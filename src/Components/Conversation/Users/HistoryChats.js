import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllHistoricalConversations } from '../../../redux/Conversationreducer/ConversationReducer'
import IndividualHistory from './IndividualHistory'
import { Box, Tab, Tabs, Typography } from '@mui/material'



function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { className, children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            className={className}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
const HistoryChats = () => {
    const [value, setValue] = useState(1)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const dispatch = useDispatch()
    const { email, role, user_id } = useSelector(state => state.auth.loginDetails)
    const onlineUsers = useSelector(state => state.conv.onlineUsers)
    const [onlineEmails, setOnlineEmails] = useState([])
    useEffect(() => {
        if (onlineUsers.length > 0) {
            const emails = []
            onlineUsers.map((ol) => {
                if (!emails.includes(ol.userId)) {
                    emails.push(ol.userId)
                }
            })
            setOnlineEmails(emails)
        }
    }, [onlineUsers])
    const historicalConversations = useSelector(state => state.conv.historicalConversations)
    useEffect(() => {
        dispatch(getAllHistoricalConversations(user_id))
    }, [])


    const handleMenuvisible = (e) => {
        if (e.target.classList[1] == 'fa-caret-right') {
            e.target.classList.remove('fa-caret-right')
            e.target.classList.add('fa-caret-down')
            document.getElementsByClassName(e.target.id)[0].style.display = 'block'

        } else {
            e.target.classList.remove('fa-caret-down')
            e.target.classList.add('fa-caret-right')
            document.getElementsByClassName(e.target.id)[0].style.display = 'none'

        }
    }
    // useEffect(() => {
    //     document.getElementById('approved').classList.remove('fa-caret-right')
    //     document.getElementById('approved').classList.add('fa-caret-down')
    //     document.getElementsByClassName('approved')[0].style.display = 'block'
    // }, [])

    return (
        <div className='historyChats'>
            {/* <Tabs value={value} className='pitchTabs' style={{ width: '200px' }}
                textColor="primary"
                indicatorColor="secondary"
                onChange={handleChange} aria-label="basic tabs example"
            >
                <Tab className='tabs' sx={{ width: '50px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label={`Approved`} {...a11yProps(0)} />
                <Tab className='tabs' sx={{ width: '50px', background: 'none', textTransform: 'capitalize', padding: "0px", fontSize: '13px', fontWeight: 600 }} label={`Pending`} {...a11yProps(1)} />

            </Tabs> */}
            <div className="historicalTabHeader">
                <div className={`historicalTabIcons ${value == 1 && 'historicalTabIconsselected'}`} onClick={() => setValue(1)}>Approved</div>
                <div className={`historicalTabIcons ${value == 2 && 'historicalTabIconsselected'}`} onClick={() => setValue(2)}>Pending</div>
            </div>
            {value == 2 && <div style={{ marginTop: '10px', maxHeight: '400px', overflowY: 'scroll' }}>
                {historicalConversations.filter(f => f.status == 'pending' && f.members[0]._id == user_id).length > 0 ? historicalConversations.map((a) => (
                    a.status === 'pending' && <IndividualHistory a={a} onlineEmails={onlineEmails} status='pending' />
                )) : <div style={{ textAlign: 'start', padding: '10px' }}>No Pending Requests</div>}
            </div>}
            {value == 1 && <div style={{ marginTop: '10px', maxHeight: '400px', overflowY: 'scroll' }}>
                {historicalConversations.filter(f => f.status == 'approved').length > 0 ? historicalConversations.map((a) => (
                    a.status === 'approved' && <IndividualHistory a={a} onlineEmails={onlineEmails} status='approved' />
                )) : <div style={{ textAlign: 'start', padding: '10px' }}>No Approved chats</div>}
            </div>}

            {/* <div className='statusHeader'>
                <i class={`fas fa-caret-right`} id='pending' onClick={handleMenuvisible}></i>Pending
            </div>
            <div className='pending'>
                {historicalConversations.length > 0 && historicalConversations.map((a) => (
                    a.status === 'pending' && <IndividualHistory a={a} onlineEmails={onlineEmails} status='pending' />
                ))}
            </div> */}

            {/* approved */}
            {/* <div className='statusHeader'>
                <i class={`fas fa-caret-right`} id='approved' onClick={handleMenuvisible}></i>Approved
            </div>
            <div className='approved'>
                {historicalConversations.length > 0 && historicalConversations.map((a) => (
                    a.status === 'approved' && <IndividualHistory a={a} onlineEmails={onlineEmails} status='approved' />
                ))}
            </div> */}
        </div>
    )
}

export default HistoryChats