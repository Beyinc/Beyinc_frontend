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

const CreatePost = ({ setCreatePostpopup, createPostPopup, setAllPosts }) => {
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
  const [link, setlink] = useState("");
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
    e.target.disabled = true;
    await ApiServices.createPost({
      description,
      link,
      tags: usertags,
      pitchId: userPitchId?._id,
      image: image,
      createdBy: { _id: user_id, userName: userName, email: email },
      type: posttype,
      openDiscussion:
        userPitchId !== null &&
        userPitchId !== undefined &&
        posttype !== "General Post",
    })
      .then((res) => {
        setDescription("");
        setUserPitchid(null);
        setlink("");
        setuserTags([]);
        setImage("");
        setposttype("");
        setCreatePostpopup(false);
        setAllPosts((prev) => [res.data, ...prev]);
        for (let i = 0; i < usertags.length; i++) {
          socket.current.emit("sendNotification", {
            senderId: user_id,
            receiverId: usertags[i]._id,
          });
        }
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

  return (
    <Dialog
      fullWidth
      open={createPostPopup}
      onClose={() => {
        setDescription("");
        setUserPitchid(null);

        setlink("");
        setuserTags([]);
        setImage("");
        setposttype("");
        setCreatePostpopup(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xl"
      sx={{
        ...gridCSS.tabContainer,
        width: "1100px",
        height: "740px",
        marginLeft: "13%",
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
          Create Post
          <div
            style={{ position: "absolute", right: "10px", top: "10px" }}
            onClick={() => {
              setDescription("");
              setUserPitchid(null);

              setlink("");
              setuserTags([]);
              setImage("");
              setposttype("");
              setCreatePostpopup(false);
            }}
          >
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {image !== undefined && image !== "" ? (
            <div style={{ position: "relative" }}>
              <img
                style={{
                  cursor: "pointer",
                  height: "500px",
                  width: "500px",
                }}
                src={image}
                alt="Profile"
              />
              <div
                style={{ position: "absolute", right: "10px", top: "10px" }}
                onClick={() => setImage("")}
              >
                <i class="fas fa-times"></i>
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="profilePic"
                className="postUploadIcon"
                style={{ marginLeft: "30px", marginTop: "140px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="3em"
                  height="3em"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18.944 11.112C18.507 7.67 15.56 5 12 5C9.244 5 6.85 6.611 5.757 9.15C3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5l4 5h-3z"
                    fill="gray"
                  />
                </svg>
              </label>
              <input
                type="file"
                accept="image/*,.webp"
                name=""
                id="profilePic"
                onChange={handleImage}
                style={{ display: "none" }}
              />
              <button
                className="browseButton"
                onClick={() => document.getElementById("profilePic").click()}
              >
                Browse
              </button>{" "}
            </div>
          )}

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
                style={{
                  width: "95%",
                  borderRadius: "10px",
                  background: "var(--createPost-bg)",
                  border: "2px solid var(--light-border)",
                }}
                name="overViewOfStartup"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                cols={10}
              ></textarea>
            </div>
            <div>
              <label>Link</label>
            </div>
            <div>
              <textarea
                type="text"
                style={{
                  width: "95%",
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
            <div>How do you categorise this post?</div>
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
            <div
              className="postTypeContainer"
              style={{ width: "97%", borderRadius: "10px" }}
            >
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
            <div>Add Tags</div>
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
                <div>Add Pitch</div>
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
                    <i className="fas fa-caret-down"></i>
                  </div>
                </div>
                <div
                  className="postTypeContainer createPostPitchContainer"
                  style={{ width: "97%", borderRadius: "10px" }}
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

            <div className="postButtonsContainer">
              <button className="draftButton">Save Draft</button>
              <button
                className="postButton"
                onClick={addingpost}
                disabled={description == "" || image == ""}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
