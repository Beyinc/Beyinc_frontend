import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { addingBenificiaryAccount , addingFundAccount} from "./Payment";
import { PaymentServices } from "../../Services/PaymentServices";

const Proffesional = () => {
   
    const [isSubmitting, setIsSubmitting] = useState(false);
  
   
    const [mobile, setMobile] = useState(9876533210);
    const [email, setEmail] = useState('user@example.com');
    const [userName, setuserName] = useState('Rishabh');
    const userId = "66911ee3a080132dc07c78ce"; // Replace with actual user data

    const navigate = useNavigate();

    const SubmitHandler = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        console.log(mobile, email, userName)
        await PaymentServices.addingProffesional({mobile, email, userName,userId});
        
        navigate('/bank'); 
      } catch (error) {
        console.error("Error occurred while submitting:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

   



    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Proffesional Account
                </Typography>
               
            </Box>
            <form onSubmit={SubmitHandler}>
               

                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Mobile"
                        variant="outlined"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Bloomr Member"
                        variant="outlined"
                        value={userName}
                        onChange={(e) => setuserName(e.target.value)}
                        required
                    />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </Box>
                
            </form>
        </Container>
    );
};

export default Proffesional;
