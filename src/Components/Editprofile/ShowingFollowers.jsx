import React from 'react'
import { Dialog, DialogContent } from '@mui/material';
import useWindowDimensions from '../Common/WindowSize';
import { gridCSS } from '../CommonStyles';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
const ShowingFollowers = ({ data, typeOfOpen, setTypeOfOpen }) => {

    const { width } = useWindowDimensions()
    const navigate = useNavigate()
    const { email, role, userName, image, verification, user_id } = useSelector(
        (store) => store.auth.loginDetails
    );
    return (
        <Dialog
            
            open={typeOfOpen !== null}
            onClose={() => {
                setTypeOfOpen(null);
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"
            sx={gridCSS.tabContainer}
        >
            <DialogContent
                style={{
                    padding: '5px 0px',
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: '10px',
                }}
            >

                <div style={{padding: '10px'}}>
                    <h2>{typeOfOpen?.split('')[0].toUpperCase() + typeOfOpen?.slice(1)}</h2>
                </div>
                <div className='followersContainer'>
                    {data?.map(d => (
                        <div className='individualFollower' onClick={() => {
                            if (user_id == d._id){
                                navigate('/editProfile')
                            } else {
                                navigate(`/user/${d._id}`)
                            }
                        }}>
                            <div>
                                <img
                                    src={
                                        d.image !== undefined && d.image !== "" && d.image.url !== '' ? d.image.url : "/profile.png"
                                    }
                                />
                            </div>
                            <div style={{transform: 'translateY(-2px)'}}>
                                <div>{d.userName}</div>
                                <div>{d.role}</div>

                            </div></div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShowingFollowers