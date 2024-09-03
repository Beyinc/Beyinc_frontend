import React, {useState} from 'react'
import axios from 'axios';
import api from '../axiosInstance'
import { PaymentServices } from "../../Services/PaymentServices";
import { handlePayment }from "./Payment";
import { Box, Stack, Card, CardContent, CardMedia, Typography, Button, TextField } from '@mui/material';



const Book = () => {
    const [amount, setamount] = useState(10);
    const [referralCode, setReferralCode] = useState('');
    const [demoCode, setDemoCode] = useState('');
    const [message, setMessage] = useState('');

    // console.log(process.env.RAZORPAY_API_KEY)

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
          const response = await api.post('/referral/applyReferral', {
            referralCode
            // demoCode,
          });
    
          if (response.status === 200) {
            setMessage('Codes submitted successfully!');
          } else {
            setMessage('Failed to submit codes.');
          }
        } catch (error) {
          console.error('Error submitting codes:', error);
          setMessage('An error occurred while submitting codes.');
        }
      };

    const checkoutHandler = async () => {

      
      const currency = 'INR';
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const contact = '1234567890';
      const userId = 'user123'; // Example user ID

      await handlePayment(amount, currency, name, email, contact, userId);

    }



    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Referral Code"
        variant="outlined"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        fullWidth
      />
      <TextField
        label="Free Demo Code"
        variant="outlined"
        value={demoCode}
        onChange={(e) => setDemoCode(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
         
                
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="256"
                        image="http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"
                        alt="Canon EOS R5"
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">₹30</Typography>
                        <Button variant="contained" color="primary" onClick={() => checkoutHandler()}>
                            Buy Now
                        </Button>
                    </CardContent>
                </Card>
          
        </Box>
    );
};

export default Book;
