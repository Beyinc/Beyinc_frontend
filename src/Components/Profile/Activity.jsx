import React, { useEffect, useState } from 'react';
import { ApiServices } from '../../Services/ApiServices';
import { ToastColors } from '../Toast/ToastColors';
import { setToast } from '../../redux/AuthReducers/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '../Editprofile/Activities/Posts/Post';

const Activity = ({allPosts, setAllPosts}) => {
  const { id } = useParams();

  const navigate = useNavigate();


  return (
    <div className="w-[60vw]">
      {id === undefined && (
        <section className="createPostContainer">
          <button
            onClick={() => navigate("/createPostPage")}
            className="createPostbtn"
          >
            Create Post
          </button>
        </section>
      )}

      <div className="allPostShowContainer">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <Post key={post.id} post={post} setAllPosts={setAllPosts} />
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              marginTop: "100px",
            }}
          >
            There is no activity found for this user
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
