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
    MMDDYYFormat,
} from "../../Utils";
import { Autocomplete, TextField } from "@mui/material";
import useWindowDimensions from "../Common/WindowSize";
import ProfileImageUpdate from "../Navbar/ProfileImageUpdate";
import { io } from "socket.io-client";
import { gridCSS } from "../CommonStyles";
import ReviewStars from "../LivePitches/ReviewStars";
import AddReviewStars from "../LivePitches/AddReviewStars";
import IndividualUserReview from "../AllUsers/IndividualUserReview";
import ShowingFollowers from "./ShowingFollowers";
import CreatePost from "./Activities/Posts/CreatePost";
import './EditProfile.css'
import AddConversationPopup from "../Common/AddConversationPopup";
import { getAllHistoricalConversations } from "../../redux/Conversationreducer/ConversationReducer";
import Post from "./Activities/Posts/Post";
import UserComment from "./Activities/userComment/UserComment";

const EditProfile = () => {
    const { id } = useParams();
    const {
        user_id,
        userName: loggedUserName,
        image: loggedImage,
    } = useSelector((store) => store.auth.loginDetails);
    const socket = useRef();
    useEffect(() => {
        socket.current = io(socket_io);
    }, []);

    const [receiverRole, setreceiverRole] = useState("");
    const [pitchSendTo, setPitchSendTo] = useState("");
    const [IsAdmin, setIsAdmin] = useState(false)

    const [createPostPopup, setCreatePostpopup] = useState(false)
    const [showPreviousFile, setShowPreviousFile] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [allPosts, setAllPosts] = useState([])
    useEffect(() => {
        if (id !== undefined) {
            ApiServices.getUsersPost({ user_id: id }).then(res => {
                setAllPosts(res.data)
            }).catch(err => {
                dispatch(
                    setToast({
                        message: 'Error Occured!',
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            })
        } else {
            ApiServices.getUsersPost({ user_id }).then(res => {
                setAllPosts(res.data)
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

    }, [user_id])
    const [inputs, setInputs] = useState({
        verification: null,
        twitter: null,
        linkedin: null,
        mentorCategories: null,
        salutation: null,
        review: [],
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
        review,
        verification,
        // email,
        twitter,
        linkedin,
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
        startupName: "",
        // Technology Partner
        Customers: "",
        CompanyLocation: "",
        Banner: "",
        Logo: "",
        Services: "",
        workingStatus: "",
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
    const [editingExperienceId, seteditingExperienceId] = useState("");
    const [editingEducationId, seteditingEducationId] = useState("");
    const followerNotification = useSelector(state => state.conv.followerNotification);
    const [typeOfOpen, setTypeOfOpen] = useState(null)
    const [places, setPlaces] = useState({
        country: [],
        state: [],
        town: [],
    });
    const [open, setOpen] = useState(false);

    const [isInputPopupVisible, setIsInputPopupVisible] = useState(false);
    const [isAboutPopupVisible, setIsAboutPopupVisible] = useState(false);
    const [isSkillsPopupVisibile, setisSkillsPopupVisibile] = useState(false);

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

    const handleSkillButtonClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        document.getElementsByTagName("body")[0].style.overflowY = "hidden";
        setisSkillsPopupVisibile(true);
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
        if (editingExperienceId == "") {
            setTotalExperienceData((prev) => [...prev, experienceDetails]);
        } else {
            setTotalExperienceData(
                totalExperienceData.map((t, i) => {
                    return i + 1 === editingExperienceId ? experienceDetails : t;
                })
            );
            setIsExperiencePopupVisible(false);
            seteditingExperienceId("");
            document.getElementsByTagName("body")[0].style.overflowY = "scroll";
        }
        SetBanner("");
        SetLogo("");
        setExperience({
            areaOfBusiness: "",
            business: "",
            institute: "",
            startupName: "",
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
        if (editingEducationId == "") {
            setTotalEducationData((prev) => [...prev, EducationDetails]);
        } else {
            setTotalEducationData(
                totalEducationData.map((t, i) => {
                    return i + 1 === editingEducationId ? EducationDetails : t;
                })
            );
            setIsEducationPopupVisible(false);
            seteditingEducationId("");
            document.getElementsByTagName("body")[0].style.overflowY = "scroll";
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

    const [followers, setFollowers] = useState([])
    const [followering, setFollowering] = useState([])
    const [editPostToggler, seteditPostToggler] = useState('comment')



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

    const [userpage, setuserpage] = useState(null);

    // Adding Comment section
    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    const [convExits, setConvExists] = useState(false);
    const [averagereview, setAverageReview] = useState(0);
    const [emailTrigger, setemailTrigger] = useState(false);

    useEffect(() => {
        if (userpage === true) {
            ApiServices.checkConvBtwTwo({ senderId: user_id, receiverId: id })
                .then((res) => {
                    setConvExists(true);
                })
                .catch((err) => {
                    setConvExists(false);
                });
        }
    }, [userpage, user_id]);
    const onLike = (commentId, isLike) => {
        ApiServices.likeComment({ comment_id: commentId, comment_owner: id })
            .then((res) => {
                // dispatch(
                //   setToast({
                //     message: isLike ? "Comment Liked" : "Comment Disliked",
                //     bgColor: ToastColors.success,
                //     visible: "yes",
                //   })
                // );
            })
            .catch((err) => {
                dispatch(
                    setToast({
                        message: "Error Occurred",
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            });
    };

    const sendText = async () => {
        setComment("");
        if (comment !== "") {
            await ApiServices.addUserComment({
                userId: id !== undefined ? id : user_id,
                comment: comment,
                commentBy: user_id,
            })
                .then((res) => {
                    setAllComments(res.data)
                })
                .catch((err) => {
                    // navigate("/searchusers");
                    dispatch(
                        setToast({
                            visible: "yes",
                            message: "Error Occurred while adding comment",
                            bgColor: ToastColors.failure,
                        })
                    );
                });
        }
    };

    const onDisLike = (commentId, isLike) => {
        ApiServices.dislikeComment({
            comment_id: commentId,
            comment_owner: id,
        })
            .then((res) => { })
            .catch((err) => {
                dispatch(
                    setToast({
                        message: "Error Occurred",
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            });
    };

    useEffect(() => {
        if (id !== undefined) {
            // dispatch(setLoading({ visible: "yes" }));
            ApiServices.getuserComments({ userId: id })
                .then((res) => {
                    setAllComments(
                        res.data.sort((a, b) => {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                    );
                })
                .catch((err) => {
                    dispatch(
                        setToast({
                            message: "Error Occurred",
                            bgColor: ToastColors.failure,
                            visible: "yes",
                        })
                    );
                    // console.log(err);
                    // navigate("/searchusers");
                });
        } else {
            ApiServices.getuserComments({ userId: user_id })
                .then((res) => {
                    setAllComments(
                        res.data.sort((a, b) => {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        })
                    );
                })
                .catch((err) => {
                    dispatch(
                        setToast({
                            message: "Error Occurred",
                            bgColor: ToastColors.failure,
                            visible: "yes",
                        })
                    );
                    // console.log(err);
                    // navigate("/searchusers");
                });
        }
    }, [id, emailTrigger, userpage]);

    const [filledStars, setFilledStars] = useState(0);
    const [isWritingReview, setIsWritingReview] = useState(false);

    useEffect(() => {
        if (userpage == true) {
            ApiServices.getUsersStarsFrom({
                userId: id,
                reviewBy: user_id,
            }).then((res) => {
                setFilledStars(res.data.review !== undefined ? res.data.review : 0);
            });
        }
    }, [id, userpage]);

    const sendReview = async () => {
        await ApiServices.addUserReview({
            userId: id,
            review: {
                reviewBy: user_id,
                review: filledStars,
            },
        })
            .then((res) => {
                dispatch(
                    setToast({
                        message: "Review Updated",
                        visible: "yes",
                        bgColor: ToastColors.success,
                    })
                );
                setemailTrigger(!emailTrigger);
            })
            .catch((err) => {
                dispatch(
                    setToast({
                        message: "Error Occurred",
                        visible: "yes",
                        bgColor: ToastColors.failure,
                    })
                );
            });
    };

    useEffect(() => {
        if (window.location.pathname.includes("/user")) {
            setuserpage(true);
        } else {
            setuserpage(false);
        }
    }, [window.location.pathname]);

    useEffect(() => {
        if (userpage !== null) {
            if (id == undefined) {
                ApiServices.getProfile({ id: user_id })
                    .then((res) => {
                        if (res.data.review !== undefined && res.data.review?.length > 0) {
                            let avgR = 0;
                            res.data.review?.map((rev) => {
                                avgR += rev.review;
                            });
                            setAverageReview(avgR / res.data.review.length);
                        }
                        setFollowering(res.data.following)
                        setFollowers(res.data.followers)
                        setFollowers(res.data.followers)

                        setEditOwnProfile(true);
                        setInputs((prev) => ({
                            ...prev,
                            twitter: res.data.twitter,
                            linkedin: res.data.linkedin,
                            review: res.data.review,
                            verification: res.data.verification,
                            updatedAt: res.data.updatedAt,
                            name: res.data.userName,
                            mobile: res.data.phone,
                            role: res.data.role,
                            mobileVerified: res.data.phone.length > 0 ? true : false,
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
                                    State.getStatesOfCountry(res.data.country?.split("-")[1]) ||
                                    [],
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
            } else if (id !== undefined && userpage == false) {
                // Admin functionality
                AdminServices.getApprovalRequestProfile({ userId: id })
                    .then((res) => {
                        setEditOwnProfile(false);
                        // console.log(res.data);
                        if (res.data.review !== undefined && res.data.review?.length > 0) {
                            let avgR = 0;
                            res.data.review?.map((rev) => {
                                avgR += rev.review;
                            });
                            setAverageReview(avgR / res.data.review.length);
                        }
                        setFollowering(res.data.following)
                        setFollowers(res.data.followers)
                        setRequestedUserId(res.data._id);
                        setInputs((prev) => ({
                            ...prev,
                            review: res.data.review,

                            twitter: res.data.twitter,
                            linkedin: res.data.linkedin,
                            updatedAt: res.data.updatedAt,
                            name: res.data.userName,
                            mobile: res.data.phone,
                            role: res.data.role,
                            image: res.data.image?.url || "",
                            email: res.data.email,
                            status: res.data.verification,
                            mobileVerified: res.data.phone.length > 0 ? true : false,
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
                        console.log(error);
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
            } else if (id !== undefined && userpage == true) {
                ApiServices.getProfile({ id: id })
                    .then((res) => {
                        if (res.data.review !== undefined && res.data.review?.length > 0) {
                            let avgR = 0;
                            res.data.review?.map((rev) => {
                                avgR += rev.review;
                            });
                            setAverageReview(avgR / res.data.review.length);
                        }
                        setFollowering(res.data.following)
                        setFollowers(res.data.followers)
                        setEditOwnProfile(true);
                        setInputs((prev) => ({
                            ...prev,
                            review: res.data.review,

                            twitter: res.data.twitter,
                            linkedin: res.data.linkedin,
                            verification: res.data.verification,
                            review: res.data.review,
                            updatedAt: res.data.updatedAt,
                            name: res.data.userName,
                            mobile: res.data.phone,
                            role: res.data.role,
                            mobileVerified: res.data.phone.length > 0 ? true : false,
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
                            // console.log(
                            //     "res.data.educationDetails",
                            //     res.data.educationDetails
                            // );
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
                                    State.getStatesOfCountry(res.data.country?.split("-")[1]) ||
                                    [],
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
            }
        }
    }, [email, id, userpage, emailTrigger, followerNotification]);



    // Admi approval function
    const adminupdate = async (e, status) => {
        e.preventDefault();
        e.target.disabled = true;
        // setIsLoading(true);
        if (status == "approved" || (status == "rejected" && reason !== "")) {
            await ApiServices.updateStatusByAdmin({
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
    const deleteComment = async (did) => {
        await ApiServices.removeUserComment({ userId: id, commentId: did })
            .then((res) => {
                // setuser((prev) => ({
                //   ...prev,
                //   comments: (user.comments = user.comments.filter((f) => f._id !== did)),
                // }));
            })
            .catch((err) => {
                dispatch(
                    setToast({
                        visible: "yes",
                        message: "Error Occurred",
                        bgColor: "red",
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
        });
        await ApiServices.sendDirectUpdate({
            twitter: twitter,
            linkedin: linkedin,
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
                        message: "Profile Updated",
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
                // navigate("/dashboard");
                // window.location.reload()
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

    const savingLocal = () => {
        localStorage.setItem(
            "editProfile",
            JSON.stringify({
                twitter: twitter,
                linkedin: linkedin,
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
                educationDetails: totalEducationData,
            })
        );
        dispatch(
            setToast({
                message: "Data Saved Locally",
                bgColor: ToastColors.success,
                visible: "yes",
            })
        );
    };

    const retreiveLocal = () => {
        console.log(JSON.parse(localStorage.getItem("editProfile")));
        if (localStorage.getItem("editProfile")) {
            const local = JSON.parse(localStorage.getItem("editProfile"));
            setEditOwnProfile(true);
            setInputs((prev) => ({
                ...prev,
                twitter: local?.twitter,
                linkedin: local?.linkedin,
                name: local?.userName,
                mobile: local?.phone,
                role: local?.role,
                mobileVerified: true,
                email: local?.email,
                salutation: local?.salutation,
                mentorCategories: local?.mentorCategories,
            }));

            if (local?.documents !== undefined) {
                setOldDocs((prev) => ({
                    ...prev,
                    resume: local?.documents.resume,
                    expertise: local?.documents.expertise,
                    acheivements: local?.documents.acheivements,
                    working: local?.documents.working,
                    degree: local?.documents.degree,
                }));
                setchangeDocuments((prev) => ({
                    ...prev,
                    resume: local?.documents?.resume || "",
                    expertise: local?.documents?.expertise || "",
                    acheivements: local?.documents?.acheivements || "",
                    working: local?.documents?.working || "",
                    degree: local?.documents?.degree || "",
                }));
                setTotalEducationData(local?.educationDetails || []);
                setTotalExperienceData(local?.experienceDetails || []);
                setFee(local?.fee || "");
                setBio(local?.bio || "");
                setSkills(local?.skills || []);
                setlanguagesKnown(local?.languagesKnown || []);

                settown(local?.town || "");
                setCountry(local?.country || "");
                setState(local?.state || "");
                setPlaces({
                    country: Country.getAllCountries(),
                    state: State.getStatesOfCountry(local?.country?.split("-")[1]) || [],
                    town:
                        City.getCitiesOfState(
                            local?.country?.split("-")[1],
                            local?.state?.split("-")[1]
                        ) || [],
                });
            }

            dispatch(
                setToast({
                    message: "Data Retrived Locally",
                    bgColor: ToastColors.success,
                    visible: "yes",
                })
            );
        }
    };

    const sendForApproval = async () => {
        await ApiServices.updateStatusDirectly({
            userId: user_id,
            verificationStatus: "pending",
        })
            .then((res) => {
                setInputs((prev) => ({ ...prev, verification: "pending" }));
            })
            .catch((err) => {
                dispatch(
                    setToast({
                        message: "Error in update status",
                        bgColor: ToastColors.failure,
                        visible: "yes",
                    })
                );
            });
    };



    const followerController = async (e) => {
        e.target.disabled = true
        await ApiServices.saveFollowers({ followerReqBy: user_id, followerReqTo: id }).then(res => {
            setFollowering(res.data.following)
            setFollowers(res.data.followers)
            if (res.data.followers.map(f => f._id).includes(user_id)) {
                socket.current.emit("sendNotification", {
                    senderId: user_id,
                    receiverId: id,
                });
                socket.current.emit("sendFollowerNotification", {
                    senderId: user_id,
                    receiverId: id,
                    type: 'adding',
                    image: image,
                    role: role,
                    _id: id,
                    userName: userName
                });

            } else {
                socket.current.emit("sendFollowerNotification", {
                    senderId: user_id,
                    receiverId: id,
                    type: 'removing', _id: id
                });
            }


        }).catch((err) => {
            dispatch(
                setToast({
                    message: "Error in update status",
                    bgColor: ToastColors.failure,
                    visible: "yes",
                })
            );
        });
        e.target.disabled = false
    }


    const [connectStatus, setConnectStatus] = useState(null);
    const historicalConversations = useSelector(
        (state) => state.conv.historicalConversations
    );
    useEffect(() => {
        if (id !== undefined) {
            dispatch(getAllHistoricalConversations(user_id));
        }
    }, []);
    useEffect(() => {
        let obj = {};
        if (historicalConversations?.filter(f => f.members.map(m => m._id).includes(id)).length > 0) {
            obj[id] = { status: historicalConversations?.filter(f => f.members.map(m => m._id).includes(id))[0]?.status, id: historicalConversations?.filter(f => f.members.map(m => m._id).includes(id))[0]?._id }
        }
        setConnectStatus(
            obj
        );
    }, [historicalConversations]);


    const openChat = async (e) => {
        navigate(`/conversations/${connectStatus[id]?.id}`);
    };
    return (
        <div className="EditProfileContainer">
            {(mobileVerified == false || image == '') && <div className='mobilenote'>
                Note: Mobile number should be verified and image should not be empty to send or update the profile
            </div>}
            <div className='EditProfileImageContainer'>
                <img src="/Banner-1.png" alt="Image 1" />
            </div>
            <div className='ProfileContainer'>
                {/* LEFT PART */}
                <div className='ProfileDetailsCard'>
                    <div className='EditProfileImage'>
                        <img
                            src={
                                image !== undefined && image !== "" ? image : "/profile.png"
                            }
                        />
                        {id == undefined && (
                            <i
                                class="fas fa-camera hover-cam-icon"
                                onClick={() => {
                                    if (id == undefined) {
                                        setOpen(true);
                                    }
                                }}
                            ></i>
                        )}
                    </div>
                    {id !== undefined && <div><ReviewStars avg={averagereview} />
                    </div>
                    }
                    <div className="EditProfileUsername">
                        {salutation}
                        {salutation && <span>.</span>} {name && name[0]?.toUpperCase() + name?.slice(1)}
                        {id !== undefined && verification === "approved" && (
                            <img
                                src="/verify.png"
                                alt=""
                                style={{
                                    width: "22.92px",
                                    height: "21.88px",
                                    marginLeft: '2px',
                                    marginBottom: '-4px',
                                }}
                            />)}
                        {id == undefined && (
                            <span>
                                <i style={{ color: 'var(--followBtn-bg)' }}
                                    onClick={handleEditButtonClick}
                                    className="fas fa-pen"
                                ></i>
                            </span>
                        )}
                    </div>
                    <div className='personaDetails'>
                        {role} {role == "Mentor" && mentorCategories}
                    </div>
                    {id == undefined && <div className='personaDetails'>{email}</div>}
                    {id == undefined && <div className='personaDetails'>{mobile}</div>}

                    {id == undefined && (
                        <>
                            {(verification == "" || verification == "rejected") && (
                                <button
                                    onClick={sendForApproval}
                                    className="profileMessageBtn"
                                >
                                    Verify Now
                                </button>
                            )}
                            {verification == "approved" && (
                                <button className="profileMessageBtn">
                                    Approved
                                </button>
                            )}
                            {verification == "pending" && (
                                <button className="profileMessageBtn">
                                    Pending
                                </button>
                            )}
                        </>
                    )}


                    {userpage == true && <button onClick={followerController} className="profileFollowBtn">
                        {followers.map(f => f._id).includes(user_id) ? 'Un Follow' : 'Follow'}
                    </button>}

                    {userpage == true && connectStatus &&
                        (connectStatus[id]?.status === "pending" ? (
                            <button className="profileMessageBtn">Pending</button>
                        ) : (connectStatus[id]?.status === "approved" ? (
                            <button className="profileMessageBtn" onClick={openChat}>
                                Chat
                            </button>
                        ) : (
                            <button
                                className="profileMessageBtn"
                                onClick={() => {
                                    setPitchSendTo(id);
                                    setreceiverRole(role);
                                    setIsAdmin(email == process.env.REACT_APP_ADMIN_MAIL)
                                }}
                            >
                                Connect
                            </button>
                        )))}

                    <div className="followDetails" onClick={() => {
                        if (typeOfOpen == null) {
                            setTypeOfOpen('followers')
                        } else {
                            setTypeOfOpen(null)
                        }
                    }}>
                        <div>Followers</div>
                        <div>{followers.length}</div>
                    </div>

                    <div className="followDetails" onClick={() => {
                        if (typeOfOpen == null) {
                            setTypeOfOpen('following')
                        } else {
                            setTypeOfOpen(null)
                        }
                    }}>
                        <div>Following</div>
                        <div>{followering.length}</div>
                    </div>
                    <div className="locationdetails">
                        <div>
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.3204 15.0939C21.0019 13.8147 21.3571 12.3871 21.3542 10.9377C21.3542 6.04756 17.3902 2.0835 12.5001 2.0835C7.60995 2.0835 3.64589 6.04756 3.64589 10.9377C3.64221 13.0264 4.38055 15.0485 5.72922 16.6434L5.73964 16.6564L5.74901 16.6668H5.72922L10.9834 22.245C11.1782 22.4517 11.4132 22.6164 11.6739 22.729C11.9347 22.8416 12.2157 22.8997 12.4998 22.8997C12.7838 22.8997 13.0649 22.8416 13.3257 22.729C13.5864 22.6164 13.8214 22.4517 14.0162 22.245L19.2709 16.6668H19.2511L19.2594 16.6569L19.2605 16.6559C19.298 16.6111 19.3353 16.566 19.3724 16.5205C19.7338 16.0765 20.0513 15.5991 20.3204 15.0939ZM12.5027 14.3226C11.6739 14.3226 10.879 13.9933 10.2929 13.4073C9.7069 12.8212 9.37766 12.0264 9.37766 11.1976C9.37766 10.3688 9.7069 9.5739 10.2929 8.98785C10.879 8.4018 11.6739 8.07256 12.5027 8.07256C13.3315 8.07256 14.1263 8.4018 14.7124 8.98785C15.2984 9.5739 15.6277 10.3688 15.6277 11.1976C15.6277 12.0264 15.2984 12.8212 14.7124 13.4073C14.1263 13.9933 13.3315 14.3226 12.5027 14.3226Z" fill="var(--followBtn-bg)" />
                            </svg>
                        </div>
                        <div>
                            {country}
                        </div>
                    </div>

                    {twitter && <div className="locationdetails">
                        <div>
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.0417 14.5835C17.125 13.896 17.1875 13.2085 17.1875 12.5002C17.1875 11.7918 17.125 11.1043 17.0417 10.4168H20.5625C20.7292 11.0835 20.8334 11.7814 20.8334 12.5002C20.8334 13.2189 20.7292 13.9168 20.5625 14.5835M15.198 20.3752C15.823 19.2189 16.3021 17.9689 16.6355 16.6668H19.7084C18.6992 18.4046 17.0981 19.721 15.198 20.3752ZM14.9375 14.5835H10.0625C9.95837 13.896 9.89587 13.2085 9.89587 12.5002C9.89587 11.7918 9.95837 11.0939 10.0625 10.4168H14.9375C15.0313 11.0939 15.1042 11.7918 15.1042 12.5002C15.1042 13.2085 15.0313 13.896 14.9375 14.5835ZM12.5 20.7918C11.6355 19.5418 10.9375 18.1564 10.5105 16.6668H14.4896C14.0625 18.1564 13.3646 19.5418 12.5 20.7918ZM8.33337 8.3335H5.29171C6.29029 6.59082 7.89031 5.27229 9.79171 4.62516C9.16671 5.78141 8.69796 7.03141 8.33337 8.3335ZM5.29171 16.6668H8.33337C8.69796 17.9689 9.16671 19.2189 9.79171 20.3752C7.89407 19.7213 6.29618 18.4045 5.29171 16.6668ZM4.43754 14.5835C4.27087 13.9168 4.16671 13.2189 4.16671 12.5002C4.16671 11.7814 4.27087 11.0835 4.43754 10.4168H7.95837C7.87504 11.1043 7.81254 11.7918 7.81254 12.5002C7.81254 13.2085 7.87504 13.896 7.95837 14.5835M12.5 4.19808C13.3646 5.44808 14.0625 6.84391 14.4896 8.3335H10.5105C10.9375 6.84391 11.6355 5.44808 12.5 4.19808ZM19.7084 8.3335H16.6355C16.3089 7.04351 15.8262 5.79819 15.198 4.62516C17.1146 5.28141 18.7084 6.60433 19.7084 8.3335ZM12.5 2.0835C6.73962 2.0835 2.08337 6.771 2.08337 12.5002C2.08337 15.2628 3.18084 17.9124 5.13435 19.8659C6.10162 20.8331 7.24995 21.6004 8.51375 22.1239C9.77756 22.6474 11.1321 22.9168 12.5 22.9168C15.2627 22.9168 17.9122 21.8194 19.8657 19.8659C21.8192 17.9124 22.9167 15.2628 22.9167 12.5002C22.9167 11.1322 22.6473 9.77769 22.1238 8.51388C21.6003 7.25007 20.833 6.10174 19.8657 5.13447C18.8985 4.16719 17.7501 3.3999 16.4863 2.87642C15.2225 2.35293 13.868 2.0835 12.5 2.0835Z" fill="var(--followBtn-bg)" />
                            </svg>
                        </div>
                        <a href={twitter} target="_blank">
                            Twitter
                        </a>
                    </div>}

                    {linkedin && <div className="locationdetails">
                        <div>
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.0417 14.5835C17.125 13.896 17.1875 13.2085 17.1875 12.5002C17.1875 11.7918 17.125 11.1043 17.0417 10.4168H20.5625C20.7292 11.0835 20.8334 11.7814 20.8334 12.5002C20.8334 13.2189 20.7292 13.9168 20.5625 14.5835M15.198 20.3752C15.823 19.2189 16.3021 17.9689 16.6355 16.6668H19.7084C18.6992 18.4046 17.0981 19.721 15.198 20.3752ZM14.9375 14.5835H10.0625C9.95837 13.896 9.89587 13.2085 9.89587 12.5002C9.89587 11.7918 9.95837 11.0939 10.0625 10.4168H14.9375C15.0313 11.0939 15.1042 11.7918 15.1042 12.5002C15.1042 13.2085 15.0313 13.896 14.9375 14.5835ZM12.5 20.7918C11.6355 19.5418 10.9375 18.1564 10.5105 16.6668H14.4896C14.0625 18.1564 13.3646 19.5418 12.5 20.7918ZM8.33337 8.3335H5.29171C6.29029 6.59082 7.89031 5.27229 9.79171 4.62516C9.16671 5.78141 8.69796 7.03141 8.33337 8.3335ZM5.29171 16.6668H8.33337C8.69796 17.9689 9.16671 19.2189 9.79171 20.3752C7.89407 19.7213 6.29618 18.4045 5.29171 16.6668ZM4.43754 14.5835C4.27087 13.9168 4.16671 13.2189 4.16671 12.5002C4.16671 11.7814 4.27087 11.0835 4.43754 10.4168H7.95837C7.87504 11.1043 7.81254 11.7918 7.81254 12.5002C7.81254 13.2085 7.87504 13.896 7.95837 14.5835M12.5 4.19808C13.3646 5.44808 14.0625 6.84391 14.4896 8.3335H10.5105C10.9375 6.84391 11.6355 5.44808 12.5 4.19808ZM19.7084 8.3335H16.6355C16.3089 7.04351 15.8262 5.79819 15.198 4.62516C17.1146 5.28141 18.7084 6.60433 19.7084 8.3335ZM12.5 2.0835C6.73962 2.0835 2.08337 6.771 2.08337 12.5002C2.08337 15.2628 3.18084 17.9124 5.13435 19.8659C6.10162 20.8331 7.24995 21.6004 8.51375 22.1239C9.77756 22.6474 11.1321 22.9168 12.5 22.9168C15.2627 22.9168 17.9122 21.8194 19.8657 19.8659C21.8192 17.9124 22.9167 15.2628 22.9167 12.5002C22.9167 11.1322 22.6473 9.77769 22.1238 8.51388C21.6003 7.25007 20.833 6.10174 19.8657 5.13447C18.8985 4.16719 17.7501 3.3999 16.4863 2.87642C15.2225 2.35293 13.868 2.0835 12.5 2.0835Z" fill="var(--followBtn-bg)" />
                            </svg>

                        </div>
                        <a href={linkedin} target="_blank">
                            Linkedin
                        </a>
                    </div>}

                    <div className="reviewText">
                        <b>{review?.length}</b> Reviews
                    </div>
                    <div>
                        {id == undefined ? <ReviewStars avg={averagereview} /> :
                            <>
                                <AddReviewStars
                                    filledStars={filledStars}
                                    setFilledStars={setFilledStars}
                                />{" "}
                                <button className="reviewPostButton"

                                    onClick={sendReview}
                                >
                                    Post
                                </button>
                            </>}
                    </div>
                </div>
                {/* RIGHT PART */}
                <div className='ActivtyDetailsCard'>
                    <div className="toggleContainer">
                        <div className={`ActivtyDetailsCardToggle ${editPostToggler == 'profile' && "ActivtyDetailsCardToggleSelected"
                            }`} onClick={() => seteditPostToggler('profile')}>
                            About
                        </div>
                        <div className={`ActivtyDetailsCardToggle ${editPostToggler == 'posts' && "ActivtyDetailsCardToggleSelected"
                            }`} onClick={() => seteditPostToggler('posts')}>
                            Activity
                        </div>
                        <div className={`ActivtyDetailsCardToggle ${editPostToggler == 'comment' && "ActivtyDetailsCardToggleSelected"
                            }`} onClick={() => seteditPostToggler('comment')}>
                            Reviews
                        </div>
                    </div>
                    {editPostToggler == 'profile' &&
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* ABOUT */}
                            <section className="EditProfileOuterCard">
                                <div className="aboutHeadings" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}><div>About</div>
                                    {id == undefined && (
                                        <span>
                                            <i
                                                onClick={handleAboutButtonClick}
                                                className="fas fa-pen"
                                            ></i>
                                        </span>
                                    )}
                                </div>
                                <div className=''>{bio?.length > 0 ? bio : <div>No bio data found</div>}</div>

                            </section>

                            {/* SKILLS */}
                            <section className="EditProfileOuterCard">
                                <div className="aboutHeadings" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div>Skills</div>
                                    {id == undefined && (
                                        <span>
                                            <i
                                                onClick={handleSkillButtonClick}
                                                className="fas fa-pen"
                                            ></i>
                                        </span>
                                    )}
                                </div>
                                <div className="indiSkillsContainer">
                                    {skills?.map((t, i) => (
                                        <div className="indiSkills">{t}</div>
                                    ))}
                                </div>

                            </section>

                            {/* EDUCATION */}
                            <section className="EditProfileOuterCard">
                                <div className="aboutHeadings" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>Education</div>
                                    {id == undefined && (
                                        <span>
                                            <i
                                                onClick={handleEducationButtonClick}
                                                className="fas fa-plus"
                                            ></i>
                                        </span>
                                    )}
                                </div>

                                {totalEducationData.length > 0 ? (
                                    <div>
                                        {totalEducationData.map((te, i) => (
                                            <div className="indiEducationCont" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div className="indiEducation">
                                                    <div>
                                                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="50" height="50" rx="5" fill="var(--followBtn-bg)" fill-opacity="0.3" />
                                                            <path d="M25.0001 10L6.66675 20L25.0001 30L40.0001 21.8167V33.3333H43.3334V20M13.3334 26.9667V33.6333L25.0001 40L36.6667 33.6333V26.9667L25.0001 33.3333L13.3334 26.9667Z" fill="var(--followBtn-bg)" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="collegeName">{te.college}</div>
                                                        <div className="gradeDetails">{te.grade}</div>
                                                        <div className="timeDetails">{MMDDYYFormat(te.Edstart)}-
                                                            {te.Edend === "" ? "Present" : MMDDYYFormat(te.Edend)}</div>
                                                    </div>
                                                </div>

                                                {id == undefined && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <div
                                                            onClick={(e) => {
                                                                seteditingEducationId(i + 1);
                                                                setEducationDetails(te);
                                                                handleEducationButtonClick();
                                                            }}
                                                        >
                                                            <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-pen"></i>
                                                        </div>
                                                        <div
                                                            onClick={(e) => {
                                                                setTotalEducationData((prev) => [
                                                                    ...prev.filter((f, j) => j !== i),
                                                                ]);
                                                            }}
                                                            style={{ color: "red" }}
                                                        >
                                                            <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-times cross"></i>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>No education data found</div>
                                )}
                            </section>

                            {/* EXPERIENCE */}
                            <section className="EditProfileOuterCard">
                                <div className="aboutHeadings" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>Experience</div>
                                    {id == undefined && (
                                        <span>
                                            <i
                                                onClick={handleExperienceButtonClick}
                                                className="fas fa-plus"
                                            ></i>
                                        </span>
                                    )}
                                </div>

                                {totalExperienceData.length > 0 ? (
                                    totalExperienceData.map((te, i) => (
                                        <div className="indiEducationCont" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div className="indiEducation">
                                                <div>
                                                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="50" height="50" rx="5" fill="var(--followBtn-bg)" fill-opacity="0.3" />
                                                        <path d="M16.6667 28.335H20.0001V31.6683H16.6667V28.335Z" fill="var(--followBtn-bg)" />
                                                        <path d="M36.6667 8.3335H23.3333C22.4493 8.3335 21.6014 8.68469 20.9763 9.30981C20.3512 9.93493 20 10.7828 20 11.6668V21.6668H13.3333C11.495 21.6668 10 23.1618 10 25.0002V40.0002C10 40.4422 10.1756 40.8661 10.4882 41.1787C10.8007 41.4912 11.2246 41.6668 11.6667 41.6668H38.3333C38.7754 41.6668 39.1993 41.4912 39.5118 41.1787C39.8244 40.8661 40 40.4422 40 40.0002V11.6668C40 10.7828 39.6488 9.93493 39.0237 9.30981C38.3986 8.68469 37.5507 8.3335 36.6667 8.3335ZM13.3333 38.3335V25.0002H23.3333V38.3335H13.3333ZM28.3333 18.3335H25V15.0002H28.3333V18.3335ZM35 31.6668H31.6667V28.3335H35V31.6668ZM35 25.0002H31.6667V21.6668H35V25.0002ZM35 18.3335H31.6667V15.0002H35V18.3335Z" fill="var(--followBtn-bg)" />
                                                    </svg>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        padding: "10px",
                                                    }}
                                                >
                                                    {te.institute !== "" && te.institute !== undefined && (
                                                        <div className="collegeName">
                                                            <>{te.institute}(Institute)</>
                                                        </div>
                                                    )}
                                                    {te.company !== "" && te.company !== undefined && (
                                                        <div className="gradeDetails">
                                                            <>{te.company}(Company)</>
                                                        </div>
                                                    )}
                                                    {te.startupName !== "" && te.startupName !== undefined && (
                                                        <div className="gradeDetails">
                                                            <><b>Start Up: </b>{te.startupName}(Startup Name)</>
                                                        </div>
                                                    )}

                                                    <div className="gradeDetails">
                                                        {te.designation && (
                                                            <>
                                                                <b>Designation: </b>
                                                                {te.designation}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="gradeDetails">
                                                        {te.Department && (
                                                            <>
                                                                <b>Department: </b>
                                                                {te.Department}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="gradeDetails">
                                                        {te.Research && (
                                                            <>
                                                                <b>Research: </b>
                                                                {te.Research}
                                                            </>
                                                        )}
                                                    </div>

                                                    {role !== "Technology Partner" &&
                                                        te.workingStatus !== "Self Employed" && (
                                                            <div className="timeDetails">
                                                                <b>Date: </b>
                                                                {MMDDYYFormat(te.start)}-
                                                                {te.end === "" ? "Present" : MMDDYYFormat(te.end)}
                                                            </div>
                                                        )}

                                                    {te.workingStatus == "Self Employed" && (
                                                        <>
                                                            <div className="timeDetails">
                                                                <b>Working Status: </b>
                                                                {te.workingStatus}
                                                            </div>
                                                            <div className="timeDetails">
                                                                <b>Startup / Business Name: </b>
                                                                {te.startupName}
                                                            </div>
                                                            <div className="timeDetails">
                                                                <b>Startup Desc: </b>
                                                                {te.Description}
                                                            </div>
                                                        </>
                                                    )}

                                                    {mentorCategories !== "Academia Mentor" && (
                                                        <>
                                                            <div className="timeDetails">
                                                                <b>Profession: </b>
                                                                {te.Profession}
                                                            </div>
                                                            <div className="timeDetails">
                                                                <b>Total Working Experience: </b>
                                                                {te.TotalWorkExperience}
                                                            </div>
                                                        </>
                                                    )}
                                                    {role == "Technology Partner" && (
                                                        <div className="timeDetails">
                                                            <b>Startup Desc: </b>
                                                            {te.Description}
                                                        </div>
                                                    )}
                                                    {te.CompanyLocation && (
                                                        <div className="timeDetails">
                                                            <b>Company Location: </b>
                                                            {te.CompanyLocation}
                                                        </div>
                                                    )}

                                                    {te.Customers && (
                                                        <div className="timeDetails">
                                                            <b>Total customers served by company : </b>
                                                            {te.Customers}
                                                        </div>
                                                    )}

                                                    {te.Banner && (
                                                        <div className="timeDetails">
                                                            <b>Banner: </b>
                                                            <a
                                                                href={te.Banner?.secure_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                Click here
                                                            </a>
                                                        </div>
                                                    )}
                                                    {te.Logo && (
                                                        <div className="timeDetails">
                                                            <b>Logo: </b>
                                                            <a
                                                                href={te.Logo?.secure_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                Click here
                                                            </a>
                                                        </div>
                                                    )}

                                                    <div className="timeDetails">
                                                        {te.Achievements && (
                                                            <>
                                                                <b>Achievements: </b>
                                                                {te.Achievements}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="timeDetails">
                                                        {te.Published && (
                                                            <>
                                                                <b>Published: </b>
                                                                {te.Published}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="timeDetails">
                                                        {te.StartupExperience && (
                                                            <>
                                                                <b>StartupExperience: </b>
                                                                {te.StartupExperience}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="timeDetails">
                                                        {te.Consultancy && (
                                                            <>
                                                                <b>Consultancy: </b>
                                                                {te.Consultancy}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {id == undefined && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "5px",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <div
                                                        onClick={(e) => {
                                                            seteditingExperienceId(i + 1);
                                                            setExperience(te);
                                                            handleExperienceButtonClick();
                                                        }}
                                                    >
                                                        <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-pen"></i>
                                                    </div>
                                                    <div
                                                        onClick={(e) => {
                                                            setTotalExperienceData((prev) => [
                                                                ...prev.filter((f, j) => j !== i),
                                                            ]);
                                                        }}
                                                        style={{ color: "red" }}
                                                    >
                                                        <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-times cross"></i>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div>No Experience data found</div>
                                )}
                            </section>

                            <section className="EditProfileOuterCard">
                                {userpage === false && (
                                    <section >
                                        <div >
                                            <div className="aboutHeadings">
                                                <div>Documents</div>
                                            </div>
                                            <form className="">
                                                <div className="upload-files-container">
                                                    <div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "2px",
                                                                justifyContent: "space-between",
                                                                width: width < 700 && "320px",
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
                                                                            style={{
                                                                                marginRight: "30px",
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16"><path fill="var(--followBtn-bg)" d="M5 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5.414a1.5 1.5 0 0 0-.44-1.06L9.647 1.439A1.5 1.5 0 0 0 8.586 1zM4 3a1 1 0 0 1 1-1h3v2.5A1.5 1.5 0 0 0 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.793 2H9.5a.5.5 0 0 1-.5-.5V2.207z" /></svg>

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
                                                                    width: width < 700 && "320px",
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
                                                                                rel="noreferrer" style={{
                                                                                    marginRight: "30px",
                                                                                }}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16"><path fill="var(--followBtn-bg)" d="M5 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5.414a1.5 1.5 0 0 0-.44-1.06L9.647 1.439A1.5 1.5 0 0 0 8.586 1zM4 3a1 1 0 0 1 1-1h3v2.5A1.5 1.5 0 0 0 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.793 2H9.5a.5.5 0 0 1-.5-.5V2.207z" /></svg>

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
                                                                width: width < 700 && "320px",
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
                                                                            rel="noreferrer" style={{
                                                                                marginRight: "30px",
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16"><path fill="var(--followBtn-bg)" d="M5 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5.414a1.5 1.5 0 0 0-.44-1.06L9.647 1.439A1.5 1.5 0 0 0 8.586 1zM4 3a1 1 0 0 1 1-1h3v2.5A1.5 1.5 0 0 0 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.793 2H9.5a.5.5 0 0 1-.5-.5V2.207z" /></svg>

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
                                                                width: width < 700 && "320px",
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
                                                                            rel="noreferrer" style={{
                                                                                marginRight: "30px",
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16"><path fill="var(--followBtn-bg)" d="M5 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5.414a1.5 1.5 0 0 0-.44-1.06L9.647 1.439A1.5 1.5 0 0 0 8.586 1zM4 3a1 1 0 0 1 1-1h3v2.5A1.5 1.5 0 0 0 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.793 2H9.5a.5.5 0 0 1-.5-.5V2.207z" /></svg>

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
                                                                width: width < 700 && "320px",
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
                                                                            rel="noreferrer" style={{
                                                                                marginRight: "30px",
                                                                            }}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 16 16"><path fill="var(--followBtn-bg)" d="M5 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5.414a1.5 1.5 0 0 0-.44-1.06L9.647 1.439A1.5 1.5 0 0 0 8.586 1zM4 3a1 1 0 0 1 1-1h3v2.5A1.5 1.5 0 0 0 9.5 6H12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm7.793 2H9.5a.5.5 0 0 1-.5-.5V2.207z" /></svg>

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
                                )}
                            </section>


                            {/* Buttons for save data */}
                            {userpage === false &&
                                (id == undefined ? (
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
                                            <button style={{ fontSize: "10px" }} onClick={retreiveLocal}>
                                                Retreive last Save
                                            </button>
                                            <button style={{ fontSize: "10px" }} onClick={savingLocal}>
                                                Save
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={
                                                    isLoading ||
                                                    !isFormValid ||
                                                    image === undefined ||
                                                    image === ""
                                                }
                                                onClick={update}
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    position: "relative",
                                                    fontSize: "10px",
                                                }}
                                            >
                                                {isLoading ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "5px",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <div className="button-loader"></div>
                                                        <div style={{}}>Updating...</div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* <i
                      className="fas fa-address-card"
                      style={{ marginRight: "5px" }}
                    ></i> */}
                                                        Update
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
                                ))}
                        </div>
                    }

                    {/* POSTS SECTION */}
                    {editPostToggler == 'posts' &&
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {id == undefined && <section className="createPostContainer">
                                <button onClick={() => setCreatePostpopup(true)}
                                    className="createPostbtn"
                                >
                                    Create Post
                                </button>
                            </section>}

                            {/* post cards */}

                            <div className="allPostShowContainer">
                                {allPosts?.map(post => (
                                    <Post post={post} setAllPosts={setAllPosts} />
                                ))}
                            </div>



                        </div>
                    }

                    {/* Comment SECTION */}
                    {editPostToggler == 'comment' &&
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                            <div className="allCommentsShowContainer">
                                <section className="EditProfileOuterCard">
                                    <div className="commentHeader">Reviews</div>
                                    <div className="commentLengthHeader">{allComments?.length} Reviews</div>

                                    {(convExits || id == undefined ||
                                        jwtDecode(JSON.parse(localStorage.getItem("user")).accessToken)
                                            .role == "Admin") ?
                                        <div style={{ display: 'flex',  gap: '5px', alignItems: 'center', marginLeft: '-15px' }}>
                                            <div className='addingCommentImageShow'>
                                                <img
                                                    src={
                                                        loggedImage !== undefined && loggedImage !== "" ? loggedImage : "/profile.png"
                                                    }
                                                />
                                            </div>
                                            <section className="CommentPostContainer">
                                                <div>
                                                    <textarea type="text" name="" id=""
                                                        value={comment} placeholder="Add a review comment..."
                                                        style={{ resize: "none" }}
                                                        onChange={(e) => setComment(e.target.value)} />
                                                </div>
                                                <div onClick={sendText} style={{ cursor: comment == '' && 'not-allowed' }}>
                                                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.6668 20.3333L32.0001 2M13.6668 20.3333L19.5001 32C19.5732 32.1596 19.6906 32.2948 19.8384 32.3896C19.9861 32.4844 20.1579 32.5348 20.3335 32.5348C20.509 32.5348 20.6808 32.4844 20.8285 32.3896C20.9763 32.2948 21.0937 32.1596 21.1668 32L32.0001 2M13.6668 20.3333L2.00012 14.5C1.84055 14.4269 1.70533 14.3095 1.61053 14.1618C1.51573 14.014 1.46533 13.8422 1.46533 13.6667C1.46533 13.4911 1.51573 13.3193 1.61053 13.1716C1.70533 13.0239 1.84055 12.9065 2.00012 12.8333L32.0001 2" stroke="var(--post-outer-border)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>

                                                </div>
                                                {/* <button onClick={sendText}
                                        className="createComment"
                                    >
                                        Add Comment
                                    </button> */}
                                            </section>
                                        </div>
                                        : <div style={{ fontSize: "20px", marginBottom: "20px", textAlign: 'center' }}>
                                            Conversation with this user should exist to add reviews
                                        </div>
                                    }
                                    {allComments?.map((comment, index) => (
                                        <UserComment onLike={onLike}
                                            key={index}
                                            comment={comment}
                                            deleteComment={deleteComment}
                                            onDisLike={onDisLike} setAllComments={setAllComments} />
                                    ))}
                                </section>
                            </div>
                        </div>
                    }


                </div>
                {isInputPopupVisible && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <div className="Inputs-Container">
                                <div className="Input_Wrapper">
                                    <div
                                        className="popup-header"
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <h3>Personal Information</h3>
                                        <div
                                            className="close-icon"
                                            onClick={() => {
                                                document.getElementsByTagName(
                                                    "body"
                                                )[0].style.overflowY = "scroll";
                                                setIsInputPopupVisible(false);
                                            }}
                                        >
                                            <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-times"></i>
                                        </div>
                                    </div>
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
                                    <label className="Input-Label">Twitter</label>
                                    <div className="Input_Fields">
                                        <input
                                            type="text"
                                            value={twitter}
                                            onChange={(e) => {
                                                setInputs((prev) => ({
                                                    ...prev,
                                                    twitter: e.target.value,
                                                }));
                                            }}
                                        />
                                    </div>
                                    <label className="Input-Label">Linkedin</label>
                                    <div className="Input_Fields">
                                        <input
                                            type="text"
                                            value={linkedin}
                                            onChange={(e) => {
                                                setInputs((prev) => ({
                                                    ...prev,
                                                    linkedin: e.target.value,
                                                }));
                                            }}
                                        />
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
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button
                                                        className="add-button"
                                                        onClick={() => {
                                                            document.getElementsByTagName(
                                                                "body"
                                                            )[0].style.overflowY = "scroll";
                                                            setIsInputPopupVisible(false)
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isAboutPopupVisible && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <div>
                                <div
                                    className="popup-header"
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <h3>Edit About</h3>
                                    <div
                                        className="close-icon"
                                        onClick={() => {
                                            document.getElementsByTagName("body")[0].style.overflowY =
                                                "scroll";
                                            setIsAboutPopupVisible(false);
                                        }}
                                    >
                                        <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-times"></i>
                                    </div>
                                </div>
                                <textarea
                                    className="bioText"
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


                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <button
                                        className="add-button"
                                        onClick={() => {
                                            document.getElementsByTagName("body")[0].style.overflowY =
                                                "scroll";
                                            setIsAboutPopupVisible(false)
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {isSkillsPopupVisibile && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <div>
                                <div className="skills-Container">
                                    <div>
                                        <div>
                                            <div
                                                className="popup-header"
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <h3>Edit Skills</h3>
                                                <div
                                                    className="close-icon"
                                                    onClick={() => {
                                                        document.getElementsByTagName("body")[0].style.overflowY =
                                                            "scroll";
                                                        setisSkillsPopupVisibile(false);
                                                    }}
                                                >
                                                    <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-times"></i>
                                                </div>
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
                                                    onChange={(e) => {
                                                        if (
                                                            e.target.value !== "" &&
                                                            !skills.includes(e.target.value)
                                                        ) {
                                                            setSkills((prev) => [...prev, e.target.value]);
                                                        }
                                                    }}
                                                >
                                                    <option value="">Select</option>
                                                    {allskills.map((d) => (
                                                        <option value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <button
                                        className="add-button"
                                        onClick={() => {
                                            document.getElementsByTagName("body")[0].style.overflowY =
                                                "scroll";
                                            setisSkillsPopupVisibile(false)
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {isEducationPopupVisible && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <form className="update-form">
                                <div className="popup-header">
                                    <h3>Education</h3>
                                    <div
                                        className="close-icon"
                                        onClick={() => {
                                            document.getElementsByTagName(
                                                "body"
                                            )[0].style.overflowY = "scroll";

                                            setIsEducationPopupVisible(false);
                                            seteditingEducationId("");
                                            setEducationDetails({
                                                year: "",
                                                grade: "",
                                                college: "",
                                                Edstart: "",
                                                Edend: "",
                                            });
                                        }}
                                    >
                                        <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-times"></i>
                                    </div>
                                </div>

                                <div className="edu-container">
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
                                                        "(Type 3 characters)"}
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
                                            {editingEducationId !== "" ? "Update" : "Add"}
                                        </button>
                                    </div>
                                </div>
                                <div></div>
                            </form>
                        </div>
                    </div>
                )}




                {isExperiencePopupVisible && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <div className="Work-exp">
                                <form className="update-form">
                                    <div className="popup-header">
                                        <h3>Experience</h3>
                                        <div
                                            className="close-icon"
                                            onClick={() => {
                                                document.getElementsByTagName(
                                                    "body"
                                                )[0].style.overflowY = "scroll";

                                                setIsExperiencePopupVisible(false);
                                                seteditingExperienceId("");
                                                setExperience({
                                                    areaOfBusiness: "",
                                                    business: "",
                                                    institute: "",
                                                    startupName: "",
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
                                            <i style={{ color: 'var(--followBtn-bg)' }} class="fas fa-times"></i>
                                        </div>
                                    </div>
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
                                                        className={
                                                            experienceDetails.institute == ""
                                                                ? "editErrors"
                                                                : "editSuccess"
                                                        }
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
                                                        className={
                                                            experienceDetails.designation == ""
                                                                ? "editErrors"
                                                                : "editSuccess"
                                                        }
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
                                                        className={
                                                            experienceDetails.Department == ""
                                                                ? "editErrors"
                                                                : "editSuccess"
                                                        }
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
                                                        className={
                                                            experienceDetails.Research == ""
                                                                ? "editErrors"
                                                                : "editSuccess"
                                                        }
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
                                                            className={
                                                                experienceDetails.start == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                        className={
                                                            experienceDetails.Achievements == ""
                                                                ? "editErrors"
                                                                : "editSuccess"
                                                        }
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
                                                        className={
                                                            experienceDetails.Published == ""
                                                                ? "editErrors"
                                                                : "editSuccess"
                                                        }
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
                                                            className={
                                                                experienceDetails.workingStatus == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                        <label className="Input-Label">Company Name*</label>
                                                    </div>
                                                    <div className="Exp_Input_Fields">
                                                        <input
                                                            type="text"
                                                            name="company"
                                                            className={
                                                                experienceDetails.company == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                            className={
                                                                experienceDetails.designation == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                                className={
                                                                    experienceDetails.start == ""
                                                                        ? "editErrors"
                                                                        : "editSuccess"
                                                                }
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
                                                            className={
                                                                experienceDetails.Profession == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                            className={
                                                                experienceDetails.TotalWorkExperience == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                                className={
                                                                    experienceDetails.startupName == ""
                                                                        ? "editErrors"
                                                                        : "editSuccess"
                                                                }
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
                                                                className={
                                                                    experienceDetails.Description == ""
                                                                        ? "editErrors"
                                                                        : "editSuccess"
                                                                }
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
                                                                className={
                                                                    experienceDetails.designation == ""
                                                                        ? "editErrors"
                                                                        : "editSuccess"
                                                                }
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
                                                                className={
                                                                    experienceDetails.Profession == ""
                                                                        ? "editErrors"
                                                                        : "editSuccess"
                                                                }
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
                                                                className={
                                                                    experienceDetails.TotalWorkExperience == ""
                                                                        ? "editErrors"
                                                                        : "editSuccess"
                                                                }
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
                                                            className={
                                                                experienceDetails.Customers == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                            className={
                                                                experienceDetails.CompanyLocation == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                            className={
                                                                experienceDetails.areaOfBusiness == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
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
                                                    <label
                                                        htmlFor="Banner"
                                                        className={`resume ${experienceDetails.Banner == ""
                                                            ? "editErrors"
                                                            : "editSuccess"
                                                            }`}
                                                    >
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
                                                    <label
                                                        htmlFor="Logo"
                                                        className={`resume ${experienceDetails.Logo == ""
                                                            ? "editErrors"
                                                            : "editSuccess"
                                                            }`}
                                                    >
                                                        <CloudUploadIcon />
                                                        <span className="fileName">{Logo || "Upload"}</span>
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
                                                        <label className="Input-Label">Services*</label>
                                                    </div>
                                                    <div className="Exp_Input_Fields">
                                                        <input
                                                            type="text"
                                                            name="Services"
                                                            className={
                                                                experienceDetails.Services == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"
                                                            }
                                                            value={experienceDetails.Services}
                                                            id=""
                                                            onChange={handleChange}
                                                            placeholder="Services"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}



                                        {mentorCategories == null &&
                                            <><div>
                                                <div>
                                                    <label className="Input-Label">
                                                        Company Name*
                                                    </label>
                                                </div>
                                                <div className="Exp_Input_Fields">
                                                    <input
                                                        type="text"
                                                        name="company"
                                                        className={experienceDetails.company == ""
                                                            ? "editErrors"
                                                            : "editSuccess"}
                                                        value={experienceDetails.company}
                                                        id=""
                                                        onChange={handleChange}
                                                        placeholder="Enter Your Company name" />
                                                </div>
                                            </div><div>
                                                    <div>
                                                        <label className="Input-Label">
                                                            Current Designation*
                                                        </label>
                                                    </div>
                                                    <div className="Exp_Input_Fields">
                                                        <select
                                                            name="designation"
                                                            className={experienceDetails.designation == ""
                                                                ? "editErrors"
                                                                : "editSuccess"}
                                                            value={experienceDetails.designation}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select</option>
                                                            {itPositions.map((op) => (
                                                                <option value={op}>{op}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div><div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                        }}
                                                    >
                                                        <div>
                                                            <label className="Input-Label">
                                                                Start Date*
                                                            </label>
                                                        </div>
                                                        <div className="Exp_Input_Fields">
                                                            <input
                                                                type="date"
                                                                className={experienceDetails.start == ""
                                                                    ? "editErrors"
                                                                    : "editSuccess"}
                                                                value={experienceDetails.start}
                                                                name="start"
                                                                id=""
                                                                onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                        }}
                                                    >
                                                        <div>
                                                            <label className="Input-Label">
                                                                End Date
                                                            </label>
                                                        </div>
                                                        <div className="Exp_Input_Fields">
                                                            <input
                                                                type="date"
                                                                value={experienceDetails.end}
                                                                name="end"
                                                                id=""
                                                                onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div></>
                                        }

                                        <div>
                                            <button
                                                className="add-button"
                                                onClick={addExperience}
                                                disabled={
                                                    (role === "Technology Partner" &&
                                                        (experienceDetails.startupName == "" ||
                                                            experienceDetails.Description == "" ||
                                                            experienceDetails.designation == "" ||
                                                            experienceDetails.Profession == "" ||
                                                            experienceDetails.TotalWorkExperience == "" ||
                                                            experienceDetails.Customers == "" ||
                                                            experienceDetails.CompanyLocation == "" ||
                                                            experienceDetails.business == "" ||
                                                            experienceDetails.Banner == "" ||
                                                            experienceDetails.Logo == "" ||
                                                            experienceDetails.Services == "")) ||
                                                    (role === "Entrepreneur" &&
                                                        ((experienceDetails.workingStatus == "Job" &&
                                                            (experienceDetails.company == "" ||
                                                                experienceDetails.designation == "" ||
                                                                experienceDetails.start == "" ||
                                                                experienceDetails.TotalWorkExperience == "" ||
                                                                experienceDetails.Profession == "")) ||
                                                            (experienceDetails.workingStatus ==
                                                                "Self Employed" &&
                                                                (experienceDetails.startupName == "" ||
                                                                    experienceDetails.Description == "" ||
                                                                    experienceDetails.designation == "" ||
                                                                    experienceDetails.Profession == "" ||
                                                                    experienceDetails.TotalWorkExperience ==
                                                                    "")))) ||
                                                    (role == "Mentor" &&
                                                        ((mentorCategories == "Academia Mentor" &&
                                                            (experienceDetails.institute == "" ||
                                                                experienceDetails.designation == "" ||
                                                                experienceDetails.Department == "" ||
                                                                experienceDetails.start == "" ||
                                                                experienceDetails.Research == "" ||
                                                                experienceDetails.Achievements == "" ||
                                                                experienceDetails.Published == "")) ||
                                                            (mentorCategories == "Industry Expert Mentor" &&
                                                                ((experienceDetails.workingStatus == "Job" &&
                                                                    (experienceDetails.company == "" ||
                                                                        experienceDetails.designation == "" ||
                                                                        experienceDetails.start == "" ||
                                                                        experienceDetails.TotalWorkExperience ==
                                                                        "" ||
                                                                        experienceDetails.Profession == "")) ||
                                                                    (experienceDetails.workingStatus ==
                                                                        "Self Employed" &&
                                                                        (experienceDetails.startupName == "" ||
                                                                            experienceDetails.Description == "" ||
                                                                            experienceDetails.designation == "" ||
                                                                            experienceDetails.Profession == "" ||
                                                                            experienceDetails.TotalWorkExperience ==
                                                                            ""))))))
                                                }

                                            >
                                                {editingExperienceId == "" ? "Add" : "Update"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}




            </div>
            <CreatePost setCreatePostpopup={setCreatePostpopup} createPostPopup={createPostPopup} setAllPosts={setAllPosts} />
            <AddConversationPopup receiverId={pitchSendTo}
                setReceiverId={setPitchSendTo}
                receiverRole={receiverRole}
                IsAdmin={IsAdmin} />
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
                            placeholder="Enter reason"
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
            <ShowingFollowers typeOfOpen={typeOfOpen} setTypeOfOpen={setTypeOfOpen} data={typeOfOpen == null ? [] : (typeOfOpen == 'followers' ? followers : followering)} />

        </div>
    )
}

export default EditProfile