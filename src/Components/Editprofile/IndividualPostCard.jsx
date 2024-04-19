import { useState } from "react";
import IndividualPostDetailsCard from "./IndividualPostDetailsCard";
import { useNavigate } from "react-router";


const IndividualPostCard = ({ post }) => {
    const navigate = useNavigate()
    return (
        <div className="postImageContainer" onClick={() => { navigate(`/posts/${post._id}`) }} onMouseOver={() => {
            document.getElementById(`${post._id}`).style.display = 'flex'
        }} onMouseLeave={() => {
            document.getElementById(`${post._id}`).style.display = 'none'
        }}>
            <img src={post?.image?.url} alt="Profile" />
            <div className='postImageContainerLayer' style={{display: 'none'}} id={`${post._id}`}>
                <i className="fas fa-heart" style={{ color: 'white', fontSize: '18px' }}></i> {post?.likes?.length}
            </div>

        </div>
    );
};

export default IndividualPostCard;
