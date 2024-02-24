import { useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom/dist";
import "../../Editprofile/Editprofile.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { jwtDecode } from "jwt-decode";
import { format } from "timeago.js";
import { AdminServices } from "../../../Services/AdminServices";
import {
  setLoading,
  setLoginData,
  setToast,
} from "../../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../../Toast/ToastColors";
import { convertToDate, socket_io } from "../../../Utils";
import { Box, Dialog, DialogContent } from "@mui/material";
import { gridCSS } from "../../CommonStyles";
import useWindowDimensions from "../../Common/WindowSize";

export const SingleRequestProfile = () => {
  const { visible } = useSelector((state) => state.auth.LoadingDetails);

  const { id } = useParams();
  const [skills, setSkills] = useState([]);

  const [inputs, setInputs] = useState({
    email: null,
    emailOtp: null,
    mobile: null,
    mobileOtp: null,
    name: null,
    role: null,
    image: null,
    isMobileOtpSent: null,
    isEmailOtpSent: null,
    emailVerified: null,
    mobileVerified: null,
    isEmailValid: null,
    isMobileValid: null,
    isNameValid: null,
  });

  const {
    mobile,
    mobileOtp,
    name,
    image,
    role,
    isMobileOtpSent,
    mobileVerified,
    updatedAt, email
  } = inputs;

  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [experienceDetails, setExperience] = useState({
    experience: "",
    job: "",
    qualification: "",
    fee: 1,
  });
  const [totalExperienceData, setTotalExperienceData] = useState([]);
  const [totalEducationData, setTotalEducationData] = useState([]);
  const [fee, setFee] = useState("");
  const [bio, setBio] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [town, settown] = useState("");
  const [oldDocs, setOldDocs] = useState({
    resume: "",
    expertise: "",
    acheivements: "",
    working: "",
    degree: "",
  });

  const [languagesKnown, setlanguagesKnown] = useState([]);
  const [singlelanguagesKnown, setSinglelanguagesKnown] = useState("");
  const { user_id } = useSelector((state) => state.auth.loginDetails);
  const [requestUserId, setRequestedUserId] = useState('')
  const navigate = useNavigate();
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    dispatch(setLoading({ visible: "yes" }));
    AdminServices.getApprovalRequestProfile({ userId: id })
      .then((res) => {
        // console.log(res.data);
        setRequestedUserId(res.data.userInfo._id)
        setInputs((prev) => ({
          ...prev,
          updatedAt: res.data.updatedAt,
          name: res.data.userName,
          mobile: res.data.phone,
          role: res.data.role,
          image: res.data.userInfo.image?.url || "",
          email: res.data.userInfo.email,
          status: res.data.verification,
          mobileVerified: true,
        }));

        if (res.data.documents !== undefined) {
          setOldDocs((prev) => ({
            ...prev,
            resume: res.data.documents.resume,
            expertise: res.data.documents.expertise,
            acheivements: res.data.documents.acheivements,
            working: res.data.documents.working,
            degree: res.data.documents.degree,
          }));
        }
        setTotalEducationData(res.data.educationDetails || []);
        setTotalExperienceData(res.data.experienceDetails || []);
        setFee(res.data.fee || "");
        setBio(res.data.bio || "");
        settown(res.data.town || "");
        setCountry(res.data.country || "");
        setState(res.data.state || "");
        dispatch(setLoading({ visible: "no" }));
        setSkills(res.data.skills || []);
        setlanguagesKnown(res.data.languagesKnown || []);
      })
      .catch((error) => {
        dispatch(
          setToast({
            message: "No User Found For Request",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        dispatch(setLoading({ visible: "no" }));
        navigate("/profileRequests");
      });
  }, [id]);

  const dispatch = useDispatch();

  const [reasonPop, setReasonPop] = useState(false);
  const [reason, setReason] = useState("");

  const update = async (e, status) => {
    e.preventDefault();
    e.target.disabled = true;
    // setIsLoading(true);
    if (status == "approved" || (status == "rejected" && reason !== "")) {
      await AdminServices.updateVerification({
        userId: id,
        status: status,
        reason: reason, 
      })
        .then((res) => {
          dispatch(
            setToast({
              message: `Profile Status changed to ${status}`,
              bgColor: ToastColors.success,
              visible: "yes",
            })
          );
          socket.current.emit("sendNotification", {
            senderId: user_id,
            receiverId: requestUserId,
          });
          // setIsLoading(false);
          e.target.disabled = false;
          navigate("/profileRequests");
          setReasonPop(false);
          setReason("");
        })
        .catch((err) => {
          e.target.disabled = false;
          dispatch(
            setToast({
              message: "Error occured when changing status",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
          // setIsLoading(false);
        });
      setTimeout(() => {
        dispatch(
          setToast({
            message: "",
            bgColor: "",
            visible: "no",
          })
        );
      }, 4000);
    } else {
      e.target.disabled = false;
      setReasonPop(true);
    }
  };

  return (
    visible === "no" && (
      <div className="update-container">
        <div className="updateContainerWrapper">
          <div className="heading">
            <div>
              <img
                className="heading-image"
                src={
                  image !== undefined && image !== "" ? image : "/profile.png"
                }
              />
            </div>

            <div className="profile-content">
              <div className="name-container">{name}</div>
              <div
                className="created"
                style={{
                  fontSize: "12px",
                  color: "#717B9E",
                  marginBottom: "40px",
                }}
              >
                Profile last updated -{" "}
                <span style={{ color: "black" }}>
                  <i class="fas fa-clock" style={{ marginRight: "5px" }}></i>
                  {format(updatedAt)}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  border: "0.2px solid #d3d3d3",
                  marginTop: "-20px",
                  marginBottom: "20px",
                }}
              ></div>

              <div
                style={{
                  fontSize: "16px",
                  color: "#474D6A",
                  lineHeight: "1.5",
                }}
              >
                <div
                  className="detailOf"
                  style={{
                    fontSize: "16px",
                    color: "#474D6A",
                    lineHeight: "1.5",
                  }}
                >
                  <i class="fas fa-user"></i> {role}
                  <br />
                  <i className="fas fa-envelope"></i>{email}{" "}
                  <img
                    src="/verify.png"
                    style={{ width: "15px", height: "15px", marginLeft: "5px" }}
                  />
                  <br />
                  <i className="fas fa-phone"></i> {mobile}{" "}
                  {mobileVerified && (
                    <img
                      src="/verify.png"
                      style={{
                        width: "15px",
                        height: "15px",
                        marginLeft: "5px",
                      }}
                    />
                  )}
                  <div className="mobile-verification">
                    <div
                      className="closeIcon"
                      onClick={() => {
                        document
                          .getElementsByClassName("mobile-verification")[0]
                          .classList.remove("showMobileVerification");
                      }}
                    >
                      <i className="fas fa-times Cross"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <>
            <div className="update-form-container">
              <h3 className="update-heading">Work Experience*</h3>

              {totalExperienceData.length > 0 &&
                totalExperienceData.map((te, i) => (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px",
                        }}
                      >
                        <div className="company">{te.company} </div>
                        <div className="profession">{te.profession}</div>
                        <div className="timeline">
                          {convertToDate(te.start)}-
                          {te.end == "" ? "Present" : convertToDate(te.end)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
          <div
            className="update-form-container"
            style={{ flexDirection: "column" }}
          >
            <h3 className="update-heading">Education Details*</h3>

            {totalEducationData.length > 0 &&
              totalEducationData.map((te, i) => (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                      }}
                    >
                      <div className="company">{te.college} </div>
                      <div className="profession">{te.grade}</div>
                      <div className="timeline">
                        {convertToDate(te.Edstart)}-
                        {te.Edend == "" ? "Present" : convertToDate(te.Edend)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="update-form-container">
            <h3 className="update-heading">Personal Info*</h3>
            <form className="update-form">
              <div className="personal-container">
                <div>
                  <div>
                    <label className="update-form-label">Country*</label>
                  </div>
                  <input type="text" value={country} disabled />
                </div>
                <div>
                  <div>
                    <label className="update-form-label">State*</label>
                  </div>
                  <input type="text" value={state} disabled />
                </div>

                <div>
                  <div>
                    <label className="update-form-label">Town/city*</label>
                  </div>
                  <input type="text" value={town} disabled />
                </div>
                {role == "Mentor" && (
                  <div>
                    <div>
                      <label className="update-form-label">Fee request</label>
                    </div>
                    <div>
                      <input
                        type="range"
                        min={1}
                        max={50}
                        name="fee"
                        id=""
                        disabled
                      />{" "}
                      &#8377; {fee} / per min
                    </div>
                  </div>
                )}

                <div>
                  <div>
                    <label className="update-form-label">Bio</label>
                  </div>
                  <textarea
                    style={{
                      resize: "none",
                      // border: "none",
                      textAlign: "justify",
                      fontFamily: "poppins",
                    }}
                    id=""
                    cols="50"
                    rows="5"
                    name="message"
                    value={bio}
                    placeholder="Enter your bio"
                  ></textarea>
                  <p>{1000 - bio.length} characters</p>
                </div>

                <div>
                  <div>
                    <label className="update-form-label">Skills</label>
                  </div>
                  <div>
                    {skills?.length > 0 && (
                      <div className="listedTeam">
                        {skills?.map((t, i) => (
                          <div className="singleMember">
                            <div>{t}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div>
                    <label className="update-form-label">Languages Known</label>
                  </div>
                  <div>
                    {languagesKnown?.length > 0 && (
                      <div className="listedTeam">
                        {languagesKnown?.map((t, i) => (
                          <div className="singleMember">
                            <div>{t}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="button-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "25%",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              {/* <button type="button" className="back-button" onClick={() => navigate(-1)}>Back</button> */}

              <button
                type="submit"
                className="reject-button"
                onClick={(e) => update(e, "rejected")}
                style={{ whiteSpace: "nowrap", position: "relative" }}
                disabled={inputs.status === "rejected"}
              >
                {/* {isLoading ? (
                                    <>
                                                             <div className="button-loader"></div>
                                        <span style={{ marginLeft: "12px" }}>Rejecting...</span>
                                    </>
                                ) : ( */}
                <>Reject</>
                {/* )} */}
              </button>
              <button
                type="submit"
                onClick={(e) => update(e, "approved")}
                style={{ whiteSpace: "nowrap", position: "relative" }}
                disabled={inputs.status === "approved"}
              >
                {isLoading ? (
                  <>
                    <div className="button-loader"></div>
                    <span style={{ marginLeft: "12px" }}>Approving...</span>
                  </>
                ) : (
                  <>Approve</>
                )}
              </button>
            </div>
          </div>
        </div>
        <Dialog
          open={reasonPop}
          onClose={() => setReasonPop(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={gridCSS.tabContainer}

          // sx={ gridCSS.tabContainer }
        >
          <DialogContent
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box>
              <b>Enter Reason for rejection</b>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: "5px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => setReasonPop(false)}
            >
              <CloseIcon />
            </Box>
            <Box className="singleProfile">
              <textarea
                style={{
                  resize: "none",
                  // border: "none",
                  textAlign: "justify",
                  fontFamily: "poppins",
                }}
                id=""
                name="message"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your bio"
              ></textarea>
            </Box>
            <button
              type="submit"
              disabled={reason == ""}
              onClick={(e) => {
                update(e, "rejected");
              }}
            >
              Ok
            </button>
          </DialogContent>
        </Dialog>
      </div>
    )
  );
};
