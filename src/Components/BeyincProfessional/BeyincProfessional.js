import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Button, Typography } from '@mui/material';
import {
  TextField,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Grid,
  Button,
  List,
  ListItem,
  Collapse,
} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import { stages, allskills, domain_subdomain } from "../../Utils";
import { ApiServices } from "../../Services/ApiServices";
const BeyincProfessional = () => {
  // const [selectedRole, setSelectedRole] = useState("");
  const [openIndustries, setOpenIndustries] = useState(false);
  const [openCategories, setOpenCategories] = useState({});
  const [openStages, setOpenStages] = useState(false);
  const [formValues, setFormValues] = useState({
    expertise: [],
    industries: [],
    stages: [],
    beyincProfile: "",
    investmentRange: "",
  });

  // // Function to handle radio button changes
  // const handleRoleChange = (e) => {
  //   setSelectedRole(e.target.value);
  // };

  const dropdownRef =  useRef(null);

  const navigate = useNavigate();
  const handleMultiSelectChange = (event, name) => {
    const selectedValues = event.target.value; // Get the array of selected values
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: selectedValues, // Update the state with the array of selected values
    }));
  };

  const handleIndustriesClick = () => {
    setOpenIndustries((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenIndustries(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIndustryToggle = (subCategory) => {
    const currentIndex = formValues.industries.indexOf(subCategory);
    const newSelected = [...formValues.industries];

    if (currentIndex === -1) {
      newSelected.push(subCategory); // Add if not selected
    } else {
      newSelected.splice(currentIndex, 1); // Remove if already selected
    }

    setFormValues({ ...formValues, industries: newSelected });
  };

  // Handle toggle for each category (e.g., "Technology")
  const handleCategoryToggle = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleStagesClick = () => {
    setOpenStages((prev) => !prev); // Toggle dropdown visibility
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setFormValues({ ...formValues, beyincProfile: value });
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const updatedProfile = checked
      ? [...formValues.beyincProfile, value]
      : formValues.beyincProfile.filter((item) => item !== value);

    setFormValues({ ...formValues, beyincProfile: updatedProfile });
  };

  const handleSubmit = async (e) => {
    console.log(formValues);

    e.preventDefault();

    // Prepare the data to send to the API
    const data = {
      beyincProfile: formValues.beyincProfile,
      expertise: formValues.expertise.flat(),
      industries: formValues.industries,
      stages: formValues.stages,
      investmentRange: formValues.investmentRange,
    };

    // if (!selectedRole) {
    //   alert("Please select a role before submitting.");
    //   return;
    // }

    try {
      // console.log(`Selected role: ${selectedRole}`);

      // Call the API service and await the response

      // await ApiServices.saveBeyincProfessional({ beyincProfile: selectedRole });
      await ApiServices.saveBeyincProfessional({ data });

      // Optionally handle any additional logic after a successful API call
      alert("Profile created successfully");
      navigate("/posts", { replace: true }); // Redirect without history stack addition
      window.location.reload(); // Refresh the /posts page
    } catch (error) {
      // Handle any error that occurs during the API call
      console.error("Error submitting role:", error);
      alert("There was an error submitting the role. Please try again.");
    }
  };

  return (
    <div className="bg-white my-5 mx-24 py-20 px-20 shadow-md">
      <h2 className="mb-10 font-serif text-2xl">
        Advance as a Professional on Our Platform
      </h2>
      <h3 className="mb-6 font-serif text-xl">BeyInc Profile*</h3>
      <div className="flex space-x-28 mb-10">
         <label>
        <input
          type="radio"
          name="beyincProfile"
          value="Mentor"
          className="mt-1 w-4 h-4"
          checked={formValues.beyincProfile === "Mentor"}
          onChange={handleRadioChange}
        />
        <span className="font-normal text-base">Mentor</span>
      </label>

      <label>
        <input
          type="radio"
          name="beyincProfile"
          value="Co-Founder"
          className="mt-1 w-4 h-4"
          checked={formValues.beyincProfile === "Co-Founder"}
          onChange={handleRadioChange}
        />
        <span className="font-normal text-base">Co-Founder</span>
      </label>

      {/* <label>
        <input
          type="radio"
          name="beyincProfile"
          value="Investor"
          className="mt-1 w-4 h-4"
          checked={formValues.beyincProfile === "Investor"}
          onChange={handleRadioChange}
        />
        <span className="font-normal text-base">Investor</span>
      </label> */}


      </div>
      
      <h3 className="mb-6 mt-5 font-serif text-xl">Expertise*</h3>
      <Select
        multiple
        name="expertise"
        value={formValues.expertise} // This is the array of selected values
        onChange={(event) => handleMultiSelectChange(event, "expertise")} // Pass event to handleMultiSelectChange
        input={<OutlinedInput label="Expertise" />}
        renderValue={(selected) => selected.join(", ")}
        sx={{
          width: "840px",
          height: "40px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "gray.400",
          },
        }}
      >
        {allskills.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={formValues.expertise.includes(option)} />{" "}
            {/* This ensures checkbox ticks correctly */}
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>

      <h3 className="mb-6 mt-10 font-serif text-xl">Industries*</h3>
      <FormControl fullWidth ref={dropdownRef}>
        <TextField
          sx={{
            marginTop: "10px",
            marginBottom: "10px",
            width: "840px",
            height: "40px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: "gray.400",
              // Static dark gray border color
            },
            borderRadius: "8px", // Example of border radius
          }}
          value={formValues.industries.join(", ") || ""}
          onClick={handleIndustriesClick}
          readOnly
          variant="outlined"
          InputProps={{
            endAdornment: openIndustries ? <ExpandLess /> : <ExpandMore />,
          }}
        />
        <Collapse in={openIndustries} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            style={{ maxHeight: "300px", overflowY: "auto", width: "840px" }}
          >
            {Object.keys(domain_subdomain).map((category) => (
              <React.Fragment key={category}>
                <ListItem button onClick={() => handleCategoryToggle(category)}>
                  <ListItemText primary={category} />
                  {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                {/* Subcategories with checkboxes */}
                <Collapse
                  in={openCategories[category]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {domain_subdomain[category].map((subCategory) => (
                      <ListItem
                        key={subCategory}
                        button
                        onClick={() => handleIndustryToggle(subCategory)}
                      >
                        <Checkbox
                          checked={
                            formValues.industries.indexOf(subCategory) !== -1
                          }
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={subCategory} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      </FormControl>

      {/* <h3 className="mb-6 mt-10 font-serif text-xl">Stage*</h3>
      <FormControl fullWidth>
        <TextField
          sx={{
            marginTop: "10px",
            marginBottom: "10px",
            width: "840px",
            height: "40px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: "gray.400", // Static dark gray border color
            },
            borderRadius: "8px", // Example of border radius
          }}
          value={formValues.stages.join(", ") || ""}
          onClick={handleStagesClick}
          readOnly
          variant="outlined"
          InputProps={{
            endAdornment: openStages ? <ExpandLess /> : <ExpandMore />,
          }}
        />
        <Collapse in={openStages} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            style={{ maxHeight: "250px", overflowY: "auto", width: "840px" }}
          >
            {stages.map((option) => (
              <ListItem
                key={option}
                onClick={() => handleMultiSelectChange(option, "stages")}
              >
                <Checkbox checked={formValues.stages.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </FormControl>
      <h3 className="mb-6 mt-10 font-serif text-xl">Investment Range</h3>
      <FormControl fullWidth>
        <TextField
          // label="Investment Range"
          name="investmentRange"
          type="number"
          value={formValues.investmentRange}
          onChange={handleChange}
          variant="outlined"
          sx={{
            marginTop: "20px",
            width: "840px",
            height: "40px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: "gray.400",
              // Static dark gray border color
            },
          }}
        />
      </FormControl> */}
      <button onClick={handleSubmit} className="mt-10 rounded-full w-32 ml-4">
        <span className="text-md font-bold">Submit</span>
      </button>
    </div>
  );
};

export default BeyincProfessional;
