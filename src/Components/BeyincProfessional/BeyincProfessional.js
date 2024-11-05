import React, { useState } from "react";
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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
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
    beyincProfile: [],
    investmentRange: "",
  });

  // // Function to handle radio button changes
  // const handleRoleChange = (e) => {
  //   setSelectedRole(e.target.value);
  // };

  const handleMultiSelectChange = (value, name) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: prevValues[name].includes(value)
        ? prevValues[name].filter((item) => item !== value) // Remove if already selected
        : [...prevValues[name], value], // Add if not selected
    }));
  };

  const handleIndustriesClick = () => {
    setOpenIndustries(!openIndustries);
  };

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
    const { name,value} = e.target;
    setFormValues({...formValues,[name]:value})
  }
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
      beyincProfile: formValues.beyincProfile[0],
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
      alert("Role submitted successfully");
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
            type="checkbox"
            name="beyincProfile"
            value="Mentor"
            className="mt-1 w-4 h-4"
            checked={formValues.beyincProfile.includes("Mentor")}
            onChange={handleCheckboxChange}
          />
          <span className="font-normal text-base">Mentor</span>
        </label>

        <label>
          <input
            type="checkbox"
            name="beyincProfile"
            value="Co-Founder"
            className="mt-1 w-4 h-4"
            checked={formValues.beyincProfile.includes("Co-Founder")}
            onChange={handleCheckboxChange}
          />
          <span className="font-normal text-base">Co-Founder</span>
        </label>

        <label>
          <input
            type="checkbox"
            name="beyincProfile"
            value="Investor"
            className="mt-1 w-4 h-4"
            checked={formValues.beyincProfile.includes("Investor")}
            onChange={handleCheckboxChange}
          />
          <span className="font-normal text-base">Investor</span>
        </label>

        <label>
          <input
            type="checkbox"
            name="beyincProfile"
            value="Other"
            className="mt-1 w-4 h-4"
            checked={formValues.beyincProfile.includes("Other")}
            onChange={handleCheckboxChange}
          />
          <span className="font-normal text-base">Other</span>
        </label>
      </div>
      <h3 className="mb-6 mt-5 font-serif text-xl">Expertise*</h3>

      <Select
        multiple
        name="expertise"
        value={formValues.expertise}
        onChange={(event) => handleMultiSelectChange(event.target.value, "expertise")}
        input={<OutlinedInput label="Expertise" />}
        renderValue={(selected) => selected.join(", ")}
        sx={{
          width: "840px",
          height: "40px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "gray.400",
            // Static dark gray border color
          },
        }}
      >
        {allskills.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={formValues.expertise.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>

      <h3 className="mb-6 mt-10 font-serif text-xl">Industries*</h3>
      <FormControl fullWidth>
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
      <h3 className="mb-6 mt-10 font-serif text-xl">Stage*</h3>
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
                button
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
        marginTop:"20px",
        width: "840px",
        height: "40px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderWidth: "2px",
          borderColor: "gray.400",
          // Static dark gray border color
        },
      }}
    />
  </FormControl>
  <button 
  onClick={handleSubmit}
  className="mt-10 rounded-full w-32 ml-4"><span className="text-md font-bold">Submit</span></button>
    </div>
  );
};

export default BeyincProfessional;
