import React, { useState } from "react";
import "./UserDetails.css";
import { domain_subdomain, allskills } from "../../Utils";
import { Divider } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navigate, useNavigate } from "react-router-dom";
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import RoomPreferencesOutlinedIcon from '@mui/icons-material/RoomPreferencesOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined';

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
    iconClass:<RocketLaunchOutlinedIcon />,
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
    iconClass:  <SpeedOutlinedIcon />,
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

const domainOptions = Object.keys(domain_subdomain);
const skillsOptions = allskills;

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

const UserDetails = () => {
  const navigate = useNavigate()
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

  const handleSubmit = () => {
    const formData = {
      role,
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
    };
    console.log(formData);
    navigate("/login");
  };

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
              <label htmlFor="domainSelect">Select Domain:</label>
              <select
                id="domainSelect"
                value={newDomain}
                onChange={(e) => {

                  setNewDomain(e.target.value)
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
                  setNewSkill(e.target.value)
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
                  setFee('')
                  setSelectedDate('')
                  setSelectedTime('')
                  setSelectedProfile('')
                  setSelectedOneToOne('')
                  setSelectedBecomePlatform(e.target.value)
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
        <div className="step3-content">
          <h1>Profile</h1>
        </div>
      )}


      

      <div className="steps-button-container">
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
