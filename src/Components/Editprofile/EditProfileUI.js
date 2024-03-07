import { useSelector } from "react-redux";
import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setLoginData,
  setToast,
  setLoading,
} from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import axiosInstance from "../axiosInstance";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ApiServices } from "../../Services/ApiServices";
import { useNavigate } from "react-router-dom/dist";
import "./EditProfileUI.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Country, State, City } from "country-state-city";
import { AdminServices } from "../../Services/AdminServices";
import { jwtDecode } from "jwt-decode";
import { format } from "timeago.js";

import { Box, Dialog, DialogContent } from "@mui/material";
import {
  allLanguages,
  allskills,
  convertToDate,
  itPositions,
  socket_io,
  allsalutations,
  mentorcategories,
} from "../../Utils";
import { Autocomplete, TextField } from "@mui/material";
import useWindowDimensions from "../Common/WindowSize";
import ProfileImageUpdate from "../Navbar/ProfileImageUpdate";
import { io } from "socket.io-client";
import { gridCSS } from "../CommonStyles";
const EditProfileUI = () => {
  const { id } = useParams();
  const { user_id } = useSelector((store) => store.auth.loginDetails);
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);

  const [showPreviousFile, setShowPreviousFile] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [inputs, setInputs] = useState({
    mentorCategories: null,
    salutation: null,
    email: null,
    userName: null,
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
    // email,
    // emailOtp,
    salutation,
    mentorCategories,
    email,
    role,
    userName,
    mobile,
    mobileOtp,
    name,
    //  role,
    image,
    // isEmailOtpSent,
    isMobileOtpSent,
    // emailVerified,
    mobileVerified,
    isEmailValid,
    isMobileValid,
    isNameValid,
    updatedAt,
  } = inputs;

  const [nameChanger, setNameChanger] = useState(false);
  const { height, width } = useWindowDimensions();
  const [Logo, SetLogo] = useState("");
  const [Banner, SetBanner] = useState("");
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalExperienceData, setTotalExperienceData] = useState([]);
  const [totalEducationData, setTotalEducationData] = useState([]);
  const [experienceDetails, setExperience] = useState({
    business: "",
    company: "",
    institute: "",
    designation: "",
    Department: "",
    Research: "",
    year: "",
    start: "",
    end: "",
    Achievements: "",
    Published: "",
    StartupExperience: "",
    Consultancy: "",
    Profession: "",
    TotalWorkExperience: "",
    Description: "",
    startupName: '',
    // Technology Partner
    Customers: "",
    CompanyLocation: "",
    Banner: "",
    Logo: "",
    Services: "",
    workingStatus: ""
  });
  const [EducationDetails, setEducationDetails] = useState({
    year: "",
    grade: "",
    college: "",
    Edstart: "",
    Edend: "",
  });
  const [fee, setFee] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [singleSkill, setSingleSkill] = useState("");
  const [editOwnProfile, setEditOwnProfile] = useState(false);
  const [languagesKnown, setlanguagesKnown] = useState([]);
  const [singlelanguagesKnown, setSinglelanguagesKnown] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [town, settown] = useState("");
  const [collegeQuery, setCollegeQuery] = useState("");
  const [editingExperienceId, seteditingExperienceId] = useState("")
  const [editingEducationId, seteditingEducationId] = useState("")

  const [places, setPlaces] = useState({
    country: [],
    state: [],
    town: [],
  });
  const [open, setOpen] = useState(false);

  const [isInputPopupVisible, setIsInputPopupVisible] = useState(false);
  const [isAboutPopupVisible, setIsAboutPopupVisible] = useState(false);
  const [isExperiencePopupVisible, setIsExperiencePopupVisible] =
    useState(false);
  const [isEducationPopupVisible, setIsEducationPopupVisible] = useState(false);
  const handleEditButtonClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    if (id === undefined) {
      setIsInputPopupVisible(true);
    }
  };

  const handleAboutButtonClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    setIsAboutPopupVisible(true);
  };


  const handleBannerImage = (e) => {
    SetBanner(e.target.files[0].name);
    const file = e.target.files[0];
    if (file.size > 4 * 1024 * 1024) {
      alert(
        `File size should be less than ${(4 * 1024 * 1024) / (1024 * 1024)} MB.`
      );
      e.target.value = null; // Clear the selected file
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setExperience((prev) => ({ ...prev, Banner: reader.result }));
    };
  };

  const handleLogoImage = (e) => {
    SetLogo(e.target.files[0].name);
    const file = e.target.files[0];
    if (file.size > 4 * 1024 * 1024) {
      alert(
        `File size should be less than ${(4 * 1024 * 1024) / (1024 * 1024)} MB.`
      );
      e.target.value = null; // Clear the selected file
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setExperience((prev) => ({ ...prev, Logo: reader.result }));
    };
  };


  const handleExperienceButtonClick = () => {
    if (role == "Mentor" && mentorCategories == null) {
      dispatch(
        setToast({
          message: "Please select Mentor Categories in Personal Information",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    setIsExperiencePopupVisible(true);
  };
  const handleEducationButtonClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
    setIsEducationPopupVisible(true);
  };

  useEffect(() => {
    if (country == "" && state == "" && town == "") {
      setPlaces({
        country: Country.getAllCountries(),
        state: [],
        town: [],
      });
    } else if (country !== "" && state == "" && town == "") {
      setPlaces({
        country: Country.getAllCountries(),
        state: State.getStatesOfCountry(country.split("-")[1]),
        town: [],
      });
    } else if (country !== "" && state !== "" && town == "") {
      setPlaces({
        country: Country.getAllCountries(),
        state: State.getStatesOfCountry(country.split("-")[1]),
        town: City.getCitiesOfState(country.split("-")[1], state.split("-")[1]),
      });
    }
  }, [country, state, town]);

  const addExperience = (e) => {
    e.preventDefault();
    if (editingExperienceId == '') {
      setTotalExperienceData((prev) => [...prev, experienceDetails]);
    } else {
      setTotalExperienceData(totalExperienceData.map((t, i) => {
        return i + 1 === editingExperienceId ? experienceDetails : t
      }))
      setIsExperiencePopupVisible(false);
      seteditingExperienceId('')
      document.getElementsByTagName("body")[0].style.overflowY =
        "scroll";
    }
    SetBanner('')
    SetLogo('')
    setExperience({
      areaOfBusiness: "",
      business: "",
      institute: "",
      startupName: '',
      workingStatus: "",
      company: "",
      designation: "",
      Department: "",
      Research: "",
      year: "",
      start: "",
      end: "",
      Achievements: "",
      Published: "",
      StartupExperience: "",
      Consultancy: "",
      Profession: "",
      TotalWorkExperience: "",
      Description: "",
      // Technology Partner
      Customers: "",
      CompanyLocation: "",
      Banner: "",
      Logo: "",
      Services: "",
    });
  };
  const addEducation = (e) => {

    e.preventDefault();
    if (editingEducationId == '') {
      setTotalEducationData((prev) => [...prev, EducationDetails]);
    } else {
      setTotalEducationData(totalEducationData.map((t, i) => {
        return i+1 === editingEducationId ? EducationDetails : t
      }))
      setIsEducationPopupVisible(false);
      seteditingEducationId('')
      document.getElementsByTagName("body")[0].style.overflowY =
        "scroll";
    }
    setEducationDetails({
      year: "",
      grade: "",
      college: "",
      Edstart: "",
      Edend: "",
    });
    
  };

  const [changeResume, setchangeDocuments] = useState({
    resume: "",
    expertise: "",
    acheivements: "",
    working: "",
    degree: "",
  });
  const [oldDocs, setOldDocs] = useState({
    resume: "",
    expertise: "",
    acheivements: "",
    working: "",
    degree: "",
  });

  const [recentUploadedDocs, setRecentUploadedDocs] = useState({
    resume: "",
    expertise: "",
    acheivements: "",
    working: "",
    degree: "",
  });

  const handleChange = (e) => {
    setExperience((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEducationChange = (e, isCollege) => {
    setEducationDetails((prev) => ({
      ...prev,
      [isCollege ? "college" : e.target.name]: isCollege
        ? universities[e.target.getAttribute("data-option-index")]?.name
        : e.target.value,
    }));
  };

  const handleResume = (e) => {
    const file = e.target.files[0];
    setRecentUploadedDocs((prev) => ({ ...prev, [e.target.name]: file?.name }));
    setFileBase(e, file);
  };
  const setFileBase = (e, file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setchangeDocuments((prev) => ({
        ...prev,
        [e.target.name]: reader.result,
      }));
    };
  };
  useEffect(() => {
    const hasEducation = totalEducationData.length > 0;
    const hasWorkExperience = totalExperienceData.length > 0;
    setIsFormValid(hasEducation && hasWorkExperience);
  }, [totalEducationData, totalExperienceData]);

  const [reasonPop, setReasonPop] = useState(false);
  const [reason, setReason] = useState("");
  const [requestUserId, setRequestedUserId] = useState("");
  useEffect(() => {
    if (id == undefined) {
      ApiServices.getProfile({ id: user_id })
        .then((res) => {
          setEditOwnProfile(true);
          setInputs((prev) => ({
            ...prev,
            updatedAt: res.data.updatedAt,
            name: res.data.userName,
            mobile: res.data.phone,
            role: res.data.role,
            mobileVerified: true,
            image: res.data.image?.url || "",
            email: res.data.email,
            salutation: res.data.salutation,
            mentorCategories: res.data.mentorCategories,
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
            setchangeDocuments((prev) => ({
              ...prev,
              resume: res.data.documents?.resume || "",
              expertise: res.data.documents?.expertise || "",
              acheivements: res.data.documents?.acheivements || "",
              working: res.data.documents?.working || "",
              degree: res.data.documents?.degree || "",
            }));
            setTotalEducationData(res.data.educationDetails || []);
            setTotalExperienceData(res.data.experienceDetails || []);
            setFee(res.data.fee || "");
            setBio(res.data.bio || "");
            setSkills(res.data.skills || []);
            setlanguagesKnown(res.data.languagesKnown || []);

            settown(res.data.town || "");
            setCountry(res.data.country || "");
            setState(res.data.state || "");
            setPlaces({
              country: Country.getAllCountries(),
              state:
                State.getStatesOfCountry(res.data.country?.split("-")[1]) || [],
              town:
                City.getCitiesOfState(
                  res.data.country?.split("-")[1],
                  res.data.state?.split("-")[1]
                ) || [],
            });
          }
        })

        .catch((error) => {
          dispatch(
            setToast({
              message: error?.response?.data?.message,
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        });
    } else {
      // Admin functionality
      AdminServices.getApprovalRequestProfile({ userId: id })
        .then((res) => {
          setEditOwnProfile(false);
          // console.log(res.data);
          setRequestedUserId(res.data.userInfo._id);
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
            salutation: res.data.salutation,
            mentorCategories: res.data.mentorCategories,
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
    }
  }, [email, id]);

  // Admi approval function
  const adminupdate = async (e, status) => {
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
    } else {
      e.target.disabled = false;
      setReasonPop(true);
    }
  };

  const handleChanges = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "name") {
      setInputs((prev) => ({ ...prev, isNameValid: e.target.value !== "" }));
    }
    if (e.target.name === "email") {
      setInputs((prev) => ({
        ...prev,
        isEmailValid: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/.test(
          e.target.value
        ),
      }));
    }
    if (e.target.name === "mobile") {
      setInputs((prev) => ({
        ...prev,
        isMobileValid: /^[0-9]{10}$/.test(e.target.value),
      }));
      setInputs((prev) => ({
        ...prev,
        mobileVerified: false,
        isMobileOtpSent: false,
      }));
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendMobileOtpF = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    await ApiServices.sendMobileOtp({
      phone: `+91${mobile}`,
      type: "",
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "OTP sent successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        // setIsEmailOtpSent(true);
        setInputs((prev) => ({ ...prev, isMobileOtpSent: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: err.response.data,
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = true;
      });
  };

  const verifyMobileOtp = async (e) => {
    e.preventDefault();
    await ApiServices.verifyOtp({
      email: `+91${mobile}`,
      otp: mobileOtp,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Mobile verified successfully !",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        document.getElementById("mobileVerify").style.display = "none";
        document.getElementById("mobileOtpInput").disabled = true;
        // setmobileVerified(true);
        setInputs((prev) => ({ ...prev, mobileVerified: true }));
      })
      .catch((err) => {
        dispatch(
          setToast({
            message: "Incorrect OTP",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
      });
  };
  const update = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    e.target.disabled = true;
    console.log({
      salutation: salutation,
      mentorCategories: mentorCategories,
      email: email,
      userId: user_id,
      state: state,
      town: town,
      country: country,
      userName: name,
      phone: mobile,
      role: role,
      fee: fee,
      bio: bio,
      skills: skills,
      languagesKnown: languagesKnown,
      documents: changeResume,
      experienceDetails: totalExperienceData,
      educationdetails: totalEducationData,
    })
    await ApiServices.sendForApproval({
      salutation: salutation,
      mentorCategories: mentorCategories,
      email: email,
      userId: user_id,
      state: state,
      town: town,
      country: country,
      userName: name,
      phone: mobile,
      role: role,
      fee: fee,
      bio: bio,
      skills: skills,
      languagesKnown: languagesKnown,
      documents: changeResume,
      experienceDetails: totalExperienceData,
      educationdetails: totalEducationData,
    })
      .then((res) => {
        dispatch(
          setToast({
            message: "Profile Sent for approval",
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        setInputs({
          email: null,
          emailOtp: null,
          mobile: null,
          mobileOtp: null,
          name: null,
          role: null,
          isMobileOtpSent: null,
          isEmailOtpSent: null,
          emailVerified: null,
          mobileVerified: null,
          isEmailValid: null,
          isMobileValid: null,
          isNameValid: null,
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(setLoginData(jwtDecode(res.data.accessToken)));
        navigate("/dashboard");
        setIsLoading(false);
      })
      .catch((err) => {
        e.target.disabled = false;
        dispatch(
          setToast({
            message: "Error occurred while sending profile to approval",
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        setIsLoading(false);
      });
  };

  // const sendMobileOtp = (e) => {
  //   e.preventDefault();
  //   e.target.disabled = true;
  //   setTimeout(() => {
  //     // setIsMobileOtpSent(true);
  //     setInputs((prev) => ({ ...prev, isMobileOtpSent: true }));
  //   }, 1000);
  // };

  const [isFormValid, setIsFormValid] = useState(
    mobileVerified &&
    (isNameValid ||
      oldDocs.resume !== "" ||
      oldDocs.expertise !== "" ||
      oldDocs.acheivements !== "" ||
      oldDocs.working !== "" ||
      oldDocs.degree !== "" ||
      changeResume.resume !== "" ||
      changeResume.expertise !== "" ||
      changeResume.acheivements !== "" ||
      changeResume.working !== "" ||
      changeResume.degree !== "") &&
    totalEducationData.length > 0 &&
    totalExperienceData.length > 0
  );

  const handleChangeRadio = (e) => {
    setInputs((prev) => ({ ...prev, role: e.target.value }));
  };
  useEffect(() => {
    dispatch(setLoading({ visible: "yes" }));
    ApiServices.getAllRoles()
      .then((res) => {
        setRoles(res.data);
        dispatch(setLoading({ visible: "no" }));
      })
      .catch((err) => {
        // console.log(err);
        if (err.message == "Network Error") {
          dispatch(
            setToast({
              message: "Check your network connection",
              bgColor: ToastColors.failure,
              visible: "yes",
            })
          );
        }
      });
  }, []);

  const hadnleCollegeQueryChange = (e) => {
    setCollegeQuery(e.target.value);
  };

  useEffect(() => {
    if (collegeQuery === "") {
      setUniversities([]);
    }
    if (collegeQuery.length > 2) {
      const timeoutId = setTimeout(
        async () =>
          await axios
            .post(process.env.REACT_APP_BACKEND + "/helper/allColleges", {
              name: collegeQuery,
            })
            .then((res) => {
              // console.log(res.data.college.length);
              setUniversities(res.data.college);
            }),
        500
      );
      return () => clearTimeout(timeoutId);
    } else setUniversities([]);
  }, [collegeQuery]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <main className="EditProfile-Container">
      <section className="EditProfile-personal-Container">
        <div className="Personal-Information">
          <div className="Banner">
            <Slider {...settings}>
              <div>
                <img src="/Banner-1.png" alt="Image 1" />
              </div>
              <div>
                <img src="/Banner-2.png" alt="Image 2" />
              </div>
            </Slider>
          </div>
          <div className="Profile-Image">
            <div>
              <img
                src={
                  image !== undefined && image !== "" ? image : "/profile.png"
                }
              />
              {id == undefined && (
                <i
                  class="fas fa-camera hover-icon"
                  onClick={() => {
                    if (id == undefined) {
                      setOpen(true);
                    }
                  }}
                ></i>
              )}
            </div>
            <div className="Personal-Details">
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {salutation}
                  {salutation && <span>.</span>} {name}
                </div>
                {id == undefined && (
                  <span>
                    <i
                      onClick={handleEditButtonClick}
                      className="fas fa-pen"
                    ></i>
                  </span>
                )}
              </div>
              <div style={{ fontWeight: "500", fontSize: "18px" }}>
                {role} {role == "Mentor" && mentorCategories}
              </div>
              <div style={{ fontSize: "16px" }}>{email}</div>
              <div style={{ fontSize: "16px" }}>{mobile}</div>
              <div className="language-display">
                {languagesKnown?.map((t, i) => (
                  <div>
                    <div className="single-language">{t}</div>
                  </div>
                ))}
              </div>
              {/* <div style={{ fontSize: "16px" }}> &#8377; {fee} / per min</div>
              <div>{}</div> */}
            </div>
          </div>

          {/* <div
            style={{
              fontSize: "12px",
              color: "#717B9E",
              textAlign: "center",
              marginTop: "5px",
            }}
          >
            Profile last updated -{" "}
            <span style={{ color: "black" }}>
              <i class="fas fa-clock" style={{ marginRight: "5px" }}></i>
              {format(updatedAt)}
            </span>
          </div> */}
          {isInputPopupVisible && (
            <div className="popup-container">
              <div className="popup-content">
                <div className="Inputs-Container">
                  <div className="Input_Wrapper">
                    <h3 style={{ textAlign: "center" }}>
                      Personal Information
                    </h3>

                    {role === "Mentor" && (
                      <div>
                        <label className="Input-Label">salutation</label>
                        <select
                          name="salutation"
                          id=""
                          value={salutation}
                          onChange={(e) => {
                            setInputs((prev) => ({
                              ...prev,
                              salutation: e.target.value,
                            }));
                          }}
                        >
                          <option value="">Select</option>
                          {allsalutations.map((op) => (
                            <option>{op}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <label className="Input-Label">Full Name</label>
                    <div className="Input_Fields">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setInputs((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                        }}
                      />
                    </div>

                    {role === "Mentor" && (
                      <div>
                        <label className="Input-Label">Mentor Categories</label>
                        <select
                          name="mentorCategories"
                          id=""
                          value={mentorCategories}
                          onChange={(e) => {
                            setInputs((prev) => ({
                              ...prev,
                              mentorCategories: e.target.value,
                            }));
                          }}
                        >
                          <option value="">Select</option>
                          {mentorcategories.map((op) => (
                            <option>{op}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <label className="Input-Label">Mobile Number</label>
                    <div className="Input_Fields">
                      <div>
                        <div>
                          <input
                            type="text"
                            className={
                              mobile !== null &&
                              (mobile.length === 10 ? "valid" : "invalid")
                            }
                            name="mobile"
                            id="mobile"
                            value={mobile}
                            onChange={handleChanges}
                            placeholder="Mobile Number"
                          />
                          {mobileVerified === true}
                        </div>

                        <div>
                          {!isMobileOtpSent && isMobileValid && (
                            <button
                              type="button"
                              className="otp_Button"
                              onClick={sendMobileOtpF}
                            >
                              Get OTP
                            </button>
                          )}
                        </div>
                        <div>
                          {isMobileOtpSent && mobileVerified !== true && (
                            <>
                              <div>
                                <input
                                  type="text"
                                  className={
                                    mobileOtp !== null &&
                                    (mobileOtp.length === 6
                                      ? "valid"
                                      : "invalid")
                                  }
                                  name="mobileOtp"
                                  value={mobileOtp}
                                  onChange={handleChanges}
                                  placeholder="Enter Mobile OTP"
                                  id="mobileOtpInput"
                                />
                                <div>
                                  {mobileOtp !== null &&
                                    mobileOtp.length === 6 && (
                                      <button
                                        type="button"
                                        className="otp_Button"
                                        id="mobileVerify"
                                        onClick={verifyMobileOtp}
                                        style={{ whiteSpace: "noWrap" }}
                                      >
                                        Verify OTP
                                      </button>
                                    )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="Location-details">
                      <h4>Location Info</h4>
                      <form className="update-form">
                        <div className="personal-container">
                          <div>
                            <div>
                              <label className="Input-Label">Country*</label>
                            </div>
                            <select
                              name="country"
                              id=""
                              onChange={(e) => {
                                setCountry(e.target.value);
                                setState("");
                                settown("");
                                setPlaces((prev) => ({
                                  ...prev,
                                  state: [],
                                  town: [],
                                }));
                              }}
                            >
                              <option value="">Select</option>
                              {places.country?.map((op) => (
                                <option
                                  value={`${op.name}-${op.isoCode}`}
                                  selected={country?.split("-")[0] == op.name}
                                >
                                  {op.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <div>
                              <label className="Input-Label">State*</label>
                            </div>
                            <select
                              name="state"
                              id=""
                              onChange={(e) => {
                                setState(e.target.value);
                                settown("");
                                setPlaces((prev) => ({ ...prev, town: [] }));
                              }}
                            >
                              <option value="">Select</option>
                              {places.state?.map((op) => (
                                <option
                                  value={`${op.name}-${op.isoCode}`}
                                  selected={state?.split("-")[0] == op.name}
                                >
                                  {op.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <div>
                              <label className="Input-Label">Town/city*</label>
                            </div>
                            <select
                              name="town"
                              id=""
                              value={town}
                              onChange={(e) => settown(e.target.value)}
                            >
                              <option value="">Select</option>
                              {places.town?.map((op) => (
                                <option
                                  value={op.name}
                                  selected={town?.split("-")[0] == op.name}
                                >
                                  {op.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </form>
                      <div>
                        {role == "Mentor" && (
                          <div>
                            <div>
                              <h4>Fee request</h4>
                            </div>
                            <div>
                              <input
                                type="range"
                                min={1}
                                max={50}
                                name="fee"
                                value={fee}
                                id=""
                                onChange={(e) => setFee(e.target.value)}
                                placeholder="Enter Fee request per minute"
                              />{" "}
                              <p
                                style={{
                                  fontSize: "10px",
                                }}
                              >
                                &#8377; {fee} / per min
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div>
                          <label className="Input-Label">Languages Known</label>
                        </div>
                        <div>
                          {languagesKnown?.length > 0 && (
                            <div className="listedTeam">
                              {languagesKnown?.map((t, i) => (
                                <div className="singleMember">
                                  <div>{t}</div>
                                  <div
                                    onClick={(e) => {
                                      setlanguagesKnown(
                                        languagesKnown.filter((f, j) => i !== j)
                                      );
                                    }}
                                  >
                                    <CloseIcon className="deleteMember" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            flexDirection: "column",
                          }}
                        >
                          <div className="skillsSelectBox">
                            <select
                              name="languagesKnown"
                              id=""
                              onChange={(e) =>
                                setSinglelanguagesKnown(e.target.value)
                              }
                            >
                              <option value="">Select</option>
                              {allLanguages.map((d) => (
                                <option value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <button
                              className="add-button"
                              onClick={() => {
                                if (
                                  singlelanguagesKnown !== "" &&
                                  !languagesKnown.includes(singlelanguagesKnown)
                                ) {
                                  setlanguagesKnown((prev) => [
                                    ...prev,
                                    singlelanguagesKnown,
                                  ]);
                                }
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  className="close-icon"
                  onClick={() => {
                    document.getElementsByTagName("body")[0].style.overflowY =
                      "scroll";
                    setIsInputPopupVisible(false);
                  }}
                >
                  <i class="fas fa-times"></i>
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="EditProfile-About-Section">
        <div className="About">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <h3>About</h3>
            {id == undefined && (
              <span>
                <i onClick={handleAboutButtonClick} className="fas fa-pen"></i>
              </span>
            )}
          </div>
          <div>{bio?.length > 0 ? bio : <div>No bio data found</div>}</div>

          <div className="skills-Container">
            <div>
              <label className="Input-Label">Skills</label>
            </div>
            <div>
              {skills?.length > 0 ? (
                <div className="listedTeam">
                  {skills?.map((t, i) => (
                    <div key={i} className="singleMember">
                      <div>{t}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No skills data found</div>
              )}
            </div>
          </div>
        </div>
        {isAboutPopupVisible && (
          <div className="popup-container">
            <div className="popup-content">
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <h3>Edit About</h3>
                  <span
                    className="close-icon"
                    onClick={() => {
                      document.getElementsByTagName("body")[0].style.overflowY =
                        "scroll";
                      setIsAboutPopupVisible(false);
                    }}
                  >
                    <i class="fas fa-times"></i>
                  </span>
                </div>
                <textarea
                  onChange={(e) => {
                    const inputText = e.target.value;
                    if (inputText.length <= 1000) {
                      setBio(inputText);
                    } else {
                      setBio(inputText.slice(0, 1000));
                    }
                  }}
                  style={{
                    resize: "none",
                    border: "none",
                    // padding: '20px',
                    textAlign: "justify",
                    fontFamily: "poppins",
                  }}
                  id=""
                  cols="155"
                  rows="13"
                  name="message"
                  value={bio}
                  placeholder="Enter your bio"
                ></textarea>
                <p style={{ fontSize: "10px", marginTop: "0px" }}>
                  {1000 - bio.length}/1000 characters left
                </p>

                <div className="skills-Container">
                  <div>
                    <div>
                      <div>
                        <h3>Edit Skills</h3>
                      </div>
                      {skills?.length > 0 && (
                        <div className="listedTeam">
                          {skills?.map((t, i) => (
                            <div className="singleMember">
                              <div>{t}</div>
                              <div
                                onClick={(e) => {
                                  setSkills(skills.filter((f, j) => i !== j));
                                }}
                              >
                                <CloseIcon className="deleteMember" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        flexDirection: "column",
                      }}
                    >
                      <div className="skillsSelectBox">
                        <select
                          name="skill"
                          id=""
                          onChange={(e) => setSingleSkill(e.target.value)}
                        >
                          <option value="">Select</option>
                          {allskills.map((d) => (
                            <option value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <button
                          className="add-button"
                          onClick={() => {
                            if (
                              singleSkill !== "" &&
                              !skills.includes(singleSkill)
                            ) {
                              setSkills((prev) => [...prev, singleSkill]);
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="EditProfile-Experience-Container">
        <div style={{ padding: "20px" }}>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: '99%'
              }}
            >
              <h3>Experience</h3>
              {id == undefined && (
                <span>
                  <i
                    onClick={handleExperienceButtonClick}
                    className="fas fa-plus"
                  ></i>
                </span>
              )}
            </div>
          </div>
          {totalExperienceData.length > 0 ? (
            totalExperienceData.map((te, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} className="studies">
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
                      padding: "10px",
                    }}
                  >
                    {(te.institute !== '' && te.institute !== undefined) && <div className="company">
                      <>

                        {te.institute}(Institute)
                      </>

                    </div>}
                    {(te.company !== '' && te.company !== undefined) && <div className="company">
                      <>

                        {te.company}(Company)
                      </>

                    </div>}
                    {(te.startupName !== '' && te.startupName !== undefined) && <div className="company">
                      <>

                        {te.startupName}(Startup Name)
                      </>

                    </div>}

                    <div className="designation">
                      {te.designation && (
                        <>
                          <b>Designation: </b>
                          {te.designation}
                        </>
                      )}
                    </div>
                    <div className="designation">
                      {te.Department && (
                        <>
                          <b>Department: </b>
                          {te.Department}
                        </>
                      )}
                    </div>
                    <div className="designation">
                      {te.Research && (
                        <>
                          <b>Research: </b>
                          {te.Research}
                        </>
                      )}
                    </div>

                    {role !== "Technology Partner" && ((te.workingStatus !== "Self Employed") && <div className="timeline">
                      <b>Date: </b>
                      {convertToDate(te.start)}-
                      {te.end === "" ? "Present" : convertToDate(te.end)}
                    </div>)}


                    {te.workingStatus == "Self Employed" &&
                      <>
                        <div className="timeline">
                          <b>Working Status: </b>
                          {te.workingStatus}
                        </div>
                        <div className="timeline">
                          <b>Startup / Business Name: </b>
                          {te.startupName}
                        </div><div className="timeline">
                          <b>Startup Desc: </b>
                          {te.Description}
                        </div></>
                    }

                    {mentorCategories !== 'Academia Mentor' &&
                      <><div className="timeline">
                        <b>Profession: </b>
                        {te.Profession}
                      </div><div className="timeline">
                          <b>Total Working Experience: </b>
                          {te.TotalWorkExperience}
                        </div></>
                    }
                    {role == "Technology Partner" && <div className="timeline">
                      <b>Startup Desc: </b>
                      {te.Description}
                    </div>}
                    {te.CompanyLocation && <div className="timeline">
                      <b>Company Location: </b>
                      {te.CompanyLocation}
                    </div>}



                    {te.Customers && <div className="timeline">
                      <b>Total customers served by company : </b>
                      {te.Customers}
                    </div>}

                    {te.Banner && <div className="timeline">
                      <b>Banner: </b>
                      <a href={te.Banner?.secure_url} target="_blank">Click here</a>
                    </div>}
                    {te.Logo && <div className="timeline">
                      <b>Logo: </b>
                      <a href={te.Logo?.secure_url} target="_blank">Click here</a>

                    </div>}

                    <div className="designation">
                      {te.Achievements && (
                        <>
                          <b>Achievements: </b>
                          {te.Achievements}
                        </>
                      )}
                    </div>
                    <div className="designation">
                      {te.Published && (
                        <>
                          <b>Published: </b>
                          {te.Published}
                        </>
                      )}
                    </div>
                    <div className="designation">
                      {te.StartupExperience && (
                        <>
                          <b>StartupExperience: </b>
                          {te.StartupExperience}
                        </>
                      )}
                    </div>
                    <div className="designation">
                      {te.Consultancy && (
                        <>
                          <b>Consultancy: </b>
                          {te.Consultancy}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {id == undefined &&
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <div onClick={(e) => {
                      seteditingExperienceId(i+1)
                      setExperience(te)
                      handleExperienceButtonClick()
                    }}>
                      <i class='fas fa-pen'></i>
                    </div>
                    <div onClick={(e) => {
                      setTotalExperienceData((prev) => [
                        ...prev.filter((f, j) => j !== i),
                      ]);
                    }} style={{ color: 'red' }}>
                      <i class='fas fa-times cross'></i>
                    </div>
                  </div>
                }
              </div>
            ))
          ) : (
            <div>No experience data found</div>
          )}
        </div>

        {isExperiencePopupVisible && (
          <div className="popup-container">
            <div className="popup-content">
              <div className="Work-exp">
                <form className="update-form">
                  <div
                    className="close-icon"
                    onClick={() => {
                      document.getElementsByTagName("body")[0].style.overflowY =
                        "scroll";

                      setIsExperiencePopupVisible(false);
                      seteditingExperienceId('')
                      setExperience({
                        areaOfBusiness: "",
                        business: "",
                        institute: "",
                        startupName: '',
                        workingStatus: "",
                        company: "",
                        designation: "",
                        Department: "",
                        Research: "",
                        year: "",
                        start: "",
                        end: "",
                        Achievements: "",
                        Published: "",
                        StartupExperience: "",
                        Consultancy: "",
                        Profession: "",
                        TotalWorkExperience: "",
                        Description: "",
                        // Technology Partner
                        Customers: "",
                        CompanyLocation: "",
                        Banner: "",
                        Logo: "",
                        Services: "",
                      });
                    }}
                  >
                    <i class="fas fa-times"></i>
                  </div>
                  <h3 style={{ textAlign: "center" }}>Experience</h3>
                  <div className="exp-container">

                    {/* Academia Mentor */}
                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">Institute Name*</label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <input
                            type="text"
                            name="institute"
                            value={experienceDetails.institute}
                            id=""
                            onChange={handleChange}
                            placeholder="Enter Your institute name"
                          />
                        </div>
                      </div>
                    )}

                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">
                            Current Designation*
                          </label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <select
                            name="designation"
                            value={experienceDetails.designation}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            {itPositions.map((op) => (
                              <option value={op}>{op}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">Department*</label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <input
                            type="text"
                            name="Department"
                            value={experienceDetails.Department}
                            id=""
                            onChange={handleChange}
                            placeholder="Enter Your Department name"
                          />
                        </div>
                      </div>
                    )}

                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">
                            Area of Research*
                          </label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <input
                            type="text"
                            name="Research"
                            value={experienceDetails.Research}
                            id=""
                            onChange={handleChange}
                            placeholder="Enter Your Research name"
                          />
                        </div>
                      </div>
                    )}
                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div>
                            <label className="Input-Label">Start Date*</label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="date"
                              value={experienceDetails.start}
                              name="start"
                              id=""
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div>
                            <label className="Input-Label">End Date</label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="date"
                              value={experienceDetails.end}
                              name="end"
                              id=""
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">
                            Achievements/Part of any Society*
                          </label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <input
                            type="text"
                            name="Achievements"
                            value={experienceDetails.Achievements}
                            id=""
                            onChange={handleChange}
                            placeholder="Enter Your Achievements name"
                          />
                        </div>
                      </div>
                    )}

                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">
                            Important Paper/Patent Published*
                          </label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <input
                            type="text"
                            name="Published"
                            value={experienceDetails.Published}
                            id=""
                            onChange={handleChange}
                            placeholder="Enter Your Paper/Patent Published"
                          />
                        </div>
                      </div>
                    )}

                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">
                            Experience in Startups /ongoing /details
                          </label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <input
                            type="text"
                            name="StartupExperience"
                            value={experienceDetails.StartupExperience}
                            id=""
                            onChange={handleChange}
                            placeholder="Enter Your StartupExperience"
                          />
                        </div>
                      </div>
                    )}

                    {mentorCategories == "Academia Mentor" && (
                      <div>
                        <div>
                          <label className="Input-Label">
                            Any consultancy, if yes
                          </label>
                        </div>
                        <div className="Exp_Input_Fields">
                          <input
                            type="text"
                            name="Consultancy"
                            value={experienceDetails.Consultancy}
                            id=""
                            onChange={handleChange}
                            placeholder="Enter Your Consultancy"
                          />
                        </div>
                      </div>
                    )}

                    {/*Industry Expert Mentor  &  Entrepreneur */}
                    {(mentorCategories === "Industry Expert Mentor" ||
                      role === "Entrepreneur") && (
                        <div>
                          <div>
                            <label className="Input-Label">
                              Current Working Status*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <select
                              name="workingStatus"
                              id=""
                              value={experienceDetails.workingStatus}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              {["Job", "Self Employed"].map((op) => (
                                <option>{op}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                    {experienceDetails.workingStatus == "Job" && (
                      <>
                        <div>
                          <div>
                            <label className="Input-Label">
                              Company Name*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="text"
                              name="company"
                              value={experienceDetails.company}
                              id=""
                              onChange={handleChange}
                              placeholder="Enter Your Company name"
                            />
                          </div>
                        </div>

                        <div>
                          <div>
                            <label className="Input-Label">
                              Current Designation*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <select
                              name="designation"
                              value={experienceDetails.designation}
                              onChange={handleChange}
                            >
                              <option value="">Select</option>
                              {itPositions.map((op) => (
                                <option value={op}>{op}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div>
                              <label className="Input-Label">Start Date*</label>
                            </div>
                            <div className="Exp_Input_Fields">
                              <input
                                type="date"
                                value={experienceDetails.start}
                                name="start"
                                id=""
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div>
                              <label className="Input-Label">End Date</label>
                            </div>
                            <div className="Exp_Input_Fields">
                              <input
                                type="date"
                                value={experienceDetails.end}
                                name="end"
                                id=""
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div>
                            <label className="Input-Label">Profession*</label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="text"
                              name="Profession"
                              value={experienceDetails.Profession}
                              id=""
                              onChange={handleChange}
                              placeholder="Enter Your Profession"
                            />
                          </div>
                        </div>

                        <div>
                          <div>
                            <label className="Input-Label">
                              Total Work Experience*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="number"
                              min={0}
                              name="TotalWorkExperience"
                              value={experienceDetails.TotalWorkExperience}
                              id=""
                              onChange={handleChange}
                              placeholder="Enter Your Total Work Experience"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {(experienceDetails.workingStatus == "Self Employed" ||
                      role === "Technology Partner") && (
                        <>
                          <div>
                            <div>
                              <label className="Input-Label">
                                Startup / Business name*
                              </label>
                            </div>
                            <div className="Exp_Input_Fields">
                              <input
                                type="text"
                                name="startupName"
                                value={experienceDetails.startupName}
                                id=""
                                onChange={handleChange}
                                placeholder="Enter Your Business name"
                              />
                            </div>
                          </div>

                          <div>
                            <div>
                              <label className="Input-Label">
                                Startup description in short*
                              </label>
                            </div>
                            <div className="Exp_Input_Fields">
                              <textarea
                                type="text"
                                name="Description"
                                value={experienceDetails.Description}
                                id=""
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div>
                            <div>
                              <label className="Input-Label">
                                Current Designation*
                              </label>
                            </div>
                            <div className="Exp_Input_Fields">
                              <select
                                name="designation"
                                value={experienceDetails.designation}
                                onChange={handleChange}
                              >
                                <option value="">Select</option>
                                {itPositions.map((op) => (
                                  <option value={op}>{op}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <div>
                              <label className="Input-Label">Profession*</label>
                            </div>
                            <div className="Exp_Input_Fields">
                              <input
                                type="text"
                                name="Profession"
                                value={experienceDetails.Profession}
                                id=""
                                onChange={handleChange}
                                placeholder="Enter Your Profession"
                              />
                            </div>
                          </div>

                          <div>
                            <div>
                              <label className="Input-Label">
                                Total Work Experience*
                              </label>
                            </div>
                            <div className="Exp_Input_Fields">
                              <input
                                type="number"
                                min={0}
                                name="TotalWorkExperience"
                                value={experienceDetails.TotalWorkExperience}
                                id=""
                                onChange={handleChange}
                                placeholder="Enter Your Total Work Experience"
                              />
                            </div>
                          </div>
                        </>
                      )}

                    {role === "Technology Partner" && (
                      <>
                        <div>
                          <div>
                            <label className="Input-Label">
                              Total Customers*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="number"
                              name="Customers"
                              value={experienceDetails.Customers}
                              id=""
                              onChange={handleChange}
                              placeholder="Total Number of Customers "
                            />
                          </div>
                        </div>

                        <div>
                          <div>
                            <label className="Input-Label">
                              Company Location*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="text"
                              name="CompanyLocation"
                              value={experienceDetails.CompanyLocation}
                              id=""
                              onChange={handleChange}
                              placeholder="Company Location "
                            />
                          </div>
                        </div>

                        <div>
                          <div>
                            <label className="Input-Label">
                              Area Of Business*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="text"
                              name="areaOfBusiness"
                              value={experienceDetails.areaOfBusiness}
                              id=""
                              onChange={handleChange}
                              placeholder="Area of Business"
                            />
                          </div>
                        </div>

                        <>
                          <div>
                            <label className="Input-Label">Banner*</label>
                          </div>
                          <label htmlFor="Banner" className="resume">
                            <CloudUploadIcon />
                            <span className="fileName">
                              {Banner || "Upload"}
                            </span>
                          </label>

                          <input
                            type="file"
                            id="Banner"
                            className="resume"
                            style={{ display: "none" }}
                            name="Banner"
                            onChange={handleBannerImage}
                          />
                        </>

                        <>
                          <div>
                            <label className="Input-Label">Logo*</label>
                          </div>
                          <label htmlFor="Logo" className="resume">
                            <CloudUploadIcon />
                            <span className="fileName">
                              {Logo || "Upload"}
                            </span>
                          </label>

                          <input
                            type="file"
                            id="Logo"
                            className="resume"
                            style={{ display: "none" }}
                            name="Logo"
                            onChange={handleLogoImage}
                          />
                        </>

                        <div>
                          <div>
                            <label className="Input-Label">
                              Services*
                            </label>
                          </div>
                          <div className="Exp_Input_Fields">
                            <input
                              type="text"
                              name="Services"
                              value={experienceDetails.Services}
                              id=""
                              onChange={handleChange}
                              placeholder="Services"
                            />
                          </div>
                        </div>

                      </>
                    )}

                    <div>
                      <button
                        className="add-button"
                        onClick={addExperience}
                      // disabled={
                      //   (experienceDetails.start == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") ||
                      //   (experienceDetails.company == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") || (experienceDetails.workingStatus !== "Self Employed" && experienceDetails.startupName == '') ||
                      //   experienceDetails.designation == ""
                      // }
                      >
                        {editingExperienceId==''?'Add':'Update'}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        )}
      </section>

      <section className="EditProfile-Education-Container">
        <div className="Ed-details" style={{ flexDirection: "column" }}>
          <div style={{ padding: "20px" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: '99%'
                }}
              >
                <h3>Education</h3>
                {id == undefined && (
                  <span>
                    <i
                      onClick={handleEducationButtonClick}
                      className="fas fa-plus"
                    ></i>
                  </span>
                )}
              </div>
            </div>
            {totalEducationData.length > 0 ? (
              totalEducationData.map((te, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} className="studies">
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
                        padding: "10px",
                      }}
                    >
                      <div className="college">{te.college} </div>
                      <div className="grade">{te.grade}</div>
                      <div className="timeline">
                        {convertToDate(te.Edstart)}-
                        {te.Edend === "" ? "Present" : convertToDate(te.Edend)}
                      </div>
                    </div>
                  </div>
                  {id == undefined && <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <div onClick={(e) => {
                      seteditingEducationId(i + 1)
                      setEducationDetails(te)
                      handleEducationButtonClick()
                    }}>
                      <i class='fas fa-pen'></i>
                    </div>
                    <div onClick={(e) => {
                      setTotalEducationData((prev) => [
                        ...prev.filter((f, j) => j !== i),
                      ]);
                    }} style={{ color: 'red' }}>
                      <i class='fas fa-times cross'></i>
                    </div>
                  </div>}
                </div>
              ))
            ) : (
              <div>No education data found</div>
            )}
          </div>
          {isEducationPopupVisible && (
            <div className="popup-container">
              <div className="popup-content">
                <form className="update-form">
                  <div
                    className="close-icon"
                    onClick={() => {
                      document.getElementsByTagName("body")[0].style.overflowY =
                        "scroll";

                      setIsEducationPopupVisible(false);
                      seteditingEducationId('')
                      setEducationDetails({
                        year: "",
                        grade: "",
                        college: "",
                        Edstart: "",
                        Edend: "",
                      });
                    }}
                  >
                    <i class="fas fa-times"></i>
                  </div>
                  <div className="edu-container">
                    <h2>Education</h2>
                    <div style={{ display: "flex", flexDirection: "column" }}>

                      <div>
                        <div>
                          <label className="Input-Label">Grade*</label>
                        </div>
                        <div className="Ed_Input_Fields">
                          <select
                            name="grade"
                            id=""
                            value={EducationDetails.grade}
                            onChange={handleEducationChange}
                          >
                            <option value="">Select</option>
                            <option value="SSC">10th</option>
                            <option value="Inter">Inter/Equivalent</option>
                            <option value="UG">UG (Btech, degree)</option>
                            <option value="PG">PG</option>
                            <option value="Medical">Medical</option>
                            <option value="Business">Business</option>
                            <option value="LAW">Law</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <div>
                          <label className="Input-Label">
                            College/University*{" "}
                            {EducationDetails.grade !== "SSC" &&
                              EducationDetails.grade !== "" &&
                              "(Type 3 charecters)"}
                          </label>
                        </div>
                        <div className="Ed_Input_Fields">
                          {EducationDetails.grade == "SSC" ||
                            EducationDetails.grade == "" ? (
                            <input
                              type="text"
                              name="college"
                              value={EducationDetails.college}
                              id=""
                              onChange={handleEducationChange}
                              placeholder="Enter Your College/School/University"
                            />
                          ) : (
                            <>
                              <Autocomplete
                                disablePortal
                                options={universities}
                                getOptionLabel={(option) => option.name}
                                sx={{ width: 300 }}
                                // inputValue={
                                //   EducationDetails.college
                                //     ? EducationDetails.college
                                //     : undefined
                                // }
                                onChange={(e) => handleEducationChange(e, true)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    value={collegeQuery}
                                    onChange={hadnleCollegeQueryChange}
                                    label="College"
                                  />
                                )}
                              />
                              {/* <input
                        type="text"
                        name="collegeQuery"
                        value={collegeQuery}
                        id=""
                        onChange={hadnleCollegeQueryChange}
                        placeholder="Enter Your College/School/University"
                      />
                      {universities.length > 0 && (
                        <select
                          value={EducationDetails.college}
                          name="college"
                          onChange={handleEducationChange}
                        >
                          <option value="">Select college</option>
                          {universities.map((u) => (
                            <option value={u.name}>{u.name}</option>
                          ))}
                        </select>
                      )} */}
                            </>
                          )}
                        </div>
                      </div>


                      <div>
                        <label className="Input-Label">Start Date*</label>
                      </div>
                      <div className="Ed_Input_Fields">
                        <input
                          type="date"
                          value={EducationDetails.Edstart}
                          name="Edstart"
                          id=""
                          onChange={handleEducationChange}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <label className="Input-Label">End Date</label>
                      </div>
                      <div className="Ed_Input_Fields">
                        <input
                          type="date"
                          value={EducationDetails.Edend}
                          name="Edend"
                          id=""
                          onChange={handleEducationChange}
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        className="add-button"
                        onClick={addEducation}
                        disabled={
                          EducationDetails.Edstart == "" ||
                          EducationDetails.grade == "" ||
                          EducationDetails.college == ""
                        }
                      >
                        {editingEducationId !== '' ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </div>
                  <div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="EditProfile-UploadFiles-Container">
        <div className="upload-mobile-responsive" style={{ padding: "20px" }}>
          <h4>Upload files</h4>
          <form className="update-form">
            <div className="upload-files-container">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="Input-Label">Resume</label>
                  {oldDocs.resume !== "" &&
                    oldDocs.resume !== undefined &&
                    Object.keys(oldDocs.resume).length !== 0 && (
                      <attr title="view previous resume">
                        <a
                          href={oldDocs.resume?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="/view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                {id == undefined && (
                  <>
                    <label htmlFor="resume" className="resume">
                      <CloudUploadIcon />
                      <span className="fileName">
                        {recentUploadedDocs?.resume || "Upload"}
                      </span>
                    </label>
                    <input
                      className="resume"
                      type="file"
                      name="resume"
                      id="resume"
                      onChange={handleResume}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>

              <div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                      justifyContent: "space-between",
                    }}
                  >
                    <label className="Input-Label">Acheivements</label>
                    {oldDocs.acheivements !== "" &&
                      oldDocs.acheivements !== undefined &&
                      Object.keys(oldDocs.acheivements).length !== 0 && (
                        <attr title="view previous acheivements">
                          <a
                            href={oldDocs.acheivements?.secure_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              style={{
                                height: "30px",
                                width: "30px",
                              }}
                              src="/view.png"
                              onMouseEnter={() => setShowPreviousFile(true)}
                              onMouseLeave={() => setShowPreviousFile(false)}
                            />
                          </a>
                        </attr>
                      )}
                  </div>
                  {id == undefined && (
                    <>
                      <label htmlFor="acheivements" className="resume">
                        <CloudUploadIcon />
                        <span className="fileName">
                          {recentUploadedDocs?.acheivements || "Upload"}
                        </span>
                      </label>
                      <input
                        type="file"
                        id="acheivements"
                        className="resume"
                        name="acheivements"
                        onChange={handleResume}
                        style={{ display: "none" }}
                      />
                    </>
                  )}
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="Input-Label">Degree</label>
                  {oldDocs.degree !== "" &&
                    oldDocs.degree !== undefined &&
                    Object.keys(oldDocs.degree).length !== 0 && (
                      <attr title="view previous degree ">
                        <a
                          href={oldDocs.degree?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="/view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                {id == undefined && (
                  <>
                    <label htmlFor="degree" className="resume">
                      <CloudUploadIcon />
                      <span className="fileName">
                        {recentUploadedDocs?.degree || "Upload"}
                      </span>
                    </label>

                    <input
                      type="file"
                      id="degree"
                      className="resume"
                      name="degree"
                      onChange={handleResume}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="Input-Label">Expertise</label>
                  {oldDocs.expertise !== "" &&
                    oldDocs.expertise !== undefined &&
                    Object.keys(oldDocs.expertise).length !== 0 && (
                      <attr title="view previous expertise ">
                        <a
                          href={oldDocs.expertise?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="/view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                {id == undefined && (
                  <>
                    <label htmlFor="expertise" className="resume">
                      <CloudUploadIcon />
                      <span className="fileName">
                        {recentUploadedDocs?.expertise || "Upload"}
                      </span>
                    </label>

                    <input
                      type="file"
                      id="expertise"
                      className="resume"
                      name="expertise"
                      style={{ display: "none" }}
                      onChange={handleResume}
                    />
                  </>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="Input-Label">Working</label>
                  {oldDocs.working !== "" &&
                    oldDocs.working !== undefined &&
                    Object.keys(oldDocs.working).length !== 0 && (
                      <attr title="view previous working ">
                        <a
                          href={oldDocs.working?.secure_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                            }}
                            src="/view.png"
                            onMouseEnter={() => setShowPreviousFile(true)}
                            onMouseLeave={() => setShowPreviousFile(false)}
                          />
                        </a>
                      </attr>
                    )}
                </div>
                {id == undefined && (
                  <>
                    <label htmlFor="working" className="resume">
                      <CloudUploadIcon />
                      <span className="fileName">
                        {recentUploadedDocs?.working || "Upload"}
                      </span>
                    </label>

                    <input
                      type="file"
                      id="working"
                      className="resume"
                      style={{ display: "none" }}
                      name="working"
                      onChange={handleResume}
                    />
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      {id == undefined ? (
        <section className="EditProfile-Buttons-Section">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "15px",
              marginBottom: "15px",
            }}
          >
            <button>Save</button>
            <button
              type="submit"
              disabled={
                isLoading || !isFormValid || image === undefined || image === ""
              }
              onClick={update}
              style={{ whiteSpace: "nowrap", position: "relative" }}
            >
              {isLoading ? (
                <>
                  <div className="button-loader"></div>
                  <span style={{ marginLeft: "12px" }}>
                    Sending Approval...
                  </span>
                </>
              ) : (
                <>
                  <i
                    className="fas fa-address-card"
                    style={{ marginRight: "5px" }}
                  ></i>
                  Send for Approval
                </>
              )}
            </button>
          </div>
        </section>
      ) : (
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
              onClick={(e) => adminupdate(e, "rejected")}
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
              onClick={(e) => adminupdate(e, "approved")}
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
      )}

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
              adminupdate(e, "rejected");
            }}
          >
            Ok
          </button>
        </DialogContent>
      </Dialog>
      <ProfileImageUpdate open={open} setOpen={setOpen} />
    </main>
  );
};

export default EditProfileUI;
