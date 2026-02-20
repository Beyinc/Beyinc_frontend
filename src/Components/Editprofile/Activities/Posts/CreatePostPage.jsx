import React, { useEffect, useRef, useState } from "react";
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
import { useParams } from "react-router";
// import EditPost from "./EditPost";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePostPage = () => {
  const { postId } = useParams();
  const userPitches = useSelector((state) => state.conv.userLivePitches);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const {
    email,
    role,
    userName,
    verification,
    user_id,
    image: loggedImage,
  } = useSelector((store) => store.auth.loginDetails);
  const userDetailsRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "menu"
    ) {
      document
        .getElementsByClassName(`postTypeContainer`)[0]
        ?.classList.remove("show");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [images, setImages] = useState([]);
  const [posttype, setposttype] = useState("");
  const [description, setDescription] = useState("");
  const [link, setlink] = useState("");

  const handleImage = (e) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 4 * 1024 * 1024;
    const oversized = files.find((f) => f.size > maxSize);
    if (oversized) {
      alert(
        `Each file should be less than ${(maxSize) / (1024 * 1024)} MB.`
      );
      e.target.value = null; // Clear the selected files
      return;
    }
    Promise.all(files.map(readFileAsDataURL)).then((dataUrls) => {
      setImages((prev) => [...prev, ...dataUrls]);
    });
  };
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const [allUsers, setAllusers] = useState([]);
  const [usertags, setuserTags] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredusers, setFilteredUsers] = useState([]);
  const [userPitchId, setUserPitchid] = useState(null);

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

  const addingpost = async (e) => {
    console.log(description, postTitle, posttype, accessSetting);

    e.target.disabled = true;
    setLoading(true);
    await ApiServices.createPost({
      description,
      link,
      fullDetails,
      groupDiscussion,
      postTitle,
      visibility: accessSetting,
      tags: usertags,
      pitchId: userPitchId?._id,
      images: images.length ? images : null,
      createdBy: { _id: user_id, userName: userName, email: email },
      type: posttype,
      openDiscussion: accessSetting === "public",
    })
      .then((res) => {
        setLoading(false);
        dispatch(
          setToast({
            message: "Your post successfully posted",
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
        setAccessSetting("public");
        setFullDetails("");
        setGroupDiscussion("");
        setPostTitle("");

        for (let i = 0; i < usertags.length; i++) {
          socket.current.emit("sendNotification", {
            senderId: user_id,
            receiverId: usertags[i]._id,
          });
        }
        navigate("/posts");
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
  const [privacy, setPrivacy] = useState("public"); // Default privacy value
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePrivacyChange = (value) => {
    setPrivacy(value);
    setShowDropdown(false);
  };

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [accessSetting, setAccessSetting] = useState("public");

  const handleAccessChange = (e) => {
    // Logging the selected value for debugging
    console.log("Selected access setting:", e.target.value);

    setAccessSetting(e.target.value);
    setFullDetails("");
    setGroupDiscussion("");
  };

  const [fullDetails, setFullDetails] = useState("");
  const [groupDiscussion, setGroupDiscussion] = useState("");
  const [postTitle, setPostTitle] = useState("");

  const updatePost = async (e) => {
    e.target.disabled = true;
    setLoading(true);
    await ApiServices.updatePost({
      description,
      link,
      postTitle,
      tags: usertags,
      pitchId: userPitchId?._id,
      images: images.length ? images : null,
      createdBy: { _id: user_id, userName: userName, email: email },
      type: posttype,
      id: postId,
      openDiscussion: accessSetting === "public",
      visibility: accessSetting,
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
        setAccessSetting("public");
        setFullDetails("");
        setGroupDiscussion("");
        setPostTitle("");
        navigate("/posts");

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

  // getting existing post details
  useEffect(() => {
    if (postId !== undefined) {
      ApiServices.getPost({ id: postId })
        .then((res) => {
          console.log(res.data);
          setPostTitle(res.data.postTitle);
          setDescription(res.data.description);
          setposttype(res.data.type);
          setuserTags(res.data.tags);
          setImages(res.data.images ?? (res.data.image ? [res.data.image] : []));
          setlink(res.data.link);
          setAccessSetting(res.data.openDiscussion ? "public" : "private");
          setFullDetails(res.data.fullDetails);
          setGroupDiscussion(res.data.groupDiscussion);
          setUserPitchid(res.data.pitchId);
        })
        .catch((err) => {
          dispatch(
            setToast({
              message: "Error occured when updating Pitch",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    }
  }, [postId]);

  const modules = {
    toolbar: [
      // [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      // [{size: []}],
      ["bold", "italic", "underline"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      // ['clean']
    ],
  };

  return (
    <main className="createPost-main-container">
      <div className="createPost-container">
        <div className="createPostHeader">
          {postId === undefined ? "Create Post" : "Update Post"}
        </div>
        {/* <div className="createPost-privacy-setting">
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
              <option value="public">Public Post</option>
              <option value="private">Private Post</option>
            </select>
          </div>
        </div> */}
        
        <div className="createPost-privacy-setting">
          <div className="privacy-toggle-wrapper">
            <span className="privacy-label">Public</span>

            <label className="privacy-switch">
              <input
                type="checkbox"
                checked={accessSetting === "private"}
                onChange={(e) =>
                  setAccessSetting(e.target.checked ? "private" : "public")
                }
              />
              <span className="privacy-slider"></span>
            </label>

            <span className="privacy-label">Private</span>
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
                  <Tab label="Information" value="1" className="Testing-Tab" />
                  <Tab label="File Upload" value="2" className="Testing-Tab" />
                  {/* <Tab
                    label="Pitches / Links"
                    value="3"
                    className="Testing-Tab"
                  /> */}
                </TabList>
              </Box>
              <TabPanel
                value="1"
                style={
                  {
                    // maxHeight: "330px",
                    // overflow: "scroll",
                    // overflowX: "hidden",
                    // scrollbarWidth: "thin",
                    // scrollBehavior: "smooth",
                  }
                }
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
                      width: "96%",
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
                  <div
                    style={{
                      color: "var(--text-total-color)",
                      fontFamily: "'Gentium Book Basic', serif",
                    }}
                  >
                    {posttype}
                  </div>
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
                <div className="postTypeContainer" ref={userDetailsRef}>
                  {postTypes.map((p) => (
                    <div
                      key={p.value}
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
                    Post{" "}
                    <span style={{ color: "red", marginLeft: "5px" }}> *</span>
                  </label>
                </div>
                <div>
                  <div
                    className="createPost-textarea w-full"
                    style={{ width: "100%" }}
                  >
                    <div className="quill-editor-wrapper overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        modules={modules}
                      />
                    </div>
                  </div>
                </div>

                {accessSetting !== "public" && (
                  <div>
                    <div>
                      <label
                        className="createPost-labels"
                        style={{
                          marginTop: "60px",
                        }}
                      >
                        Full Detail{" "}
                      </label>
                    </div>
                    <div className="createPost-textarea">
                      <textarea
                        type="text"
                        style={{
                          width: "96%",
                          height: "45px",
                          borderRadius: "10px",
                          background: "var(--createPost-bg)",
                          border: "2px solid var(--light-border)",
                          fontFamily: "'Gentium Book Basic', serif",
                        }}
                        name="overViewOfStartup"
                        value={fullDetails}
                        onChange={(e) => setFullDetails(e.target.value)}
                        rows={7}
                        cols={7}
                      ></textarea>
                    </div>

                    {/* <div>
                      <label className="createPost-labels">
                        Group Discussion{" "}
                      </label>
                    </div> */}
                    {/* <div className="createPost-textarea">
                      <textarea
                        type="text"
                        style={{
                          width: "96%",
                          height: "45px",
                          borderRadius: "10px",
                          background: "var(--createPost-bg)",
                          border: "2px solid var(--light-border)",
                          fontFamily: "'Gentium Book Basic', serif",
                        }}
                        name="overViewOfStartup"
                        value={groupDiscussion}
                        onChange={(e) => setGroupDiscussion(e.target.value)}
                        rows={7}
                        cols={7}
                      ></textarea>
                    </div> */}
                  </div>
                )}
              </TabPanel>

              <TabPanel value="2">
                <div>
                  {images && images.length > 0 ? (
                    <div className="createPost-image-container">
                      <div className="createPost-image-previews">
                        {images.map((img, idx) => (
                          <div key={idx} className="image-thumb">
                            <img
                              src={img?.url ? img.url : img}
                              alt={`post-${idx}`}
                            />
                            <button type="button" className="remove-btn" aria-label="Remove image" onClick={() => setImages(prev => prev.filter((_,i)=>i!==idx))}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="createPost-image-container"></div>
                  )}
                  <div className="postUploadContainer" style={{ marginTop: "10px" }}>
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
                      onChange={handleImage}
                      style={{ display: "none" }}
                      multiple
                    />
                  </div>
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
                    <div></div>
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
                        style={{ height: "350px" }}
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
                  <div className="selected-domains">
                    {usertags?.map((u, i) => (
                      <div key={u} className="selected-domain">
                        <span>{u.userName}</span>
                        <button
                          className="domain-delete-button"
                          onClick={() => {
                            setuserTags(
                              usertags.filter((f) => f._id !== u._id)
                            );
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
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
                      width: "96%",
                      height: "15px",
                      resize: "none",
                      borderRadius: "10px",
                      background: "var(--createPost-bg)",
                      border: "2px solid var(--light-border)",
                    }}
                    name="overViewOfStartup"
                    value={link}
                    onChange={(e) => setlink(e.target.value)}
                    rows={2}
                    cols={10}
                  ></textarea>
                </div>

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
                    <div style={{ fontFamily: "'Gentium Book Basic', serif" }}>
                      {userPitchId?.title}
                    </div>
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
            type="button"
            className="cancelButton"
            onClick={() => {
              navigate("/posts");
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="createPost-Button"
            onClick={postId === undefined ? addingpost : updatePost}
            disabled={
              description === "" ||
              postTitle === "" ||
              posttype === "" ||
              loading
            }
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
                    {postId === undefined ? "Posting..." : "Updating..."}
                  </span>
                </div>
              </div>
            ) : postId === undefined ? (
              "Post"
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default CreatePostPage;
