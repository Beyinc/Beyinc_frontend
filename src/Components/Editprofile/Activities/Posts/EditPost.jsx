import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import useWindowDimensions from "../../../Common/WindowSize";
import { gridCSS } from "../../../CommonStyles";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { postTypes, socket_io } from "../../../../Utils";
import { ApiServices } from "../../../../Services/ApiServices";
import { setToast } from "../../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../../Toast/ToastColors";
import { io } from "socket.io-client";

const EditPost = ({
  accessSetting,
  setEditPostpopup,
  editPostPopup,
  post,
  setAllPosts,
  EditPostCount,
}) => {
  const userPitches = useSelector((state) => state.conv.userLivePitches);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const { email, role, userName, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );

  const [images, setImages] = useState([]);
  const [posttype, setposttype] = useState("");
  const [description, setDescription] = useState("");

  const [allUsers, setAllusers] = useState([]);
  const [usertags, setuserTags] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredusers, setFilteredUsers] = useState([]);
  const [userPitchId, setUserPitchid] = useState(null);
  const [link, setlink] = useState("");
////
  useEffect(() => {
    if (post || EditPostCount) {
      setImages(post?.images ?? (post?.image ? [post.image] : []));
      setDescription(post?.description);
      setposttype(post?.type);
      setuserTags(post?.tags);
      setUserPitchid(post?.pitchId);
      setlink(post?.link);
    }
  }, [post, EditPostCount]);

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

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImageEdit = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 4 * 1024 * 1024;
    const oversized = files.find((f) => f.size > maxSize);
    if (oversized) {
      alert(`Each file should be less than ${(maxSize) / (1024 * 1024)} MB.`);
      e.target.value = null;
      return;
    }
    Promise.all(files.map(readFileAsDataURL)).then((dataUrls) => {
      setImages((prev) => [...prev, ...dataUrls]);
    });
  };

  const updatePost = async (e) => {
    e.target.disabled = true;
    setLoading(true);
    await ApiServices.updatePost({
      description,
      link,
      tags: usertags,
      pitchId: userPitchId?._id,
      images: images.length ? images : null,
      createdBy: { _id: user_id, userName: userName, email: email },
      type: posttype,
      id: post?._id,
      openDiscussion: accessSetting === "public",

    })
      .then((res) => {
        setLoading(false);
        dispatch(
            setToast({
              message: "Your post updated successfully",
              bgColor: ToastColors.success,
              visible: "yes",
            })
          );
        setDescription("");
        setUserPitchid(null);
        setlink("");
        setuserTags([]);
        setImages([]);
        setposttype("");
        setEditPostpopup(false);

        // setAllPosts((prev) => [
        //   ...prev.map((p) => (p._id == post._id ? res.data : p)),
        // ]);

        // for (let i = 0; i < usertags.length; i++) {
        //   socket.current.emit("sendNotification", {
        //     senderId: user_id,
        //     receiverId: usertags[i]._id,
        //   });
        // }
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          setToast({
            message: "Error Occured!",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
    e.target.disabled = false;
  };

  return (
    <Dialog
      fullWidth
      open={editPostPopup}
      onClose={() => {
        setDescription("");
        setUserPitchid(null);
        setlink("");
        setuserTags([]);
        setImages([]);
        setposttype("");
        setEditPostpopup(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xl"
      sx={{
        ...gridCSS.tabContainer,
        width: "1000px",
        height: "750px",
        marginLeft: "15%",
        paddingRight: "20px",
      }}
    >
      <DialogContent
        style={{
          padding: "0px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "var(--createPost-bg)",
          color: "var(--createPost-color)",
        }}
      >
        <div className="createPostHeader" style={{ position: "relative" }}>
          Update Post
          <div
            style={{ position: "absolute", right: "10px", top: "10px" }}
            onClick={() => {
              setDescription("");
              setUserPitchid(null);
              setlink("");
              setuserTags([]);
              setImages([]);
              setposttype("");
              setEditPostpopup(false);
            }}
          >
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {images && images.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img
                    style={{ cursor: 'pointer', height: '200px', width: '200px', objectFit: 'cover' }}
                    src={img?.url ? img.url : img}
                    alt={`img-${idx}`}
                  />
                  <div style={{ position: 'absolute', right: '10px', top: '10px' }} onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}>
                    <i class="fas fa-times"></i>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{border: '2px solid var(--light-border)'}}></div>

          <div className="postUploadContainer" style={{ marginTop: '8px' }}>
            <label htmlFor="editProfilePic" className="postUploadIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                <path fill="black" d="M2 12h2v5h16v-5h2v5c0 1.11-.89 2-2 2H4a2 2 0 0 1-2-2zM12 2L6.46 7.46l1.42 1.42L11 5.75V15h2V5.75l3.13 3.13l1.42-1.43z" />
              </svg>
              <button className="browseButton" onClick={() => document.getElementById('editProfilePic').click()}>Browse</button>
            </label>
            <input type="file" accept="image/*" id="editProfilePic" onChange={handleImageEdit} style={{ display: 'none' }} multiple />
          </div>

          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <div>
              <label>Description*</label>
            </div>
            <div>
              <textarea
                type="text"
                style={{ width: "95%", borderRadius: "10px",color:"var( --text-total-color)",
                  background: "var(--createPost-bg)",
                  border: "2px solid var(--light-border)", }}
                name="overViewOfStartup"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                cols={7}
              ></textarea>
            </div>
            <div>
              <label>Link</label>
            </div>
            <div>
              <textarea
                type="text"
                style={{ width: "95%", resize: "none", borderRadius: "10px",
                  background: "var(--createPost-bg)",color:"var( --text-total-color)",
                  border: "2px solid var(--light-border)", }}
                name="overViewOfStartup"
                value={link}
                onChange={(e) => setlink(e.target.value)}
                rows={2}
                cols={10}
              ></textarea>
            </div>
            <div><label>How do you categorise this post?</label></div>
            <div
              className="postTypeSelector"
              onClick={() => {
                document
                  .getElementsByClassName("postTypeContainer")[0]
                  .classList.toggle("show");
              }}
            >
              <div>{posttype}</div>
              <div>
                <i className="fas fa-caret-down"></i>
              </div>
            </div>
            <div className="postTypeContainer" style={{ width: "90%" }}>
              {postTypes.map((p) => (
                <div
                  className="individualPostTypes"
                  onClick={() => {
                    if (p.value !== "General Post") {
                      setposttype(p.value);
                    } else {
                      setposttype(p.value);
                      setUserPitchid(null);
                      setlink("");
                    }
                    document
                      .getElementsByClassName("postTypeContainer")[0]
                      .classList.remove("show");
                  }}
                >
                  {p.value}
                </div>
              ))}
            </div>
            <div><label>Tags</label></div>
            <div style={{ position: "relative" }}>
              <div
                className="postTypeSelector"
                onClick={() => {
                  document
                    .getElementsByClassName("userTags")[0]
                    .classList.toggle("show");
                }}
              >
              <div></div>
                <div>
                  <i className="fas fa-caret-down"></i>
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
                  <div className="searchedUsers" style={{ height: "150px" }}>
                    {filteredusers.length > 0 &&
                      filteredusers
                        .filter((f) => f.email !== email)
                        .map((a) => (
                          <div
                            className="individuals"
                            onClick={() => {
                              if (!usertags.map((m) => m._id).includes(a._id)) {
                                setuserTags((prev) => [...prev, a]);
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
                      setuserTags(usertags.filter((f) => f._id !== u._id));
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {posttype !== "General Post" && (
              <>
                <div
                  className="postTypeSelector"
                  onClick={() => {
                    document
                      .getElementsByClassName("createPostPitchContainer")[0]
                      .classList.toggle("show");
                  }}
                >
                  <div>Pitch: {userPitchId?.title}</div>
                  <div>
                    <i className="fas fa-caret-down"></i>
                  </div>
                </div>
                <div
                  className="postTypeContainer createPostPitchContainer"
                  style={{ width: "90%" }}
                >
                  {userPitches.map((p) => (
                    <div
                      className="individualPostTypes"
                      onClick={() => {
                        setUserPitchid(p);
                        document
                          .getElementsByClassName("createPostPitchContainer")[0]
                          .classList.remove("show");
                      }}
                    >
                      {p.title}
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
  className="postButton"
  onClick={updatePost}
  disabled={ description === "" ||
              posttype === "" ||
              loading}
>
  {loading ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
      }}
    >
      <div className="button-loader"></div>
      <div>
        <span style={{ marginLeft: "10px" }}>
          Updating...
        </span>
      </div>
    </div>
  ) : (
    "Update"
  )}
</button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPost;
