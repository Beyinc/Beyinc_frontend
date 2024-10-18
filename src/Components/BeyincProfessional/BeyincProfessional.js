import React, {  useState } from "react";
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

  const handleMultiSelectChange = (event, name) => {
    const { value } = event.target;
    setFormValues({
      ...formValues,
      [name]: typeof value === "string" ? value.split(",") : value,
    });
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log(formValues);

    e.preventDefault();

    // Prepare the data to send to the API
    const data = {
      beyincProfile: formValues.beyincProfile,
      expertise: formValues.expertise,
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
      await ApiServices.saveBeyincProfessional({data});

      // Optionally handle any additional logic after a successful API call
      alert("Role submitted successfully");
    } catch (error) {
      // Handle any error that occurs during the API call
      console.error("Error submitting role:", error);
      alert("There was an error submitting the role. Please try again.");
    }
  };

  return (


    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f6f6fc",
        padding: "80px",
        borderRadius: "20px",
        marginTop: "100px",
        width: "900px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginTop: "5px",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "300",
          color: "#333",
        }}
      >
        Fill this form
      </Typography>

      {/* Beyinc Profile */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Beyinc Profile</InputLabel>
          <Select
            name="beyincProfile"
            value={formValues.beyincProfile}
            onChange={handleChange}
            variant="outlined"
            sx={{
              marginTop: "16px",
            }}
          >
            <MenuItem value="Cofounder">Co-founder</MenuItem>
            <MenuItem value="Mentor">Mentor</MenuItem>
            <MenuItem value="Investor">Investor</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Expertise */}
      <Grid item xs={12}>
        <FormControl fullWidth sx={{ marginTop: "20px" }}>
          <InputLabel>Expertise</InputLabel>
          <Select
            multiple
            name="expertise"
            value={formValues.expertise}
            onChange={(event) => handleMultiSelectChange(event, "expertise")}
            input={<OutlinedInput label="Expertise" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {allskills.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={formValues.expertise.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Industries Section */}
      <FormControl fullWidth>
        <TextField
          sx={{
            marginTop: "10px",
            marginBottom: "10px",
            borderRadius: "8px", // Example of border radius
          }}
          label="Industries"
          value={formValues.industries.join(", ") || ""}
          onClick={handleIndustriesClick}
          readOnly
          variant="outlined"
          InputProps={{
            endAdornment: openIndustries ? <ExpandLess /> : <ExpandMore />,
          }}
        />
        <Collapse in={openIndustries} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
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

      {/* Stages */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Stages</InputLabel>
          <Select
            multiple
            name="stages"
            value={formValues.stages}
            onChange={(event) => handleMultiSelectChange(event, "stages")}
            input={<OutlinedInput label="Stages" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {stages.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={formValues.stages.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Investment Range */}
      <Grid item xs={12}>
        <FormControl fullWidth>
          <TextField
            label="Investment Range"
            name="investmentRange"
            type="number"
            value={formValues.investmentRange}
            onChange={handleChange}
            variant="outlined"
            sx={{
              marginTop: "16px",
            }}
          />
        </FormControl>
      </Grid>

      {/* Submit Button */}
      <Grid item xs={12} container justifyContent="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: "30px" }}
        >
          Submit
        </Button>
      </Grid>
    </form>
  );
};

export default BeyincProfessional;
