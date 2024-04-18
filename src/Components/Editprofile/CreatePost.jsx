import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@mui/material';
import useWindowDimensions from '../Common/WindowSize';
import { gridCSS } from '../CommonStyles';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { postTypes, socket_io } from '../../Utils';
import { ApiServices } from '../../Services/ApiServices';
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { ToastColors } from '../Toast/ToastColors';
import { io } from 'socket.io-client';

const CreatePost = ({ setCreatePostpopup, createPostPopup, setAllPosts }) => {
    const userPitches = useSelector(state => state.conv.userLivePitches)
    const dispatch = useDispatch()

    const { width } = useWindowDimensions()
    const navigate = useNavigate()
    const { email, role, userName, verification, user_id } = useSelector(
        (store) => store.auth.loginDetails
    );

    const [image, setImage] = useState('')
    const [posttype, setposttype] = useState('')
    const [description, setDescription] = useState('')
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file.size > 4 * 1024 * 1024) {
            alert(
                `File size should be less than ${(4 * 1024 * 1024) / (1024 * 1024)} MB.`
            );
            e.target.value = null; // Clear the selected file
            return;
        }
        setFileBase(file);
    };
    const setFileBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    };


    const [allUsers, setAllusers] = useState([])
    const [usertags, setuserTags] = useState([])
    const [search, setSearch] = useState("");
    const [filteredusers, setFilteredUsers] = useState([]);
    const [userPitchId, setUserPitchid] = useState(null)

    useEffect(() => {
        ApiServices.getAllUsers({ type: "" }).then((res) => {
            // console.log(res.data);
            setAllusers(res.data);
        });
    }, []);

    useEffect(() => {
        setFilteredUsers(allUsers);
    }, [allUsers]);

    useEffect(() => {
        setFilteredUsers(
            allUsers.filter((a) =>
                a.userName.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search]);


    const socket = useRef();
    useEffect(() => {
        socket.current = io(socket_io);
    }, []);

    const addingpost = async () => {
        await ApiServices.createPost({ description, tags: usertags, pitchId: userPitchId?._id, image: image, createdBy: { _id: user_id, userName: userName, email: email}, type: posttype }).then(res => {
            setDescription('')
            setUserPitchid(null)
            setuserTags([])
            setImage('')
            setposttype('')
            setCreatePostpopup(false)
            setAllPosts(prev => [res.data, ...prev])
            for (let i = 0; i < usertags.length; i++){
                socket.current.emit("sendNotification", {
                    senderId: user_id,
                    receiverId: usertags[i]._id,
                });
            }
        }).catch(err => {
            dispatch(
                setToast({
                    message: 'Error Occured!',
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
            );
        })
    }

    return (
        <Dialog
    fullScreen
            open={createPostPopup}
            onClose={() => {
                setDescription('')
                setUserPitchid(null)
                setuserTags([])
                setImage('')
                setposttype('')
                setCreatePostpopup(false)
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"
            sx={{
                ...gridCSS.tabContainer,
                // Setting width to auto
            }}

        >
            <DialogContent
                style={{
                    padding: '0px',
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: '10px',
                }}
            >

                <div className='createPostHeader' styl={{position: 'relative'}}>
                    Create New Post
                    <div style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => {
                        setDescription('')
                        setUserPitchid(null)
                        setuserTags([])
                        setImage('')
                        setposttype('')
                        setCreatePostpopup(false)
                    }}>
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(image !== undefined && image !== "") ?
                        <div style={{ position: 'relative' }}>
                            <img
                                style={{
                                    cursor: "pointer",
                                    height: "500px",
                                    width: "500px",
                                }}
                                src={image}
                                alt="Profile"
                            />
                            <div style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setImage('')}>
                                <i class="fas fa-times"></i>
                            </div>
                        </div>

                        : <div>
                            <label htmlFor="profilePic" className="profileImage" style={{ marginLeft: '30px' }}>
                                <CloudUploadIcon />
                            </label>
                            <input
                                type="file"
                                accept="image/*,.webp"
                                name=""
                                id="profilePic"
                                onChange={handleImage}
                                style={{ display: "none" }}
                            />
                        </div>}

                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div>
                            <label>Description*</label>
                        </div>
                        <div>
                            <textarea
                                type="text" style={{ width: '95%' }}
                                name="overViewOfStartup"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={10}
                                cols={10}
                            ></textarea>
                        </div>
                        <div className='postTypeSelector'
                            onClick={() => {
                                document.getElementsByClassName('postTypeContainer')[0].classList.toggle('show')
                            }}
                        >
                            <div>Post Types: {posttype}</div>
                            <div>
                                <i className='fas fa-caret-down'></i>
                            </div>
                        </div>
                        <div className='postTypeContainer' style={{ width: '90%' }}>
                            {postTypes.map(p => (
                                <div className='individualPostTypes' onClick={() => {
                                    if (p.value !== 'General Post') {
                                        setposttype(p.value)
                                    } else {
                                        setposttype(p.value)
                                        setUserPitchid(null)
                                    }
                                    document.getElementsByClassName('postTypeContainer')[0].classList.remove('show')
                                }}>{p.value}</div>
                            ))}
                        </div>

                        <div style={{ position: 'relative' }} >
                            <div className='postTypeSelector'
                                onClick={() => {
                                    document.getElementsByClassName('userTags')[0].classList.toggle('show')
                                }}
                            >
                                <div>Tags</div>
                                <div>
                                    <i className='fas fa-caret-down'></i>
                                </div>
                                <div className="newConversation userTags">
                                    <div>
                                        {/* <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search Users to message"
                                            autoComplete="off"
                                            aria-autocomplete="off"
                                        /> */}
                                    </div>
                                    <div className="searchedUsers" style={{ height: '150px' }}>
                                        {filteredusers.length > 0 &&
                                            filteredusers
                                                .filter((f) => f.email !== email)
                                                .map((a) => (
                                                    <div
                                                        className="individuals"
                                                        onClick={() => {
                                                            if (!usertags.map(m => m._id).includes(a._id)) {
                                                                setuserTags(prev => [...prev, a])
                                                            }
                                                        }}
                                                    >
                                                        <div className="searchPic">
                                                            <img
                                                                src={
                                                                    a.image === undefined || a.image == ""
                                                                        ? "/profile.png"
                                                                        : a.image.url
                                                                }
                                                                alt=""
                                                                srcset=""
                                                            />
                                                            {a.verification === "approved" && (
                                                                <div
                                                                    style={{
                                                                        right: "8px",
                                                                        top: "3px",
                                                                        height: "13px",
                                                                        width: "13px",
                                                                        position: "absolute",
                                                                    }}
                                                                >
                                                                    <abbr title="verified user">
                                                                        <img
                                                                            src="/verify.png"
                                                                            height={20}
                                                                            style={{ height: "13px", width: "13px" }}
                                                                            alt="Your Alt Text"
                                                                            className=""
                                                                        />
                                                                    </abbr>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <div className="userName">{a.userName}</div>
                                                            <div className="role">{a.role}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="selected-domains">
                            {usertags?.map((u, i) => (
                                <div key={u} className="selected-domain">
                                    <span>{u.userName}</span>
                                    <button
                                        className="domain-delete-button"
                                        onClick={() => {
                                            setuserTags(usertags.filter(f => f._id !== u._id))
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>



                        {posttype !== 'General Post' && <><div className='postTypeSelector'
                            onClick={() => {
                                document.getElementsByClassName('createPostPitchContainer')[0].classList.toggle('show');
                            } }
                        >
                            <div>Pitch: {userPitchId?.title}</div>
                            <div>
                                <i className='fas fa-caret-down'></i>
                            </div>
                        </div><div className='postTypeContainer createPostPitchContainer' style={{ width: '90%' }}>
                                {userPitches.map(p => (
                                    <div className='individualPostTypes' onClick={() => {
                                        setUserPitchid(p);
                                        document.getElementsByClassName('createPostPitchContainer')[0].classList.remove('show');
                                    } }>{p.title}</div>
                                ))}
                            </div></>}


                        <button style={{ margin: '10px 10px 10px -5px' }} onClick={addingpost} disabled={description==''||image==''}>Create Post</button>
                    </div>
                </div>



            </DialogContent>
        </Dialog>
    )
}

export default CreatePost