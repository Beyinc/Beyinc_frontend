import React, { useState } from "react";
import "./UserDetails.css";
import { domain_subdomain, allskills } from "../../Utils";
import { Divider } from "@mui/material";

const investorTypes = [
  {
    title: "Individual/Entrepreneur",
    description:
      "Already started your entrepreneurial journey as an idea or newly established business",
    iconClass: "fas fa-lightbulb",
  },
  {
    title: "Startup",
    description:
      "A company in the early stages of development and looking to scale.",
    iconClass: "fas fa-rocket",
  },
  {
    title: "Mentor",
    description:
      "A person who shares their knowledge and experience to guide and support others.",
    iconClass: "fas fa-user-tie",
  },
  {
    title: "Incubator",
    description:
      "An organization that provides startups with workspace, mentorship, and resources.",
    iconClass: "fas fa-building",
  },
  {
    title: "Accelerator",
    description:
      "A program that helps startups grow rapidly through mentorship, funding, and connections.",
    iconClass: "fas fa-fast-forward",
  },
  {
    title: "Individual Investor",
    description: "An individual who invests their own money in companies.",
    iconClass: "fas fa-money-bill-wave",
  },
  {
    title: "Institutional Investor",
    description:
      "An organization that invests money on behalf of others, such as pension funds or insurance companies.",
    iconClass: "fas fa-chart-line",
  },
  {
    title: "Trade Bodies",
    description:
      "Organizations that represent the interests of businesses in a particular sector.",
    iconClass: "fas fa-handshake",
  },
  {
    title: "Government Body",
    description:
      "A department or agency of the government that supports startups.",
    iconClass: "fas fa-gavel",
  },
  {
    title: "Corporate",
    description: "A large company that invests in or partners with startups.",
    iconClass: "fas fa-building",
  },
  {
    title: "Technology Partner",
    description: "A company that provides technology or services to startups.",
    iconClass: "fas fa-laptop",
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
        <div>Interest</div>
        <div>Profile</div>
      </div>
    </div>
  );
};

const UserDetails = () => {
  const [selectedBox, setSelectedBox] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDropdownPrimary, setSelectedDropdownPrimary] = useState("");
  const [selectedDropdownSecondary, setSelectedDropdownSecondary] =
    useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const handleBoxSelect = (boxType) => {
    setSelectedBox(boxType);
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

  return (
    <main className="userDetails-container">
      <Stepper currentStep={currentStep} />
      <div className="userDetails-role-container">
        <h1>Tell Us Who You Are?</h1>
        <h4>Select one of these</h4>
        <div className="investor-types">
          {investorTypes.map((type) => (
            <div
              key={type.title}
              className={`investor-type ${
                selectedBox === type.title ? "selected-box" : ""
              }`}
              onClick={() => handleBoxSelect(type.title)}
            >
              <div>
                <span className="gradient-icon">
                  <i className={type.iconClass}></i>
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
          Yor are interested in...*
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
            onChange={(e) => setNewDomain(e.target.value)}
            onBlur={() => {
              if (
                newDomain &&
                selectedDomains.length < 5 &&
                !selectedDomains.includes(newDomain)
              ) {
                setSelectedDomains([...selectedDomains, newDomain]);
                setNewDomain("");
              }
            }}
          >
            <option value="">Select a domain</option>
            {domainOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          <button style={{ marginLeft: "10px" }}>Add</button>
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
            onChange={(e) => setNewSkill(e.target.value)}
            onBlur={() => {
              if (
                newSkill &&
                selectedSkills.length < 5 &&
                !selectedSkills.includes(newSkill)
              ) {
                setSelectedSkills([...selectedSkills, newSkill]);
                setNewSkill("");
              }
            }}
          >
            <option value="">Select a skill</option>
            {skillsOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
          <button style={{ marginLeft: "10px" }}>Add</button>
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
            <button className="steps-button">Submit</button>
          )}
        </div>
      </div>
    </main>
  );
};

export default UserDetails;
