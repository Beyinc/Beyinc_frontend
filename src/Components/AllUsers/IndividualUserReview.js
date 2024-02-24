import React, { useEffect, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import moment from "moment";

const IndividualUserReview = ({ c, deleteComment, onLike, onDisLike }) => {
  const { email, user_id } = useSelector((state) => state.auth.loginDetails);
  const { pitchId } = useParams();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);

  const [disliked, setdisLiked] = useState(false);


  const [count, setCount] = useState(0);
  const [dislikecount, setdislikecount] = useState(0);

  useEffect(() => {
    setLiked(c.likes?.map(l=>l._id)?.includes(user_id))
    setdisLiked(c.Dislikes?.map(l => l._id)?.includes(user_id))
    setCount(c.likes?.length)
    setdislikecount(c.Dislikes?.length)
  }, [c, user_id])

  const handleLike = (id) => {
    if (liked) {
      setLiked(false);
      setCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setCount((prev) => prev + 1);
      setdislikecount((prev) => prev - 1);
      setdisLiked(false);


    }
    onLike(id, !c.likes?.includes(user_id));
  };


  const handleDisLike = (id) => {
    if (disliked) {
      setdisLiked(false);
      setdislikecount((prev) => prev - 1);
    } else {
      setdisLiked(true);
      setLiked(false);

      setdislikecount((prev) => prev + 1);
      setCount((prev) => prev - 1);

    }
    onDisLike(id, !c.Dislikes?.includes(user_id));
  };

  return (
    <div className="IndicommentsSection">
      <div className="IndicommentsSectionImage">
        <img
          src={c?.profile_pic || c?.commentBy?.image?.url || "/profile.png"}
          alt=""
        />
      </div>
      <div className="IndicommentsSectionDetails">
        <div className="IndicommentsSectionDetailsUserName">
          <div>
            {c?.userName || c?.commentBy?.userName}
          </div>
          <div style={{ fontWeight: '200' }}
           
            className="IndicommentsSectionDetailsdate"
          >
            {moment(c.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </div>
          {/* <div title={"Delete Comment"} onClick={() => deleteComment(c._id)}>
            {(c?.email || c?.commentBy?.email) == email && (
              <i className="fas fa-trash"></i>
            )}
          </div> */}
        </div>
        <div
          title={c?.email || c?.commentBy?.email}
          className="IndicommentsSectionDetailscomment"
        >
          {c?.comment}
        </div>
        <div className="IndicommentsSectionActions">
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {count > 0 && <div>{count}</div>}
            {liked ? (
              <i
                class="fa fa-thumbs-up icon-blue"
                aria-hidden="true"
                onClick={() => handleLike(c._id)}
              />
            ) : (
              <i
                class="far fa-thumbs-up"
                aria-hidden="true"
                onClick={() => handleLike(c._id)}
              />
            )}
          </div>


          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {dislikecount > 0 && <div>{dislikecount}</div>}
            {disliked ? (
              <i
                class="fa fa-thumbs-down icon-blue"
                aria-hidden="true"
                onClick={() => handleDisLike(c._id)}
              />
            ) : (
              <i
                class="far fa-thumbs-down"
                aria-hidden="true"
                onClick={() => handleDisLike(c._id)}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default IndividualUserReview;
