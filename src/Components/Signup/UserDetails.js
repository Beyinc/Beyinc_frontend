import React, { useEffect, useState } from "react";
import "./UserDetails.css";
import {
  domain_subdomain,
  allskills,
  itPositions,
  convertToDate,
} from "../../Utils";
import { Autocomplete, Button, Divider, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navigate, useNavigate } from "react-router-dom";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import RoomPreferencesOutlinedIcon from "@mui/icons-material/RoomPreferencesOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { ApiServices } from "../../Services/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../redux/AuthReducers/AuthReducer";
import { ToastColors } from "../Toast/ToastColors";

const investorTypes = [
  {
    title: "Individual/Entrepreneur",
    description:
      "Already started your entrepreneurial journey as an idea or newly established business",
    iconClass: <EmojiObjectsOutlinedIcon />,
  },
  {
    title: "Startup",
    description:
      "A company in the early stages of development and looking to scale.",
    iconClass: <RocketLaunchOutlinedIcon />,
  },
  {
    title: "Mentor",
    description:
      "A person who shares their knowledge and experience to guide and support others.",
    iconClass: <SchoolOutlinedIcon />,
  },
  {
    title: "Incubator",
    description:
      "An organization that provides startups with workspace, mentorship, and resources.",
    iconClass: <RoomPreferencesOutlinedIcon />,
  },
  {
    title: "Accelerator",
    description:
      "A program that helps startups grow rapidly through mentorship, funding, and connections.",
    iconClass: <SpeedOutlinedIcon />,
  },
  {
    title: "Individual Investor",
    description: "An individual who invests their own money in companies.",
    iconClass: <AccountBalanceOutlinedIcon />,
  },
  {
    title: "Institutional Investor",
    description:
      "An organization that invests money on behalf of others, such as pension funds or insurance companies.",
    iconClass: <ApartmentOutlinedIcon />,
  },
  {
    title: "Trade Bodies",
    description:
      "Organizations that represent the interests of businesses in a particular sector.",
    iconClass: <HandshakeOutlinedIcon />,
  },
  {
    title: "Government Body",
    description:
      "A department or agency of the government that supports startups.",
    iconClass: <GavelOutlinedIcon />,
  },
  {
    title: "Corporate",
    description: "A large company that invests in or partners with startups.",
    iconClass: <CorporateFareOutlinedIcon />,
  },
  {
    title: "Technology Partner",
    description: "A company that provides technology or services to startups.",
    iconClass: <LaptopMacOutlinedIcon />,
  },
];
const budgets = [
  "0-12 Lakh",
  "13-25 Lakh",
  "25-50 Lakh",
  "50 Lakh- 1 cr",
  "1-5 cr",
  "Above 5 cr",
];

const domainOptions = Object.keys(domain_subdomain);
const skillsOptions = allskills;

const startupStage = ["Idea Stage", "Prototype", "MVP", "Revenue", "Scaing"];

const Stepper = ({ currentStep }) => {
  return (
    <div className="stepper-container">
      <div className="stepper">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
        <div className={`divider ${currentStep >= 2 ? "filled" : ""}`}></div>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
        <div className={`divider ${currentStep >= 3 ? "filled" : ""}`}></div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
      </div>
      <div className="stepper-step">
        <div>step</div>
        <div>step</div>
        <div>step</div>
      </div>
      <div className="stepper-content">
        <div>Details</div>
        <div>Additional Information</div>
        <div>Profile</div>
      </div>
    </div>
  );
};
const UploadProfile = ({ step3Data, setStep3Data, isCompany, label }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setStep3Data((prev) => ({
        ...prev,
        [e.target.name]: { name: file?.name, data: reader.result },
      }));
    };
  };
  return (
    <div className="upload-buttons-container">
      <Button variant="outlined">
        <label
          htmlFor="profile"
          style={{ cursor: "pointer" }}
          className="resume"
        >
          <CloudUploadIcon />
          <span className="fileName">
            {step3Data?.profile?.name ||
              (label
                ? "Upload " + label
                : isCompany
                ? "Upload Company Logo"
                : "Upload profile picture")}
          </span>
        </label>
        <input
          type="file"
          id="profile"
          className="resume"
          name="profile"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </Button>
      <Button variant="outlined">
        <label
          htmlFor="banner"
          style={{ cursor: "pointer" }}
          className="resume"
        >
          <CloudUploadIcon />
          <span className="fileName">
            {step3Data?.banner?.name || "Upload banner picture"}
          </span>
        </label>
        <input
          type="file"
          id="banner"
          className="resume"
          name="banner"
          onChange={handleUpload}
          style={{ display: "none" }}
        />{" "}
      </Button>
    </div>
  );
};
const UploadFile = ({ step3Data, setStep3Data }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setStep3Data((prev) => ({
        ...prev,
        [e.target.name]: { name: file?.name, data: reader.result },
      }));
    };
  };
  return (
    <div className="upload-buttons-container">
      <Button variant="outlined">
        <label
          htmlFor="vacancyFile"
          style={{ cursor: "pointer" }}
          className="resume"
        >
          <CloudUploadIcon />
          <span className="fileName">
            {step3Data?.vacancyFile?.name || "Upload file"}
          </span>
        </label>
        <input
          type="file"
          id="vacancyFile"
          className="resume"
          name="vacancyFile"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </Button>
    </div>
  );
};
const AboutStartup = ({ step3Data, setStep3Data }) => {
  return (
    <>
      {" "}
      <div className="primary-dropdown">
        <div>
          <label htmlFor="investorTypes">Stage of startup</label>
          <select
            id="investorTypes"
            onChange={(e) =>
              setStep3Data((p) => ({
                ...p,
                startupStage: e.target.value,
              }))
            }
            value={step3Data?.startupStage}
          >
            <option value="">Select an option</option>
            {startupStage.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <h2>When did the startup start?</h2>
        <div>
          <DatePicker
            onChange={(e) => setStep3Data((p) => ({ ...p, startupDate: e }))}
            value={step3Data?.startupDate}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select date"
          />
        </div>
      </div>
      <div>
        <h2>Total customers till date</h2>
        <input
          type="number"
          onChange={(e) =>
            setStep3Data((p) => ({
              ...p,
              total_customers: e.target.value,
            }))
          }
          value={step3Data?.total_customers}
        />
      </div>
      <div>
        <h2>Annual turnover</h2>
        <input
          type="text"
          onChange={(e) =>
            setStep3Data((p) => ({ ...p, turnover: e.target.value }))
          }
          value={step3Data?.turnover}
        />
      </div>
      <div>
        <h2>Is company registered?</h2>
        <p>
          <input
            type="radio"
            name="companyRegistered"
            value="yes"
            checked={step3Data?.isStartupRegistered === "yes"}
            onChange={(e) =>
              setStep3Data((p) => ({
                ...p,
                isStartupRegistered: e.target.value,
              }))
            }
          />
          Yes
        </p>
        <p>
          <input
            type="radio"
            name="companyRegistered"
            value="no"
            checked={step3Data?.isStartupRegistered === "no"}
            onChange={(e) =>
              setStep3Data((p) => ({
                ...p,
                isStartupRegistered: e.target.value,
              }))
            }
          />
          No
        </p>
      </div>
      {step3Data?.isStartupRegistered === "yes" ? (
        <div>
          <h2>Company CIN</h2>
          <input
            type="text"
            onChange={(e) =>
              setStep3Data((p) => ({
                ...p,
                startupCIN: e.target.value,
              }))
            }
            value={step3Data?.startupCIN}
          />
        </div>
      ) : (
        ""
      )}
      <div className="domain-selection">
        <h2>Select Domains of the startup</h2>
        <div className="dropdown-container">
          <select
            id="domainSelect"
            value={step3Data?.startupDomain}
            onChange={(e) => {
              setStep3Data((p) => ({
                ...p,
                startupDomain: [
                  ...(step3Data?.startupDomain ? step3Data?.startupDomain : []),
                  e.target.value,
                ],
              }));
            }}
          >
            <option value="">Select a domain</option>
            {domainOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          {step3Data?.startupDomain?.length > 0 && (
            <div className="selected-domains">
              {step3Data?.startupDomain.map((domain) => (
                <div key={domain} className="selected-domain">
                  <span>{domain}</span>
                  <button
                    className="domain-delete-button"
                    onClick={() =>
                      setStep3Data((p) => ({
                        ...p,
                        startupDomain: [
                          ...(step3Data?.startupDomain
                            ? step3Data?.startupDomain
                            : []
                          ).filter((d) => d !== domain),
                        ],
                      }))
                    }
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <h2>Location</h2>
        <input
          type="text"
          onChange={(e) =>
            setStep3Data((p) => ({ ...p, location: e.target.value }))
          }
          value={step3Data?.location}
        />
      </div>
    </>
  );
};

const UserDetails = () => {
  const navigate = useNavigate();
  // Step 1 state variables
  const [role, setRole] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDropdownPrimary, setSelectedDropdownPrimary] = useState("");
  const [selectedDropdownSecondary, setSelectedDropdownSecondary] =
    useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  // Step 2 state variables
  const [selectedBecomePlatform, setSelectedBecomePlatform] = useState("");
  const [fee, setFee] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedOneToOne, setSelectedOneToOne] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  //step3
  const [step3Data, setStep3Data] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [experienceDetails, setExperience] = useState({
    company: "",
    designation: "",
    year: "",
    start: "",
    end: "",
  });
  const [editingExperienceId, seteditingExperienceId] = useState("");
  const [totalExperienceData, setTotalExperienceData] = useState([]);
  const [totalEducationData, setTotalEducationData] = useState([]);
  const [editingEducationId, seteditingEducationId] = useState("");
  const [EducationDetails, setEducationDetails] = useState({
    year: "",
    grade: "",
    college: "",
    Edstart: "",
    Edend: "",
  });
  const [universities, setUniversities] = useState([]);
  const [collegeQuery, setCollegeQuery] = useState("");
  const handleBoxSelect = (boxType) => {
    setRole(boxType);
  };

  const handleDropdownPrimary = (event) => {
    setSelectedDropdownPrimary(event.target.value);
  };
  const handleDropdownSecondary = (event) => {
    setSelectedDropdownSecondary(event.target.value);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked && selectedTypes.length < 5) {
      setSelectedTypes([...selectedTypes, value]);
    } else if (!checked) {
      setSelectedTypes(selectedTypes.filter((type) => type !== value));
    }
  };

  const handleDomainSelect = (event) => {
    const selectedDomain = event.target.value;
    if (
      selectedDomains.length < 5 &&
      !selectedDomains.includes(selectedDomain)
    ) {
      setSelectedDomains([...selectedDomains, selectedDomain]);
    }
  };

  const handleRemoveDomain = (domainToRemove) => {
    setSelectedDomains(
      selectedDomains.filter((domain) => domain !== domainToRemove)
    );
  };

  const handleSkillSelect = (event) => {
    const selectedSkill = event.target.value;
    if (selectedSkills.length < 5 && !selectedSkills.includes(selectedSkill)) {
      setSelectedSkills([...selectedSkills, selectedSkill]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const dispatch = useDispatch();
  const handleSubmit = async (e, isDraft) => {
    const formData = {
      role,
      experienceDetails: totalExperienceData,
      educationDetails: totalEducationData,
      selectedDropdownPrimary,
      selectedDropdownSecondary,
      selectedTypes,
      selectedDomains,
      skills: selectedSkills,
      selectedBecomePlatform,
      fee,
      selectedDate,
      selectedTime,
      selectedProfile,
      selectedOneToOne,
      isDraft,
      totalExperienceData,
      totalEducationData,
    };

    try {
      await ApiServices.editUserFirstTime({
        ...formData,
        step3Data,
      });
      dispatch(
        setToast({
          message: "Profile updated successfully",
          bgColor: ToastColors.success,
          visible: "yes",
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(
        setToast({
          message:
            "Some error occured check if all inputs are filled and try again later",
          bgColor: ToastColors.failure,
          visible: "yes",
        })
      );
    }
  };
  const handleChange = (e) => {
    setExperience((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
      seteditingExperienceId("");
      document.getElementsByTagName("body")[0].style.overflowY = "scroll";
    }
    setExperience({
      company: "",
      designation: "",
      year: "",
      start: "",
      end: "",
    });
  };

  const handleEducationButtonClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.getElementsByTagName("body")[0].style.overflowY = "hidden";
  };

  const handleEducationChange = (e, isCollege) => {
    setEducationDetails((prev) => ({
      ...prev,
      [isCollege ? "college" : e.target.name]: isCollege
        ? universities[e.target.getAttribute("data-option-index")]?.name
        : e.target.value,
    }));
  };

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
  const fillInputs = async () => {
    const res = await ApiServices.getProfile();
    const {
      role,
      experienceDetails,
      educationDetails,
      selectedDropdownPrimary,
      selectedDropdownSecondary,
      selectedTypes,
      selectedDomains,
      skills,
      selectedBecomePlatform,
      fee,
      selectedDate,
      selectedTime,
      selectedProfile,
      selectedOneToOne,
      totalExperienceData,
      totalEducationData,
    } = res.data;
    setStep3Data(res.data.role_details ? res.data.role_details : {});
    setRole(role);
    setExperience(experienceDetails);
    setEducationDetails(educationDetails);
    setSelectedDropdownPrimary(selectedDropdownPrimary);
    setSelectedTypes(selectedTypes ? selectedTypes : []);
    setSelectedDropdownSecondary(selectedDropdownSecondary);
    setSelectedBecomePlatform(selectedBecomePlatform);
    setSelectedSkills(skills ? skills : []);
    setSelectedOneToOne(selectedOneToOne);
    setSelectedDomains(selectedDomains ? selectedDomains : []);
    setFee(fee);
    setSelectedTime(selectedTime);
    setSelectedDate(selectedDate);
    setSelectedProfile(selectedProfile);
    setTotalExperienceData(totalExperienceData ? totalExperienceData : []);
    setTotalEducationData(totalEducationData ? totalEducationData : []);
  };
  useEffect(() => {
    fillInputs();
  }, []);

  return (
    <main className="userDetails-container">
      <Stepper currentStep={currentStep} />
      {/* step-1 */}
      {currentStep === 1 && (
        <div>
          <div className="userDetails-role-container">
            <h1>Tell Us Who You Are?</h1>
            <h4>Select one of these</h4>
            <div className="investor-types">
              {investorTypes.map((type) => (
                <div
                  key={type.title}
                  className={`investor-type ${
                    role === type.title ? "selected-box" : ""
                  }`}
                  onClick={() => handleBoxSelect(type.title)}
                >
                  <div>
                    <span className="gradient-icon">
                      {/* <i className={type.iconClass}></i> */}
                      <span>{type.iconClass}</span>
                    </span>
                  </div>
                  <div>
                    <h2>{type.title}</h2>
                    <p>{type.description}</p>
                  </div>
                  {/* {selectedBox === type.title && (
                <i className="fas fa-check tick-icon"></i>
              )} */}
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div className="userDetails-primary-container">
            <h1>Use our platform as</h1>
            <div className="primary-dropdown">
              <div>
                <label htmlFor="investorTypes">Primary *</label>
                <select
                  id="investorTypes"
                  value={selectedDropdownPrimary}
                  onChange={handleDropdownPrimary}
                >
                  <option value="">Select an option</option>
                  {investorTypes.map((type) => (
                    <option key={type.title} value={type.title}>
                      {type.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="investorTypes">Secondary (optional)</label>
                <select
                  id="investorTypes"
                  value={selectedDropdownSecondary}
                  onChange={handleDropdownSecondary}
                >
                  <option value="">Select an option</option>
                  {investorTypes.map((type) => (
                    <option key={type.title} value={type.title}>
                      {type.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Divider />

          <div className="userDetails-checkbox-container">
            <h1>Follow others and see relevant post </h1>
            <label>
              You are interested in...*
              <span
                style={{
                  fontSize: "10px",
                  color: "gray",
                  marginLeft: "10px",
                  marginTop: "5px",
                }}
              >
                (maximum 5 selections)
              </span>
            </label>
            <div className="checkbox-container">
              {investorTypes.map((type) => (
                <div key={type.title} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={type.title}
                    value={type.title}
                    checked={selectedTypes.includes(type.title)}
                    onChange={handleCheckboxChange}
                  />
                  <p className="checkbox-content" htmlFor={type.title}>
                    {type.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div className="domain-selection">
            <h1>
              Select Interested Domains*
              <span
                style={{
                  fontSize: "10px",
                  color: "gray",
                  marginLeft: "10px",
                  marginTop: "5px",
                }}
              >
                (maximum 5 domains)
              </span>
            </h1>
            <div className="dropdown-container">
              <select
                id="domainSelect"
                value={newDomain}
                onChange={(e) => {
                  setNewDomain(e.target.value);
                  setSelectedDomains([...selectedDomains, e.target.value]);

                  setNewDomain("");
                }}
              >
                <option value="">Select a domain</option>
                {domainOptions.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              {selectedDomains.length > 0 && (
                <div className="selected-domains">
                  {selectedDomains.map((domain) => (
                    <div key={domain} className="selected-domain">
                      <span>{domain}</span>
                      <button
                        className="domain-delete-button"
                        onClick={() => handleRemoveDomain(domain)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Divider />

          <div className="skills-selection">
            <h1 className="heading">
              Select Skills*{" "}
              <span
                style={{
                  fontSize: "10px",
                  color: "gray",
                  marginLeft: "10px",
                  marginTop: "5px",
                }}
              >
                (maximum 5 skills)
              </span>
            </h1>
            <div className="dropdown-container">
              <label htmlFor="skillSelect">Select Skill:</label>
              <select
                id="skillSelect"
                value={newSkill}
                onChange={(e) => {
                  setNewSkill(e.target.value);
                  setSelectedSkills([...selectedSkills, e.target.value]);
                  setNewSkill("");
                }}
              >
                <option value="">Select a skill</option>
                {skillsOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {selectedSkills.length > 0 && (
                <div className="selected-skills">
                  {selectedSkills.map((skill) => (
                    <div key={skill} className="selected-skill">
                      <span>{skill}</span>
                      <button
                        className="domain-delete-button"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* step-2 */}
      {currentStep === 2 && (
        <div className="step2-content">
          <h1>Additional Information</h1>
          <div>
            <h2>Want to become on this platform</h2>
            <p>
              <input
                type="radio"
                name="becomePlatform"
                value="Cofounder"
                checked={selectedBecomePlatform === "Cofounder"}
                onChange={(e) => setSelectedBecomePlatform(e.target.value)}
              />
              Cofounder
            </p>
            <p>
              <input
                type="radio"
                name="becomePlatform"
                value="Mentor"
                checked={selectedBecomePlatform === "Mentor"}
                onChange={(e) => setSelectedBecomePlatform(e.target.value)}
              />
              Mentor
            </p>
            <p>
              <input
                type="radio"
                name="becomePlatform"
                value="Investor"
                checked={selectedBecomePlatform === "Investor"}
                onChange={(e) => setSelectedBecomePlatform(e.target.value)}
              />
              Investor
            </p>
            <p>
              <input
                type="radio"
                name="becomePlatform"
                value="Not Interested"
                checked={selectedBecomePlatform === "Not Interested"}
                onChange={(e) => {
                  setFee("");
                  setSelectedDate("");
                  setSelectedTime("");
                  setSelectedProfile("");
                  setSelectedOneToOne("");
                  setSelectedBecomePlatform(e.target.value);
                }}
              />
              Not Interested
            </p>
          </div>

          {/* If yes, select approx. price per minute */}
          {selectedBecomePlatform !== "Not Interested" && (
            <div>
              <h2>
                Select the approx. price (Rs.) per minute for each session
              </h2>
              <input
                type="number"
                min={0}
                max={1000}
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
          )}

          {/* If yes, time availability */}
          <div>
            {selectedBecomePlatform !== "Not Interested" && (
              <div>
                <h2>Time availability</h2>
                <div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select date"
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* If yes, make profile same as */}
          {selectedBecomePlatform !== "Not Interested" && (
            <div>
              <h2>Make profile same as</h2>
              <p>
                <input
                  type="radio"
                  name="profileSameAs"
                  value="Primary"
                  checked={selectedProfile === "Primary"}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                />
                Primary
              </p>
              <p>
                <input
                  type="radio"
                  name="profileSameAs"
                  value="Secondary"
                  checked={selectedProfile === "Secondary"}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                />
                Secondary
              </p>
            </div>
          )}

          {/* Want to have one-to-one session */}
          {selectedBecomePlatform !== "Not Interested" && (
            <div>
              <h2>Want to have one-to-one session with</h2>
              <p>
                <input
                  type="radio"
                  name="oneToOneSession"
                  value="Cofounder"
                  checked={selectedOneToOne === "Cofounder"}
                  onChange={(e) => setSelectedOneToOne(e.target.value)}
                />
                Cofounder
              </p>
              <p>
                <input
                  type="radio"
                  name="oneToOneSession"
                  value="Mentor"
                  checked={selectedOneToOne === "Mentor"}
                  onChange={(e) => setSelectedOneToOne(e.target.value)}
                />
                Mentor
              </p>
              <p>
                <input
                  type="radio"
                  name="oneToOneSession"
                  value="Investor"
                  checked={selectedOneToOne === "Investor"}
                  onChange={(e) => setSelectedOneToOne(e.target.value)}
                />
                Investor
              </p>
              <p>
                <input
                  type="radio"
                  name="oneToOneSession"
                  value="Not Interested"
                  checked={selectedOneToOne === "Not Interested"}
                  onChange={(e) => setSelectedOneToOne(e.target.value)}
                />
                Not Interested
              </p>
            </div>
          )}
        </div>
      )}

      {/* step-3 */}
      {currentStep === 3 && (
        <div className="step2-content">
          <h1>Profile</h1>
          {role === "Individual/Entrepreneur" ? (
            <div>
              <UploadProfile
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <h2>Do you have your own startup?</h2>
              <p>
                <input
                  type="radio"
                  name="haveStartup"
                  value="yes"
                  checked={step3Data?.haveStartup === "yes"}
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, haveStartup: e.target.value }))
                  }
                />
                Yes
              </p>
              <p>
                <input
                  type="radio"
                  name="haveStartup"
                  value="no"
                  checked={step3Data?.haveStartup === "no"}
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, haveStartup: e.target.value }))
                  }
                />
                No
              </p>
              {step3Data?.haveStartup === "yes" && (
                <AboutStartup
                  step3Data={step3Data}
                  setStep3Data={setStep3Data}
                />
              )}
              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              {/* <div>
                <h2>Experience</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, experience: e.target.value }))
                  }
                  value={step3Data?.experience}
                />
              </div> */}

              <section className="EditProfile-Experience-Container">
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

                              setExperience({
                                company: "",
                                designation: "",
                                year: "",
                                start: "",
                                end: "",
                              });
                            }}
                          ></div>
                        </div>
                        <div className="exp-container">
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
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </>

                          <div>
                            <button
                              className="add-button"
                              onClick={addExperience}
                              disabled={
                                experienceDetails.company == "" ||
                                experienceDetails.designation == "" ||
                                experienceDetails.start == ""
                              }
                              // disabled={
                              //   (experienceDetails.start == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") ||
                              //   (experienceDetails.company == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") || (experienceDetails.workingStatus !== "Self Employed" && experienceDetails.startupName == '') ||
                              //   experienceDetails.designation == ""
                              // }
                            >
                              {editingExperienceId == "" ? "Add" : "Update"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              {totalExperienceData.length > 0 ? (
                totalExperienceData.map((te, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                    className="studies"
                  >
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
                        <div className="company">
                          <>{te.company}(Company)</>
                        </div>
                        <div className="designation">
                          {te.designation && (
                            <>
                              <b>Designation: </b>
                              {te.designation}
                            </>
                          )}
                        </div>

                        <div className="timeline">
                          <b>Date: </b>
                          {convertToDate(te.start)}-
                          {te.end === "" ? "Present" : convertToDate(te.end)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Add experience data </div>
              )}

              <div>
                <section className="EditProfile-Education-Container">
                  <div
                    className="Ed-details"
                    style={{ flexDirection: "column" }}
                  >
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
                                seteditingEducationId("");
                                setEducationDetails({
                                  year: "",
                                  grade: "",
                                  college: "",
                                  Edstart: "",
                                  Edend: "",
                                });
                              }}
                            ></div>
                          </div>

                          <div className="edu-container">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
                                    <option value="Inter">
                                      Inter/Equivalent
                                    </option>
                                    <option value="UG">
                                      UG (Btech, degree)
                                    </option>
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
                                        onChange={(e) =>
                                          handleEducationChange(e, true)
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            value={collegeQuery}
                                            onChange={hadnleCollegeQueryChange}
                                            label="College"
                                          />
                                        )}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="Input-Label">
                                  Start Date*
                                </label>
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
                    <div style={{ padding: "20px" }}>
                      {totalEducationData.length > 0 ? (
                        totalEducationData.map((te, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                            className="studies"
                          >
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
                                  {te.Edend === ""
                                    ? "Present"
                                    : convertToDate(te.Edend)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>Add education data </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, education: e.target.value }))
                  }
                  value={step3Data?.education}
                /> */}
              </div>

              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>
              <div>
                <h2>LinkedIn Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Startup" ? (
            <div>
              <UploadProfile
                isCompany={true}
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <h2>Type of startup?</h2>
              <p>
                <input
                  type="radio"
                  name="startupType"
                  value="Funded"
                  checked={step3Data?.typeStartup === "Funded"}
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, typeStartup: e.target.value }))
                  }
                />
                Funded
              </p>
              <p>
                <input
                  type="radio"
                  name="startupType"
                  value="Bootstrapped"
                  checked={step3Data?.typeStartup === "Bootstrapped"}
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, typeStartup: e.target.value }))
                  }
                />
                Bootstrapped
              </p>
              <AboutStartup setStep3Data={setStep3Data} step3Data={step3Data} />
              <div>
                <h2>Instagram Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, Instagram: e.target.value }))
                  }
                  value={step3Data?.Instagram}
                />
              </div>
              <div>
                <h2>Youtube Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, Youtube: e.target.value }))
                  }
                  value={step3Data?.Youtube}
                />
              </div>
              <div>
                <h2>LinkedIn Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Mentor" ? (
            <div>
              <UploadProfile
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <h2>Do you have your own startup?</h2>
              <p>
                <input
                  type="radio"
                  name="haveStartup"
                  value="yes"
                  checked={step3Data?.haveStartup === "yes"}
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, haveStartup: e.target.value }))
                  }
                />
                Yes
              </p>
              <p>
                <input
                  type="radio"
                  name="haveStartup"
                  value="no"
                  checked={step3Data?.haveStartup === "no"}
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, haveStartup: e.target.value }))
                  }
                />
                No
              </p>
              {step3Data?.haveStartup === "yes" && (
                <AboutStartup
                  step3Data={step3Data}
                  setStep3Data={setStep3Data}
                />
              )}
              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>

              <section className="EditProfile-Experience-Container">
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

                              setExperience({
                                company: "",
                                designation: "",
                                year: "",
                                start: "",
                                end: "",
                              });
                            }}
                          ></div>
                        </div>
                        <div className="exp-container">
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
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </>

                          <div>
                            <button
                              className="add-button"
                              onClick={addExperience}
                              disabled={
                                experienceDetails.company == "" ||
                                experienceDetails.designation == "" ||
                                experienceDetails.start == ""
                              }
                              // disabled={
                              //   (experienceDetails.start == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") ||
                              //   (experienceDetails.company == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") || (experienceDetails.workingStatus !== "Self Employed" && experienceDetails.startupName == '') ||
                              //   experienceDetails.designation == ""
                              // }
                            >
                              {editingExperienceId == "" ? "Add" : "Update"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              {totalExperienceData.length > 0 ? (
                totalExperienceData.map((te, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                    className="studies"
                  >
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
                        <div className="company">
                          <>{te.company}(Company)</>
                        </div>
                        <div className="designation">
                          {te.designation && (
                            <>
                              <b>Designation: </b>
                              {te.designation}
                            </>
                          )}
                        </div>

                        <div className="timeline">
                          <b>Date: </b>
                          {convertToDate(te.start)}-
                          {te.end === "" ? "Present" : convertToDate(te.end)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Add experience data </div>
              )}

              {/* <div>
                <h2>Experience</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, experience: e.target.value }))
                  }
                  value={step3Data?.experience}
                />
              </div> */}
              <div>
                <h2>startupStage</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, education: e.target.value }))
                  }
                  value={step3Data?.education}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>
              <div>
                <h2>Success storoes about your mentorship</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      successStories: e.target.value,
                    }))
                  }
                  value={step3Data?.successStories}
                />
              </div>
              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Incubator" ? (
            <div>
              <UploadProfile
                isCompany={true}
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Incubator Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      incubator_name: e.target.value,
                    }))
                  }
                  value={step3Data?.incubator_name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div>
                <h2>Date of establishment</h2>
                <div>
                  <DatePicker
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        incubatorEstablishmentDate: e,
                      }))
                    }
                    value={step3Data?.incubatorEstablishmentDate}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select date"
                  />
                </div>
              </div>
              <div>
                <h2>Current Incubatees:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      currentIncubatees: e.target.value,
                    }))
                  }
                  value={step3Data?.currentIncubatees}
                />
              </div>
              <div>
                <h2>Program Duration:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      programDuration: e.target.value,
                    }))
                  }
                  value={step3Data?.programDuration}
                />
              </div>
              <div>
                <h2>Graduated Incubates:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      graduatedIncubatees: e.target.value,
                    }))
                  }
                  value={step3Data?.graduatedIncubatees}
                />
              </div>
              <div>
                <h2>Is govt funded?</h2>
                <p>
                  <input
                    type="radio"
                    name="GovtFunded"
                    value="yes"
                    checked={step3Data?.haveStartup === "yes"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        haveStartup: e.target.value,
                      }))
                    }
                  />
                  Yes
                </p>
                <p>
                  <input
                    type="radio"
                    name="GovtFunded"
                    value="no"
                    checked={step3Data?.haveStartup === "no"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        haveStartup: e.target.value,
                      }))
                    }
                  />
                  No
                </p>
              </div>
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.incubatorDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        incubatorDomain: [
                          ...(step3Data?.incubatorDomain
                            ? step3Data?.incubatorDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.incubatorDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.incubatorDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                incubatorDomain: [
                                  ...(step3Data?.incubatorDomain
                                    ? step3Data?.incubatorDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Stage of startup</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startupStage: e.target.value,
                      }))
                    }
                    value={step3Data?.startupStage}
                  >
                    <option value="">Select an option</option>
                    {startupStage.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>

              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>
              <div>
                <h2>Success storoes:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      successStories: e.target.value,
                    }))
                  }
                  value={step3Data?.successStories}
                />
              </div>
              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
              <div>
                <h2>Is vacancy avaliable?</h2>
                <p>
                  <input
                    type="radio"
                    name="vacancyAvaliable"
                    value="yes"
                    checked={step3Data?.isVacancyAvaliable === "yes"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        isVacancyAvaliable: e.target.value,
                      }))
                    }
                  />
                  Yes
                </p>
                <p>
                  <input
                    type="radio"
                    name="vacancyAvaliable"
                    value="no"
                    checked={step3Data?.isVacancyAvaliable === "no"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        isVacancyAvaliable: e.target.value,
                      }))
                    }
                  />
                  No
                </p>
              </div>
              {step3Data?.isVacancyAvaliable === "yes" ? (
                <>
                  {" "}
                  <div>
                    <h2>Description</h2>
                    <input
                      type="text"
                      onChange={(e) =>
                        setStep3Data((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      value={step3Data?.description}
                    />
                  </div>
                  <UploadFile
                    setStep3Data={setStep3Data}
                    step3Data={step3Data}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          ) : role === "Accelerator" ? (
            <div>
              <UploadProfile
                isCompany={true}
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Accelerator Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      incubator_name: e.target.value,
                    }))
                  }
                  value={step3Data?.incubator_name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div>
                <h2>Date of establishment</h2>
                <div>
                  <DatePicker
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        incubatorEstablishmentDate: e,
                      }))
                    }
                    value={step3Data?.incubatorEstablishmentDate}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select date"
                  />
                </div>
              </div>
              <div>
                <h2>Current Acceleratees:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      currentAcceleratees: e.target.value,
                    }))
                  }
                  value={step3Data?.currentAcceleratees}
                />
              </div>
              <div>
                <h2>Program Duration:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      programDuration: e.target.value,
                    }))
                  }
                  value={step3Data?.programDuration}
                />
              </div>
              <div>
                <h2>Graduated Incubates:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      graduatedIncubatees: e.target.value,
                    }))
                  }
                  value={step3Data?.graduatedIncubatees}
                />
              </div>
              <div>
                <h2>Is govt funded?</h2>
                <p>
                  <input
                    type="radio"
                    name="GovtFunded"
                    value="yes"
                    checked={step3Data?.haveStartup === "yes"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        haveStartup: e.target.value,
                      }))
                    }
                  />
                  Yes
                </p>
                <p>
                  <input
                    type="radio"
                    name="GovtFunded"
                    value="no"
                    checked={step3Data?.haveStartup === "no"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        haveStartup: e.target.value,
                      }))
                    }
                  />
                  No
                </p>
              </div>
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.incubatorDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        incubatorDomain: [
                          ...(step3Data?.incubatorDomain
                            ? step3Data?.incubatorDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.incubatorDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.incubatorDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                incubatorDomain: [
                                  ...(step3Data?.incubatorDomain
                                    ? step3Data?.incubatorDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Stage of startup</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startupStage: e.target.value,
                      }))
                    }
                    value={step3Data?.startupStage}
                  >
                    <option value="">Select an option</option>
                    {startupStage.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <h2>SEBI Registered?</h2>
                <p>
                  <input
                    type="radio"
                    name="SEBI"
                    value="yes"
                    checked={step3Data?.isSEBI === "yes"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        isSEBI: e.target.value,
                      }))
                    }
                  />
                  Yes
                </p>
                <p>
                  <input
                    type="radio"
                    name="SEBI"
                    value="no"
                    checked={step3Data?.isSEBI === "no"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        isSEBI: e.target.value,
                      }))
                    }
                  />
                  No
                </p>
              </div>
              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>

              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>
              <div>
                <h2>Success storoes:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      successStories: e.target.value,
                    }))
                  }
                  value={step3Data?.successStories}
                />
              </div>
              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
              <div>
                <h2>Is vacancy avaliable?</h2>
                <p>
                  <input
                    type="radio"
                    name="vacancyAvaliable"
                    value="yes"
                    checked={step3Data?.isVacancyAvaliable === "yes"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        isVacancyAvaliable: e.target.value,
                      }))
                    }
                  />
                  Yes
                </p>
                <p>
                  <input
                    type="radio"
                    name="vacancyAvaliable"
                    value="no"
                    checked={step3Data?.isVacancyAvaliable === "no"}
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        isVacancyAvaliable: e.target.value,
                      }))
                    }
                  />
                  No
                </p>
              </div>
              {step3Data?.isVacancyAvaliable === "yes" ? (
                <>
                  <div>
                    <h2>Description</h2>
                    <input
                      type="text"
                      onChange={(e) =>
                        setStep3Data((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      value={step3Data?.description}
                    />
                  </div>
                  <UploadFile
                    setStep3Data={setStep3Data}
                    step3Data={step3Data}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          ) : role === "Individual Investor" ? (
            <div>
              <UploadProfile
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      incubator_name: e.target.value,
                    }))
                  }
                  value={step3Data?.incubator_name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Select avaliable budget</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        budget: e.target.value,
                      }))
                    }
                    value={step3Data?.budget}
                  >
                    <option value="">Select an option</option>
                    {budgets.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <section className="EditProfile-Experience-Container">
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

                              setExperience({
                                company: "",
                                designation: "",
                                year: "",
                                start: "",
                                end: "",
                              });
                            }}
                          ></div>
                        </div>
                        <div className="exp-container">
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
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </>

                          <div>
                            <button
                              className="add-button"
                              onClick={addExperience}
                              disabled={
                                experienceDetails.company == "" ||
                                experienceDetails.designation == "" ||
                                experienceDetails.start == ""
                              }
                              // disabled={
                              //   (experienceDetails.start == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") ||
                              //   (experienceDetails.company == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") || (experienceDetails.workingStatus !== "Self Employed" && experienceDetails.startupName == '') ||
                              //   experienceDetails.designation == ""
                              // }
                            >
                              {editingExperienceId == "" ? "Add" : "Update"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              {totalExperienceData.length > 0 ? (
                totalExperienceData.map((te, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                    className="studies"
                  >
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
                        <div className="company">
                          <>{te.company}(Company)</>
                        </div>
                        <div className="designation">
                          {te.designation && (
                            <>
                              <b>Designation: </b>
                              {te.designation}
                            </>
                          )}
                        </div>

                        <div className="timeline">
                          <b>Date: </b>
                          {convertToDate(te.start)}-
                          {te.end === "" ? "Present" : convertToDate(te.end)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Add experience data </div>
              )}

              <div>
                <section className="EditProfile-Education-Container">
                  <div
                    className="Ed-details"
                    style={{ flexDirection: "column" }}
                  >
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
                                seteditingEducationId("");
                                setEducationDetails({
                                  year: "",
                                  grade: "",
                                  college: "",
                                  Edstart: "",
                                  Edend: "",
                                });
                              }}
                            ></div>
                          </div>

                          <div className="edu-container">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
                                    <option value="Inter">
                                      Inter/Equivalent
                                    </option>
                                    <option value="UG">
                                      UG (Btech, degree)
                                    </option>
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
                                        onChange={(e) =>
                                          handleEducationChange(e, true)
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            value={collegeQuery}
                                            onChange={hadnleCollegeQueryChange}
                                            label="College"
                                          />
                                        )}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="Input-Label">
                                  Start Date*
                                </label>
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
                    <div style={{ padding: "20px" }}>
                      {totalEducationData.length > 0 ? (
                        totalEducationData.map((te, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                            className="studies"
                          >
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
                                  {te.Edend === ""
                                    ? "Present"
                                    : convertToDate(te.Edend)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>Add education data </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, education: e.target.value }))
                  }
                  value={step3Data?.education}
                /> */}
              </div>
              {/* <div>
                <h2>Experience</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, experience: e.target.value }))
                  }
                  value={step3Data?.experience}
                />
              </div>
              <div>
                <h2>Education</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, education: e.target.value }))
                  }
                  value={step3Data?.education}
                />
              </div> */}
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.incubatorDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        incubatorDomain: [
                          ...(step3Data?.incubatorDomain
                            ? step3Data?.incubatorDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.incubatorDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.incubatorDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                incubatorDomain: [
                                  ...(step3Data?.incubatorDomain
                                    ? step3Data?.incubatorDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Stage of startup</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startupStage: e.target.value,
                      }))
                    }
                    value={step3Data?.startupStage}
                  >
                    <option value="">Select an option</option>
                    {startupStage.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>

              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>
              <div>
                <h2>Success Stories</h2>
                <div>
                  <h2>Startup Name:</h2>
                  <input
                    type="text"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startup_name: e.target.value,
                      }))
                    }
                    value={step3Data?.startup_name}
                  />
                </div>
                <div>
                  <h2>About Startup:</h2>
                  <input
                    type="text"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startup_about: e.target.value,
                      }))
                    }
                    value={step3Data?.startup_about}
                  />
                </div>{" "}
                <div>
                  <h2>Amount Funded:</h2>
                  <input
                    type="text"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startup_fund: e.target.value,
                      }))
                    }
                    value={step3Data?.startup_fund}
                  />
                </div>
              </div>
              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Institutional Investor" ? (
            <div>
              <UploadProfile
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      incubator_name: e.target.value,
                    }))
                  }
                  value={step3Data?.incubator_name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Select avaliable budget</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        budget: e.target.value,
                      }))
                    }
                    value={step3Data?.budget}
                  >
                    <option value="">Select an option</option>
                    {[
                      "0-25 Lakh",
                      "25-50 Lakh",
                      "50 Lakh- 1 cr",
                      "1-10 cr",
                      "Above 10 cr",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Select Investor Type</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        budget: e.target.value,
                      }))
                    }
                    value={step3Data?.budget}
                  >
                    <option value="">Select an option</option>
                    {[
                      "Angle Group",
                      "Priate Company",
                      "Venture Capital",
                      "Private Equity",
                      "Others",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <section className="EditProfile-Experience-Container">
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

                              setExperience({
                                company: "",
                                designation: "",
                                year: "",
                                start: "",
                                end: "",
                              });
                            }}
                          ></div>
                        </div>
                        <div className="exp-container">
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
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </>

                          <div>
                            <button
                              className="add-button"
                              onClick={addExperience}
                              disabled={
                                experienceDetails.company == "" ||
                                experienceDetails.designation == "" ||
                                experienceDetails.start == ""
                              }
                              // disabled={
                              //   (experienceDetails.start == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") ||
                              //   (experienceDetails.company == "" && experienceDetails.workingStatus !== "Self Employed" && role !== "Technology Partner") || (experienceDetails.workingStatus !== "Self Employed" && experienceDetails.startupName == '') ||
                              //   experienceDetails.designation == ""
                              // }
                            >
                              {editingExperienceId == "" ? "Add" : "Update"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
              {totalExperienceData.length > 0 ? (
                totalExperienceData.map((te, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                    className="studies"
                  >
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
                        <div className="company">
                          <>{te.company}(Company)</>
                        </div>
                        <div className="designation">
                          {te.designation && (
                            <>
                              <b>Designation: </b>
                              {te.designation}
                            </>
                          )}
                        </div>

                        <div className="timeline">
                          <b>Date: </b>
                          {convertToDate(te.start)}-
                          {te.end === "" ? "Present" : convertToDate(te.end)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Add experience data </div>
              )}

              <div>
                <section className="EditProfile-Education-Container">
                  <div
                    className="Ed-details"
                    style={{ flexDirection: "column" }}
                  >
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
                                seteditingEducationId("");
                                setEducationDetails({
                                  year: "",
                                  grade: "",
                                  college: "",
                                  Edstart: "",
                                  Edend: "",
                                });
                              }}
                            ></div>
                          </div>

                          <div className="edu-container">
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
                                    <option value="Inter">
                                      Inter/Equivalent
                                    </option>
                                    <option value="UG">
                                      UG (Btech, degree)
                                    </option>
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
                                        onChange={(e) =>
                                          handleEducationChange(e, true)
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            value={collegeQuery}
                                            onChange={hadnleCollegeQueryChange}
                                            label="College"
                                          />
                                        )}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="Input-Label">
                                  Start Date*
                                </label>
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
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
                    <div style={{ padding: "20px" }}>
                      {totalEducationData.length > 0 ? (
                        totalEducationData.map((te, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                            className="studies"
                          >
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
                                  {te.Edend === ""
                                    ? "Present"
                                    : convertToDate(te.Edend)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>Add education data </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, education: e.target.value }))
                  }
                  value={step3Data?.education}
                /> */}
              </div>
              {/* <div>
                <h2>Experience</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, experience: e.target.value }))
                  }
                  value={step3Data?.experience}
                />
              </div>
              <div>
                <h2>Education</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, education: e.target.value }))
                  }
                  value={step3Data?.education}
                />
              </div> */}
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.incubatorDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        incubatorDomain: [
                          ...(step3Data?.incubatorDomain
                            ? step3Data?.incubatorDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.incubatorDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.incubatorDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                incubatorDomain: [
                                  ...(step3Data?.incubatorDomain
                                    ? step3Data?.incubatorDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Stage of startup</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startupStage: e.target.value,
                      }))
                    }
                    value={step3Data?.startupStage}
                  >
                    <option value="">Select an option</option>
                    {startupStage.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>

              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>
              <div>
                <h2>Success Stories</h2>
                <div>
                  <h2>Startup Name:</h2>
                  <input
                    type="text"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startup_name: e.target.value,
                      }))
                    }
                    value={step3Data?.startup_name}
                  />
                </div>
                <div>
                  <h2>About Startup:</h2>
                  <input
                    type="text"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startup_about: e.target.value,
                      }))
                    }
                    value={step3Data?.startup_about}
                  />
                </div>{" "}
                <div>
                  <h2>Amount Funded:</h2>
                  <input
                    type="text"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startup_fund: e.target.value,
                      }))
                    }
                    value={step3Data?.startup_fund}
                  />
                </div>
              </div>
              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Government Body" ? (
            <div>
              <UploadProfile
                label={"Department Logo"}
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                  value={step3Data?.name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div>
                <h2>Department/Ministry :</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, department: e.target.value }))
                  }
                  value={step3Data?.department}
                />
              </div>
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.intrestedDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        intrestedDomain: [
                          ...(step3Data?.intrestedDomain
                            ? step3Data?.intrestedDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.intrestedDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.intrestedDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                intrestedDomain: [
                                  ...(step3Data?.intrestedDomain
                                    ? step3Data?.intrestedDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>
              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>

              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Corporate" ? (
            <div>
              <UploadProfile
                isCompany={true}
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      incubator_name: e.target.value,
                    }))
                  }
                  value={step3Data?.incubator_name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Stage of startup</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startupStage: e.target.value,
                      }))
                    }
                    value={step3Data?.startupStage}
                  >
                    <option value="">Select an option</option>
                    {startupStage.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.incubatorDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        incubatorDomain: [
                          ...(step3Data?.incubatorDomain
                            ? step3Data?.incubatorDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.incubatorDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.incubatorDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                incubatorDomain: [
                                  ...(step3Data?.incubatorDomain
                                    ? step3Data?.incubatorDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>
              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>

              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Trade Bodies" ? (
            <div>
              <UploadProfile
                label={"Logo"}
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      incubator_name: e.target.value,
                    }))
                  }
                  value={step3Data?.incubator_name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div>
                <h2>Trade:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, trade: e.target.value }))
                  }
                  value={step3Data?.trade}
                />
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Stage of startup</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startupStage: e.target.value,
                      }))
                    }
                    value={step3Data?.startupStage}
                  >
                    <option value="">Select an option</option>
                    {startupStage.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.incubatorDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        incubatorDomain: [
                          ...(step3Data?.incubatorDomain
                            ? step3Data?.incubatorDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.incubatorDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.incubatorDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                incubatorDomain: [
                                  ...(step3Data?.incubatorDomain
                                    ? step3Data?.incubatorDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>
              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>

              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : role === "Technology Partner" ? (
            <div>
              <UploadProfile
                label={"Logo"}
                setStep3Data={setStep3Data}
                step3Data={step3Data}
              />
              <div>
                <h2>Name:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      incubator_name: e.target.value,
                    }))
                  }
                  value={step3Data?.incubator_name}
                />
              </div>
              <div>
                <h2>About:</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, about: e.target.value }))
                  }
                  value={step3Data?.about}
                />
              </div>
              <div className="primary-dropdown">
                <div>
                  <label htmlFor="investorTypes">Stage of startup</label>
                  <select
                    id="investorTypes"
                    onChange={(e) =>
                      setStep3Data((p) => ({
                        ...p,
                        startupStage: e.target.value,
                      }))
                    }
                    value={step3Data?.startupStage}
                  >
                    <option value="">Select an option</option>
                    {startupStage.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Domains:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.incubatorDomain}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        incubatorDomain: [
                          ...(step3Data?.incubatorDomain
                            ? step3Data?.incubatorDomain
                            : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a domain</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.incubatorDomain?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.incubatorDomain.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                incubatorDomain: [
                                  ...(step3Data?.incubatorDomain
                                    ? step3Data?.incubatorDomain
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="domain-selection">
                <h2>Intrested Skills:</h2>
                <div className="dropdown-container">
                  <select
                    id="domainSelect"
                    value={step3Data?.skills}
                    onChange={(e) => {
                      setNewDomain(e.target.value);
                      setStep3Data((p) => ({
                        ...p,
                        skills: [
                          ...(step3Data?.skills ? step3Data?.skills : []),
                          e.target.value,
                        ],
                      }));
                      setNewDomain("");
                    }}
                  >
                    <option value="">Select a skill</option>
                    {skillsOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {step3Data?.skills?.length > 0 && (
                    <div className="selected-domains">
                      {step3Data?.skills.map((domain) => (
                        <div key={domain} className="selected-domain">
                          <span>{domain}</span>
                          <button
                            className="domain-delete-button"
                            onClick={() =>
                              setStep3Data((p) => ({
                                ...p,
                                skills: [
                                  ...(step3Data?.skills
                                    ? step3Data?.skills
                                    : []
                                  ).filter((d) => d !== domain),
                                ],
                              }))
                            }
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h2>POC details</h2>
              <div>
                <h2>Name</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_name: e.target.value }))
                  }
                  value={step3Data?.poc_name}
                />
              </div>
              <div>
                <h2>Designation</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({
                      ...p,
                      poc_designation: e.target.value,
                    }))
                  }
                  value={step3Data?.poc_designation}
                />
              </div>
              <div>
                <h2>Email</h2>
                <input
                  type="email"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_email: e.target.value }))
                  }
                  value={step3Data?.poc_email}
                />
              </div>
              <div>
                <h2>Mobile No.</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, poc_mobile: e.target.value }))
                  }
                  value={step3Data?.poc_mobile}
                />
              </div>
              <div>
                <h2>Website Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, website: e.target.value }))
                  }
                  value={step3Data?.website}
                />
              </div>
              <div>
                <h2>Location</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, location: e.target.value }))
                  }
                  value={step3Data?.location}
                />
              </div>

              <div>
                <h2>LinkedIn Link</h2>
                <input
                  aria-multiline={"true"}
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, linkedin: e.target.value }))
                  }
                  value={step3Data?.linkedin}
                />
              </div>
              <div>
                <h2>Twitter Link</h2>
                <input
                  type="text"
                  onChange={(e) =>
                    setStep3Data((p) => ({ ...p, twitter: e.target.value }))
                  }
                  value={step3Data?.twitter}
                />
              </div>
            </div>
          ) : (
            ""
          )}{" "}
          <div className="terms-of-use-containuer">
            <h2>Terms and Conditions</h2>
            <p>
              1) This website, the official platform of Beyinc Entrepreneurship
              Venture Pvt. Ltd., is designed to offer general information to
              visitors. The content and documents provided here serve as
              reference materials and are not intended to constitute legal
              documentation.
            </p>
            <p>
              2) BeyInc does not guarantee the accuracy or completeness of the
              information, text, graphics, links, or other elements found within
              the BeyInc web portal. Due to updates and corrections, the web
              content is subject to regular changes.
            </p>
            <p>
              3) The information on this website may contain links to content
              from non-governmental or private organizations, provided by BeyInc
              for your convenience. Clicking on these links redirects you away
              from the ‘BeyInc’ wesite, subjecting you to the privacy and
              security policies of the external website owners.
            </p>
            <p>
              4) BeyInc serves as a connectivity platform for stakeholders and
              is not liable for any idea copying, product infringement, or of
              any kind and not limited to monetary loss between connecting
              parties.
            </p>
            <p>
              5) These terms and conditions are governed by Indian laws and any
              dispute arising from them is subject to the jurisdiction of the
              courts of Chennai, India.
            </p>
            <p>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                name="terms"
                id="terms"
              />
              I Agree Terms & Conditions
            </p>
          </div>
        </div>
      )}

      <div className="steps-button-container">
        <button className="steps-button" onClick={(e) => handleSubmit(e, true)}>
          Save
        </button>
        <div>
          {currentStep > 1 && (
            <button className="steps-button" onClick={handlePrevStep}>
              Previous
            </button>
          )}
        </div>

        <div>
          {currentStep < 3 ? (
            <button className="steps-button" onClick={handleNextStep}>
              Next Step
            </button>
          ) : (
            <button className="steps-button" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserDetails;
