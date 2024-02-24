import React, { useEffect, useRef, useState } from "react";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { getAllHistoricalConversations, setUserAllPitches } from "../../redux/Conversationreducer/ConversationReducer";
import { setLoading, setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";
import { io } from "socket.io-client";
import {
  domain_subdomain,
  idealUserRole,
  isAncestor,
  isParent,
  itPositions,
  socket_io,
  stages,
} from "../../Utils";
import {
  Box,
  Dialog,
  DialogContent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { gridCSS } from "../CommonStyles";
import CloseIcon from "@mui/icons-material/Close";
import { Country, State, City } from "country-state-city";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useWindowDimensions from "./WindowSize";
import "./AddPitch.css";
import CachedIcon from "@mui/icons-material/Cached";

function TabPanel(props) {
  const { className, children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={className}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AddPitch = ({ open, setOpen, id, setId }) => {
  const dispatch = useDispatch();
  const { email, role, verification } = useSelector(
    (state) => state.auth.loginDetails
  );
  const socket = useRef();
  useEffect(() => {
    socket.current = io(socket_io);
  }, []);
  const [value, setValue] = React.useState(1);
  const [error, setError] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [selectedpitchId, setselectedpitchId] = useState('');


  const [tags, setTags] = useState([]);
  const userPitches = useSelector(state => state.conv.userLivePitches)

  const [teamMembers, setTeamMembers] = useState([]);
  const [singleTeamMember, setSingleTeamMember] = useState({
    memberPic: "",
    name: "",
    bio: "",
    socialLink: "",
    position: "",
  });

  const [showPreviousFile, setShowPreviousFile] = useState(false);
  const [Teampic, setTeampic] = useState("");
  const [Logo, SetLogo] = useState("");
  const [Banner, SetBanner] = useState("");
  const [Business, SetBusiness] = useState("");
  const [Financial, SetFinancial] = useState("");

  const handleTeamMemberPic = (e) => {
    setTeampic(e.target.files[0].name);
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
      setSingleTeamMember((prev) => ({ ...prev, memberPic: reader.result }));
      setForm((prev) => ({ ...prev, changeStatus: "change" }));
    };
  };

  const saveSingleMember = () => {
    setTeampic("");
    SetLogo("");
    SetBanner("");
    SetBusiness("");
    SetFinancial("");
    setTeamMembers((prev) => [...prev, singleTeamMember]);
    setSingleTeamMember({
      memberPic: "",
      name: "",
      bio: "",
      socialLink: "",
      position: "",
    });
    // console.log(singleTeamMember);
  };

  const totalRoles = useSelector((state) => state.auth.totalRoles);


  const userDetailsRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    tags: "",
    changeStatus: "change",
    hiringPositions: [],
  });
  const [file, setFile] = useState("");
  const handleClose = () => {
    setselectedpitchId('');
    setOpen(false)
    setValue(1);
    setTags([])
    setTeamMembers([])
    setForm({
      title: "",
      tags: "",
      changeStatus: "change",
      hiringPositions: [],
    });
  };

  const handleChanges = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      changeStatus: "change",
    }));
  };

  const handlePitchBusiness = (e) => {
    SetBusiness(e.target.files[0].name);
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
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        pitch: reader.result,
      }));
    };
  };

  const handlePitchFinancials = (e) => {
    SetFinancial(e.target.files[0].name);
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
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        financials: reader.result,
      }));
    };
  };

  const handlePitchLogo = (e) => {
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
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        logo: reader.result,
      }));
    };
  };

  const handleBannerPic = (e) => {
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
      setForm((prev) => ({
        ...prev,
        changeStatus: "change",
        banner: reader.result,
      }));
    };
  };

  useEffect(() => {
    if (id == '') {
      setForm({
        title: "",
        tags: "",
        changeStatus: "change",
        hiringPositions: [],
      })
    }
    if (selectedpitchId !== '' || id !== '') {
      const getDefault = async () => {
        await ApiServices.fetchSinglePitch({ pitchId: id!==''? id : selectedpitchId })
          .then((res) => {
            // console.log(res.data);
            if (res.data) {
              setForm({
                ...res.data,
                pitchId: res.data._id,
                changeStatus: "",
                tags: "",
              });
              setTags(res.data.tags);
              setTeamMembers(res.data.teamMembers);
            }
          })
          .catch((err) => {
            dispatch(
              setToast({
                message: `Error Occured`,
                bgColor: ToastColors.failure,
                visible: "yes",
              })
            );
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
      };
      getDefault();
    }
  }, [selectedpitchId, id]);

  const addPitchData = async (e) => {
    // e.preventDefault();
    dispatch(setLoading({ visible: "yes" }));
    e.target.disabled = true;
    const conversation = {

      pitch: file,
      email: email,
      role: role,
      form: { ...form, pitchId: id==''? '' :form?._id },
      tags: tags,
      teamMembers: teamMembers,
      pitchRequiredStatus: "show",
    };
    await ApiServices.addPitch(conversation)
      .then(async (res) => {
        // console.log(res.data);
        await ApiServices.getuserPitches().then(res => {
          dispatch(setUserAllPitches(res.data))
        }).catch(err => {
          dispatch(setToast({
            message: "Error while fetching pitches",
            bgColor: ToastColors.failure,
            visible: "yes",
          }))
        })
        setForm({
          title: "",
          tags: "",
          changeStatus: "change",
          hiringPositions: [],
        });
        setTags([])
        setTeamMembers([])
        setId('')
        setselectedpitchId('')
        dispatch(
          setToast({
            message: res.data,
            bgColor: ToastColors.success,
            visible: "yes",
          })
        );
        setValue(1)
        setOpen(false);
        e.target.disabled = false;

        dispatch(setLoading({ visible: "no" }));
      })
      .catch((err) => {
        // console.log(err);
        setId('')
        setselectedpitchId('')
        setValue(1)
        setOpen(false);
        setForm({
          title: "",
          tags: "",
          changeStatus: "change",
          hiringPositions: [],
        });
        setTags([])
        setTeamMembers([])
        dispatch(
          setToast({
            message: `Error Occured/try updating pitch`,
            bgColor: ToastColors.failure,
            visible: "yes",
          })
        );
        e.target.disabled = false;
        dispatch(setLoading({ visible: "no" }));
      });
    
   
  };



  const handleClickOutside = (event) => {
    if (
      userDetailsRef.current &&
      !userDetailsRef.current.contains(event.target) &&
      event.target.id !== "newchat" &&
      event.target.id !== "Profile-img"
    ) {
      document
        .getElementsByClassName("newConversation")[0]
        .classList.remove("show");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { height, width } = useWindowDimensions();

  // Function to handle the Next button click event
  const handleNext = () => {
    switch (value) {
      case 1:
        if (areValue1FieldsEmpty()) {
          setError("Please fill in all required fields.");
        } else {
          setError("");
          setValue(value + 1);
        }
        break;
      case 2:
        if (areValue2FieldsEmpty()) {
          setError("Please fill in all required fields.");
        } else {
          setError("");
          setValue(value + 1);
        }
        break;
      case 3:
        if (areValue3FieldsEmpty()) {
          setError("Please fill in all required fields.");
        } else {
          setError("");
          setValue(value + 1);
        }
        break;
      case 4:
        if (areValue4FieldsEmpty()) {
          setError("Please fill in all required fields.");
        } else {
          setError("");
          setValue(value + 1);
        }
        break;
      case 5:
        if (areValue5FieldsEmpty()) {
          setError("Please fill in all required fields.");
        } else {
          setError("");
          setValue(value + 1);
        }
        break;
      case 6:
        if (areValue6FieldsEmpty()) {
          setError("Please fill in all required fields.");
        } else {
          setError("");
          setValue(value + 1);
        }
        break;
      default:
    }
  };

  const [isSpinning, setSpinning] = useState(false);

  const handleReloadClick = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 2000);
  };
  // Function to check if all fields in the value === 1 section are empty
  const areValue1FieldsEmpty = () => {
    return (
        !form?.title  ||
        !form?.website  ||
        !form?.industry1  ||
        !form?.industry2  ||
        !form?.stage  ||
        !form?.userType  ||
        !form?.idealInvestor  ||
        !form?.previousRoundRaise  ||
        !form?.raising  ||
        !form?.minimumInvestment 
    );
  };

  // Function to check if all fields in the value === 2 section are empty
  const areValue2FieldsEmpty = () => {
    return (
      !form?.overViewOfStartup ||
      !form?.businessModel ||
      !form?.revenueModel ||
      !form?.targetMarket ||
      !form?.targetUsers ||
      !form?.usp ||
      !form?.competitorAnalysis
    );
  };

  // Function to check if all fields in the value === 3 section are empty
  const areValue3FieldsEmpty = () => {
    return !form?.teamOverview || !teamMembers.length > 0;
  };

  // Function to check if all fields in the value === 4 section are empty
  const areValue4FieldsEmpty = () => {
    return !form?.logo || !form?.banner;
  };

  // Function to check if all fields in the value === 5 section are empty
  const areValue5FieldsEmpty = () => {
    return !form?.pitch || !form?.financials;
  };

  // Function to check if all fields in the value === 6 section are empty
  const areValue6FieldsEmpty = () => {
    return !form?.heading || !form?.description || !tags.length > 0;
  };

  // Function to determine if Next button should be disabled based on current value
  const isNextButtonDisabled = () => {
    switch (value) {
      case 1:
        return areValue1FieldsEmpty();
      case 2:
        return areValue2FieldsEmpty();
      case 3:
        return areValue3FieldsEmpty();
      case 4:
        return areValue4FieldsEmpty();
      case 5:
        return areValue5FieldsEmpty();
      case 6:
        return areValue6FieldsEmpty();
      default:
        return true;
    }
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        sx={gridCSS.tabContainer}
        // sx={ gridCSS.tabContainer }
      >
        <DialogContent
          style={{
            height: "90vh",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="addPitchHeader">
            <div
              className={`addPitchIcons ${
                value === 1 && "addPitchIconsselected"
              }`}
              onClick={() => setValue(1)}
             
            >
              Company Info
            </div>
            <div
              className={`addPitchIcons ${
                value === 2 && "addPitchIconsselected"
              }`}
              onClick={() => !areValue1FieldsEmpty() && setValue(2)}
              style={{
                cursor: areValue1FieldsEmpty() ? "not-allowed" : "pointer",
              }}
            >
              Pitch & Deal
            </div>
            <div
              className={`addPitchIcons ${
                value === 3 && "addPitchIconsselected"
              }`}
              onClick={() => (!areValue2FieldsEmpty() && !areValue1FieldsEmpty() ) && setValue(3)}
              style={{
                cursor: (areValue2FieldsEmpty() || areValue1FieldsEmpty()) ? "not-allowed" : "pointer",
              }}
            >
              Team
            </div>
            <div
              className={`addPitchIcons ${
                value === 4 && "addPitchIconsselected"
              }`}
              onClick={() => (!areValue2FieldsEmpty() && !areValue1FieldsEmpty() && !areValue3FieldsEmpty()) && setValue(4)}
              style={{
                cursor: (areValue2FieldsEmpty() || areValue1FieldsEmpty() || areValue3FieldsEmpty()) ? "not-allowed" : "pointer",
              }}
            >
              Image & videos
            </div>
            <div
              className={`addPitchIcons ${
                value === 5 && "addPitchIconsselected"
              }`}
              onClick={() => (!areValue2FieldsEmpty() && !areValue1FieldsEmpty() && !areValue3FieldsEmpty() && !areValue4FieldsEmpty()) && setValue(5)}
              style={{
                cursor: (areValue2FieldsEmpty() || areValue1FieldsEmpty() || areValue3FieldsEmpty() || areValue4FieldsEmpty()) ? "not-allowed" : "pointer",
              }}
            >
              Documents
            </div>
            <div
              className={`addPitchIcons ${
                value === 6 && "addPitchIconsselected"
              }`}
              onClick={() => (!areValue2FieldsEmpty() && !areValue1FieldsEmpty() && !areValue3FieldsEmpty() && !areValue4FieldsEmpty() && !areValue5FieldsEmpty()) && setValue(6)}
              style={{
                cursor:(areValue2FieldsEmpty() || areValue1FieldsEmpty() || areValue3FieldsEmpty() || areValue4FieldsEmpty() || areValue5FieldsEmpty()) ? "not-allowed" : "pointer",
              }}
            >
              Requirements
            </div>
            {id == '' &&  <><div>
              <select
                name="pitch"
                value={selectedpitchId}
                onChange={(e) => setselectedpitchId(e.target.value)}
              >
                <option value="">Select a pitch for reference</option>
                {userPitches?.length > 0 &&
                  userPitches?.map((c) => (
                    <option value={c._id}>{c.title}</option>
                  ))}
              </select>
            </div><div title="Reload for latest request updates">
                <CachedIcon
                  style={{ cursor: "pointer" }}
                  className={isSpinning ? "spin" : "spinText"}
                  onClick={() => {
                    handleReloadClick();
                    setselectedpitchId('');
                    setValue(1);
                    setForm({
                      title: "",
                      tags: "",
                      changeStatus: "change",
                      hiringPositions: [],
                    });
                  } } />
              </div></>}
            <div
              className={`crossIcon`}
              onClick={() => {
                setOpen(false);
                setselectedpitchId('');
                setValue(1);
                setTags([])
                setTeamMembers([])
                setForm({
                  title: "",
                  tags: "",
                  changeStatus: "change",
                  hiringPositions: [],
                });
              }}
            >
              <CloseIcon />
            </div>
          </div>
          {value == 1 && (
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Pitch title*</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="title"
                    value={form?.title}
                    onChange={handleChanges}
                    placeholder="Enter title for pitch"
                  />
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Website*</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="website"
                    value={form?.website}
                    onChange={handleChanges}
                    placeholder="Enter your website with https:// or http://"
                  />
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Where is management located ?*</label>
                </div>
                <div>
                  <select
                    name="memberscountry"
                    value={form?.memberscountry}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {Country?.getAllCountries().length > 0 &&
                      Country?.getAllCountries().map((c) => (
                        <option value={c.name}>{c.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Domain*</label>
                </div>
                <div>
                  <select
                    name="industry1"
                    value={form?.industry1}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {Object.keys(domain_subdomain).map((d) => (
                      <option value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Sub domain*</label>
                </div>
                <div>
                  <select
                    name="industry2"
                    value={form?.industry2}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {domain_subdomain[form?.industry1]?.map((d) => (
                      <option value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Stage*</label>
                </div>
                <div>
                  <select
                    name="stage"
                    value={form?.stage}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {stages.map((d) => (
                      <option value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>User Type*</label>
                </div>
                <div>
                  <select
                    name="userType"
                    value={form?.userType}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>

                    {totalRoles.map((d) => (
                      <option value={d.role}>{d.role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Ideal User Role*</label>
                </div>
                <div>
                  <select
                    name="idealInvestor"
                    value={form?.idealInvestor}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    {idealUserRole.map((d) => (
                      <option value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>How much in total have you raised till now?*</label>
                </div>
                <div>
                  <input
                    type="number"
                    name="previousRoundRaise"
                    value={form?.previousRoundRaise}
                    onChange={handleChanges}
                    placeholder="Enter how much did you raise in previous? *"
                  />
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label style={{ width: "300px", whiteSpace: "wrap" }}>
                    How much total equity in % is diluted for raising above
                    amount?*
                  </label>
                </div>
                <div>
                  <input
                    type="number"
                    name="raising"
                    value={form?.raising}
                    onChange={handleChanges}
                    placeholder="Enter How much total equity in % is diluted for raising above amount?"
                  />
                </div>
              </div>

              {/* <div>
                <div>
                  <label>How much of this total you have raised?</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="raised"
                    value={form?.raised}
                    onChange={handleChanges}
                    placeholder="Enter how much of this total you have raised?"
                  />
                </div>
              </div> */}

              <div className="pitchformFields">
                <div>
                  <label style={{ width: "650px", whiteSpace: "wrap" }}>
                    What and estimated amount you are offering to User
                    (Entrepreneur/Mentor/Investor) who accept this Pitch? Like:
                    Equity , Cash etc.*
                  </label>
                </div>
                <div>
                  <input
                    type="number"
                    name="minimumInvestment"
                    value={form?.minimumInvestment}
                    onChange={handleChanges}
                    placeholder="Enter the minimum investment per investor?"
                  />
                </div>
              </div>
            </div>
          )}

          {value == 2 && (
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Overview of Startup*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="overViewOfStartup"
                    value={form?.overViewOfStartup}
                    onChange={handleChanges}
                    rows={10}
                    cols={50}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Business Model*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="businessModel"
                    value={form?.businessModel}
                    onChange={handleChanges}
                    rows={10}
                    cols={80}
                  ></textarea>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Revenue Model*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="revenueModel"
                    value={form?.revenueModel}
                    onChange={handleChanges}
                    rows={10}
                    cols={80}
                  ></textarea>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Target Market*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="targetMarket"
                    value={form?.targetMarket}
                    onChange={handleChanges}
                    rows={10}
                    cols={50}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Target Users*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="targetUsers"
                    value={form?.targetUsers}
                    onChange={handleChanges}
                    rows={10}
                    cols={50}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>usp*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="usp"
                    value={form?.usp}
                    onChange={handleChanges}
                    rows={10}
                    cols={50}
                  ></textarea>
                </div>
              </div>

              <div className="pitchformFields">
                <div>
                  <label>Competitor Analysis*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="competitorAnalysis"
                    value={form?.competitorAnalysis}
                    onChange={handleChanges}
                    rows={10}
                    cols={50}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          {value == 3 && (
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Team Overview*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="teamOverview"
                    value={form?.teamOverview}
                    onChange={handleChanges}
                    rows={10}
                    cols={70}
                  ></textarea>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Team Members*</label>
                </div>
                {teamMembers.length > 0 && (
                  <div className="listedTeam">
                    {teamMembers.map((t, i) => (
                      <div className="singleMember">
                        {t?.memberPic?.secure_url !== undefined && (
                          <div>
                            <img src={t.memberPic?.secure_url} alt="" />
                          </div>
                        )}
                        <div>{t.name}</div>
                        <div
                          onClick={(e) => {
                            setTeamMembers(
                              teamMembers.filter((f, j) => i !== j)
                            );
                            setForm((prev) => ({
                              ...prev,
                              changeStatus: "change",
                            }));
                          }}
                        >
                          <CloseIcon className="deleteMember" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="addTeamMembers">
                  <div className="teamInputs">
                    <div>
                      <div>
                        <label>Photo*</label>
                        <label htmlFor="photo" className="file">
                          <CloudUploadIcon />
                          <span className="fileName">{Teampic}</span>
                        </label>
                      </div>
                      <input
                        className="file"
                        type="file"
                        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        name="name"
                        id="photo"
                        onChange={handleTeamMemberPic}
                        style={{ display: "none" }}
                      />
                    </div>
                    <div>
                      <div>
                        <label>Name*</label>
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={singleTeamMember?.name}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <div>
                        <label>Bio*</label>
                      </div>
                      <input
                        type="text"
                        name="bio"
                        placeholder="Bio"
                        value={singleTeamMember?.bio}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <div>
                        <label>Social Link*</label>
                      </div>
                      <input
                        type="text"
                        name="socialLink"
                        placeholder="Social Links"
                        value={singleTeamMember?.socialLink}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            socialLink: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <div>
                        <label>Position*</label>
                      </div>
                      <input
                        type="text"
                        name="position"
                        placeholder="position"
                        value={singleTeamMember?.position}
                        onChange={(e) => {
                          setSingleTeamMember((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            changeStatus: "change",
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <button
                        onClick={saveSingleMember}
                        disabled={
                          singleTeamMember.name == "" ||
                          singleTeamMember.memberPic == ""
                        }
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {value == 4 && (
            <div className="pitchForm">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label>Logo*</label>
                  {form?.logo?.secure_url !== undefined &&
                    form?.logo?.secure_url !== "" && (
                      <a
                        target="_blank"
                        href={form?.logo.secure_url}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          title="view Previous Logo"
                          style={{
                            height: "30px",
                            width: "30px",
                            // marginLeft: '270px'
                          }}
                          src="/view.png"
                          onMouseEnter={() => setShowPreviousFile(true)}
                          onMouseLeave={() => setShowPreviousFile(false)}
                        />
                      </a>
                    )}
                </div>
                <div>
                  <label htmlFor="logo" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Logo}</span>
                  </label>
                  <input
                    className="file"
                    type="file"
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="name"
                    id="logo"
                    onChange={handlePitchLogo}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label>Banner Image*</label>
                  {form?.banner?.secure_url !== undefined &&
                    form?.banner?.secure_url !== "" && (
                      <a
                        target="_blank"
                        href={form?.banner.secure_url}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          title="view Previous Banner Image"
                          style={{
                            height: "30px",
                            width: "30px",
                          }}
                          src="/view.png"
                          onMouseEnter={() => setShowPreviousFile(true)}
                          onMouseLeave={() => setShowPreviousFile(false)}
                        />
                      </a>
                    )}
                </div>
                <div>
                  <label htmlFor="Banner" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Banner}</span>
                  </label>
                  <input
                    className="file"
                    id="Banner"
                    type="file"
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="name"
                    onChange={handleBannerPic}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
          )}

          {value == 5 && (
            <div className="pitchForm">
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label>Pitch Docs/Business Plan*</label>
                  {form?.pitch?.secure_url !== undefined &&
                    form?.pitch?.secure_url !== "" && (
                      <a
                        target="_blank"
                        href={form?.pitch.secure_url}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          title="view Previous Business Plan"
                          style={{
                            height: "30px",
                            width: "30px",
                          }}
                          src="/view.png"
                          onMouseEnter={() => setShowPreviousFile(true)}
                          onMouseLeave={() => setShowPreviousFile(false)}
                        />
                      </a>
                    )}
                </div>
                <div>
                  <label htmlFor="Business" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Business}</span>
                  </label>
                  <input
                    className="file"
                    id="Business"
                    type="file"
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="name"
                    onChange={handlePitchBusiness}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label>Financials*</label>
                  {form?.financials?.secure_url !== undefined &&
                    form?.financials?.secure_url !== "" && (
                      <a
                        target="_blank"
                        href={form?.financials.secure_url}
                        style={{ display: "inline-block" }}
                      >
                        <img
                          title="view Previous Financials"
                          style={{
                            height: "30px",
                            width: "30px",
                          }}
                          src="/view.png"
                          onMouseEnter={() => setShowPreviousFile(true)}
                          onMouseLeave={() => setShowPreviousFile(false)}
                        />
                      </a>
                    )}
                </div>
                <div>
                  <label htmlFor="Financials" className="file">
                    <CloudUploadIcon />
                    <span className="fileName">{Financial}</span>
                  </label>
                  <input
                    className="file"
                    id="Financials"
                    type="file"
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    name="name"
                    onChange={handlePitchFinancials}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
          )}
          {value == 6 && (
            <div className="pitchForm">
              <div className="pitchformFields">
                <div>
                  <label>Heading*</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="heading"
                    value={form?.heading}
                    onChange={handleChanges}
                    placeholder="Enter heading to show pitch"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>People needed ?*</label>
                  {form.hiringPositions.length > 0 && (
                    <div className="listedTeam">
                      {form.hiringPositions.map((t, i) => (
                        <div className="singleMember">
                          <div>{t}</div>
                          <div
                            onClick={(e) => {
                              setForm((prev) => ({
                                ...prev,
                                hiringPositions: form.hiringPositions.filter(
                                  (f, j) => i !== j
                                ),
                                changeStatus: "change",
                              }));
                            }}
                          >
                            <CloseIcon className="deleteMember" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <select
                    name="hiringPositions"
                    // value={form?.hiringPositions}
                    onChange={(e) => {
                      if (!form.hiringPositions.includes(e.target.value)) {
                        setForm((prev) => ({
                          ...form,
                          hiringPositions: [
                            ...form.hiringPositions,
                            e.target.value,
                          ],
                          changeStatus: "change",
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {itPositions.map((h) => (
                      <option value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pitchformFields">
                <div>
                  <label>Description*</label>
                </div>
                <div>
                  <textarea
                    type="text"
                    name="description"
                    value={form?.description}
                    onChange={handleChanges}
                    rows={10}
                    cols={80}
                  ></textarea>
                </div>
              </div>
              <div>
                <div>
                  <label>Tags*</label>
                </div>
                <div>
                  {tags.length > 0 && (
                    <div className="listedTeam">
                      {tags.map((t, i) => (
                        <div className="singleMember">
                          <div>{t}</div>
                          <div
                            onClick={(e) => {
                              setTags(tags.filter((f, j) => i !== j));
                              setForm((prev) => ({
                                ...prev,
                                changeStatus: "change",
                              }));
                            }}
                          >
                            <CloseIcon className="deleteMember" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="tags">
                  <div>
                    <input
                      type="text"
                      name="tags"
                      value={form?.tags}
                      onChange={handleChanges}
                      placeholder="Enter tags for pitch *"
                    />
                  </div>
                  <div
                    className="addtags"
                    onClick={() => {
                      if (form.tags !== "") {
                        setTags((prev) => [...prev, form.tags]);
                        setForm((prev) => ({
                          ...prev,
                          changeStatus: "change",
                          tags: "",
                        }));
                      }
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
              </div>
              {/* <div>
                <div>
                  <label>Do you want pich hide/show after pitch go live?</label>
                </div>
                <div>
                  <select
                    name="pitchRequiredStatus"
                    value={form?.pitchRequiredStatus}
                    onChange={handleChanges}
                  >
                    <option value="">Select</option>
                    <option value="hide">Hide</option>
                    <option value="show">Show</option>
                  </select>
                </div>
              </div> */}
            </div>
          )}

          {value == 6 ? (
            <div className="pitchSubmit">
              <button
                type="submit"
                onClick={addPitchData}
                disabled={
                  areValue1FieldsEmpty() ||
                  areValue2FieldsEmpty() ||
                  areValue3FieldsEmpty() ||
                  areValue4FieldsEmpty() ||
                  areValue5FieldsEmpty() ||
                  areValue6FieldsEmpty()
                }
              >
                {id == '' ? 'Create pitch' : 'Update Pitch'}
              </button>
            </div>
          ) : (
            <div className="pitchSubmit">
              <button onClick={handleNext} disabled={isNextButtonDisabled()}>
                Next
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPitch;
