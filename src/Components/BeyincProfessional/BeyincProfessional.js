import React, { useState } from 'react';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Button, Typography } from '@mui/material';
import { ApiServices } from "../../Services/ApiServices";
const BeyincProfessional = () => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      alert('Please select a role before submitting.');
      return;
    }
    
    try {
        console.log(`Selected role: ${selectedRole}`);
      // Call the API service and await the response
      await ApiServices.saveBeyincProfessional({ beyincProfile: selectedRole });
     
      // Optionally handle any additional logic after a successful API call
      alert('Role submitted successfully');
      
    } catch (error) {
      // Handle any error that occurs during the API call
      console.error('Error submitting role:', error);
      alert('There was an error submitting the role. Please try again.');
    }
  };
  
  // Function to handle radio button changes
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        p={3}
        border={1}
        borderRadius={4}
        borderColor="grey.300"
      >
        <Typography variant="h5" mb={2} align="center">
          Select your role
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup value={selectedRole} onChange={handleRoleChange}>
            <FormControlLabel value="Mentor" control={<Radio />} label="Mentor" />
            <FormControlLabel value="Investor" control={<Radio />} label="Investor" />
            <FormControlLabel value="Cofounder" control={<Radio />} label="Cofounder" />
            <FormControlLabel value="InstitutionalInvestor" control={<Radio />} label="Institutional Investor" />
          </RadioGroup>
        </FormControl>

        <Box mt={2} textAlign="center">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BeyincProfessional;
