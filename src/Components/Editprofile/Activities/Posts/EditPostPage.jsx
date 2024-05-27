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
import "./CreatePostPage.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const EditPost = ({
  setEditPostpopup,
  editPostPopup,
  post,
  setAllPosts,
  EditPostCount,
}) => {
  const userPitches = useSelector((state) => state.conv.userLivePitches);
  const dispatch = useDispatch();

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const { email, role, userName, verification, user_id } = useSelector(
    (store) => store.auth.loginDetails
  );

  const [image, setImage] = useState("");
  const [posttype, setposttype] = useState("");
  const [description, setDescription] = useState("");

  const [allUsers, setAllusers] = useState([]);
  const [usertags, setuserTags] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredusers, setFilteredUsers] = useState([]);
  const [userPitchId, setUserPitchid] = useState(null);
  const [link, setlink] = useState("");

  useEffect(() => {
    if (post || EditPostCount) {
      setImage(post?.image);
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

  const updatePost = async (e) => {
    e.target.disabled = true;
    await ApiServices.updatePost({
      description,
      link,
      tags: usertags,
      pitchId: userPitchId?._id,
      image: image,
      createdBy: { _id: user_id, userName: userName, email: email },
      type: posttype,
      id: post?._id,
      openDiscussion: accessSetting === "public",
    })
      .then((res) => {
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
        setImage("");
        setposttype("");
        // new
        setAccessSetting("public");
        setFullDetails("");
        setGroupDiscussion("");
        setPostTitle("");
        navigate("/editProfile");
        // setEditPostpopup(false);

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

  // new
  const [fullDetails, setFullDetails] = useState("");
  const [groupDiscussion, setGroupDiscussion] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [accessSetting, setAccessSetting] = useState("public");

  const handleAccessChange = (e) => {
    setAccessSetting(e.target.value);
    setFullDetails("");
    setGroupDiscussion("");
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <main className="createPost-main-container">
      <div className="createPost-container">
        <div className="createPostHeader" style={{ position: "relative" }}>
          Update Post
        </div>

        <div className="createPost-privacy-setting">
          <div class="dropdown-container">
            <svg
              class="dropdown-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
              />
            </svg>
            <select
              id="accessSetting"
              name="accessSetting"
              value={accessSetting}
              onChange={handleAccessChange}
            >
              <option value="public">Public Forum</option>
              <option value="members">Members only</option>
            </select>
          </div>
        </div>

        <div className="createPost-tab-section">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Information" value="1" />
                  <Tab label="File Upload" value="2" />
                  <Tab label="Pitches / Links" value="3" />
                </TabList>
              </Box>
              <TabPanel
                value="1"
                style={{
                  maxHeight: "330px",
                  overflow: "scroll",
                  overflowX: "hidden",
                  scrollbarWidth: "thin",
                  scrollBehavior: "smooth",
                }}
              >
                <div>
                  <label className="createPost-labels">
                    Title
                    <span style={{ color: "red", marginLeft: "5px" }}> *</span>
                  </label>
                </div>
                <div className="createPost-textarea">
                  <textarea
                    type="text"
                    style={{
                      width: "100%",
                      height: "15px",
                      resize: "none",
                      borderRadius: "10px",
                      background: "var(--createPost-bg)",
                      border: "2px solid var(--light-border)",
                    }}
                    name="overViewOfStartup"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    rows={2}
                    cols={10}
                  ></textarea>
                </div>
                <div>
                  <label className="createPost-labels">
                    How do you categorise this post?{" "}
                    <span style={{ color: "red", marginLeft: "5px" }}> *</span>
                  </label>
                </div>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="black"
                        d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
                      />
                    </svg>{" "}
                  </div>
                </div>
                <div className="postTypeContainer">
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

                <div>
                  <label className="createPost-labels">
                    Post
                    <span style={{ color: "red", marginLeft: "5px" }}> *</span>
                  </label>
                </div>

                <div className="createPost-textarea">
                  <textarea
                    type="text"
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      background: "var(--createPost-bg)",
                      border: "2px solid var(--light-border)",
                    }}
                    name="overViewOfStartup"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={7}
                    cols={7}
                  ></textarea>
                </div>

                {accessSetting !== "public" && (
                  <div>
                    <div>
                      <label className="createPost-labels">Full Detail </label>
                    </div>
                    <div className="createPost-textarea">
                      <textarea
                        type="text"
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          color: "var( --text-total-color)",
                          background: "var(--createPost-bg)",
                          border: "2px solid var(--light-border)",
                        }}
                        name="overViewOfStartup"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={7}
                        cols={7}
                      ></textarea>
                    </div>

                    <div>
                      <label className="createPost-labels">
                        Group Description{" "}
                      </label>
                    </div>
                    <div className="createPost-textarea">
                      <textarea
                        type="text"
                        style={{
                          width: "100%",
                          height: "45px",
                          borderRadius: "10px",
                          background: "var(--createPost-bg)",
                          border: "2px solid var(--light-border)",
                        }}
                        name="overViewOfStartup"
                        value={groupDiscussion}
                        onChange={(e) => setGroupDiscussion(e.target.value)}
                        rows={7}
                        cols={7}
                      ></textarea>
                    </div>
                  </div>
                )}
              </TabPanel>

              <TabPanel value="2">
                <div>
                  {image !== undefined && image.url !== "" && image !== "" ? (
                    <div className="createPost-image-container">
                      <img
                        style={{
                          cursor: "pointer",
                          height: "200px",
                          width: "200px",
                          objectFit: "cover",
                        }}
                        src={image.url}
                        alt="Profile"
                      />

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                        onClick={() => setImage("")}
                        style={{
                          position: "relative",
                          bottom: "220px",
                          left: "150px",
                        }}
                      >
                        <title>Delete File</title>
                        <path
                          fill="red"
                          d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="profilePic" className="postUploadIcon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="2em"
                          height="2em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="black"
                            d="M2 12h2v5h16v-5h2v5c0 1.11-.89 2-2 2H4a2 2 0 0 1-2-2zM12 2L6.46 7.46l1.42 1.42L11 5.75V15h2V5.75l3.13 3.13l1.42-1.43z"
                          />
                        </svg>
                        <button
                          className="browseButton"
                          onClick={() =>
                            document.getElementById("profilePic").click()
                          }
                        >
                          Browse
                        </button>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        name=""
                        id="profilePic"
                        // onChange={handleImage}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="createPost-labels">Add Tags</label>
                </div>

                <div style={{ position: "relative" }}>
                  <div
                    className="postTypeSelector"
                    onClick={() => {
                      document
                        .getElementsByClassName("userTags")[0]
                        .classList.toggle("show");
                    }}
                  >
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="black"
                          d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
                        />
                      </svg>
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
                      <div
                        className="searchedUsers"
                        style={{ height: "150px" }}
                      >
                        {filteredusers.length > 0 &&
                          filteredusers
                            .filter((f) => f.email !== email)
                            .map((a) => (
                              <div
                                className="individuals"
                                onClick={() => {
                                  if (
                                    !usertags.map((m) => m._id).includes(a._id)
                                  ) {
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
                                          style={{
                                            height: "13px",
                                            width: "13px",
                                          }}
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
              </TabPanel>
              <TabPanel value="3">
                <div>
                  <label className="createPost-labels">Link</label>
                </div>
                <div className="createPost-textarea">
                  <textarea
                    type="text"
                    style={{
                      width: "100%",
                      height: "15px",
                      resize: "none",
                      borderRadius: "10px",
                      background: "var(--createPost-bg)",
                      color: "var( --text-total-color)",
                      border: "2px solid var(--light-border)",
                    }}
                    name="overViewOfStartup"
                    value={link}
                    onChange={(e) => setlink(e.target.value)}
                    rows={2}
                    cols={10}
                  ></textarea>
                </div>

                {posttype !== "General Post" && (
                  <>
                    <div>
                      <label className="createPost-labels">Add Pitch</label>
                    </div>

                    <div
                      className="postTypeSelector"
                      onClick={() => {
                        document
                          .getElementsByClassName("createPostPitchContainer")[0]
                          .classList.toggle("show");
                      }}
                    >
                      <div>{userPitchId?.title}</div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="black"
                            d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
                          />
                        </svg>{" "}
                      </div>
                    </div>

                    <div
                      className="postTypeContainer createPostPitchContainer"
                      style={{ width: "61%", borderRadius: "10px" }}
                    >
                      {userPitches.map((p) => (
                        <div
                          className="individualPostTypes"
                          onClick={() => {
                            setUserPitchid(p);
                            document
                              .getElementsByClassName(
                                "createPostPitchContainer"
                              )[0]
                              .classList.remove("show");
                          }}
                        >
                          {p.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </TabPanel>
            </TabContext>
          </Box>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            className="cancelButton"
            onClick={() => {
              navigate("/editProfile");
            }}
          >
            Cancel
          </button>
          <button
            className="createPost-Button"
            onClick={updatePost}
            disabled={description == "" || image == ""}
          >
            Update
          </button>
        </div>
      </div>
    </main>
  );
};

export default EditPost;
