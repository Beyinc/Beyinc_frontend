import React from 'react'
import axios from 'axios';

import { Box, Stack, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const BuyCoins = () => {

    const checkoutHandler = async (amount) => {

        const { data: { key } } = await axios.get("http://www.localhost:4000/api/razorpay/getkey")

        const { data :{order}} = await axios.post("http://localhost:4000/api/razorpay/checkout", {
            amount
        })
        // console.log(data)

        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "BEYINC",
            description: "Tutorial of RazorPay",
            image: "https://avatars.githubusercontent.com/u/25058652?v=4",
            order_id: order.id,
            callback_url: "http://localhost:4000/api/razorpay/paymentverification",
            prefill: {
                name: "Gaurav Kumar",
                email: "gaurav.kumar@example.com",
                contact: "9999999999"
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
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
         
                
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="256"
                        image="http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"
                        alt="Canon EOS R5"
                    />
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">₹30</Typography>
                        <Button variant="contained" color="primary" onClick={() => checkoutHandler(30)}>
                            Buy Now
                        </Button>
                    </CardContent>
                </Card>
          
        </Box>
    );
};

export default BuyCoins;
