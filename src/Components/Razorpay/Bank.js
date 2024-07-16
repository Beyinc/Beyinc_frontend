import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { addingBenificiaryAccount , addingFundAccount} from "./Payment";
import { PaymentServices } from "../../Services/PaymentServices";

const AddBankAccountForm = () => {
    const [selectedOption, setSelectedOption] = useState('bank');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accountNumber, setAccountNumber] = useState('123406786012');
    const [ifsc, setIfsc] = useState('HDFC0000123');
    const [upiId, setUpiId] = useState('jam@oksbi');
    const [registeredName, setRegisteredName] = useState('Rishabh');
    const [amount, setAmount] = useState(100);
  
  

    const handleAddFundAccount = async () => {
        setIsSubmitting(true);
        try {
            const accountDetails = {
                registeredName,
    
            };

            if (selectedOption === 'bank' && accountNumber && ifsc) {
                accountDetails.method = 'bank';
                accountDetails.accountNumber = accountNumber;
                accountDetails.ifsc = ifsc;
            } else if (selectedOption === 'upi' && upiId) {
                accountDetails.method = 'upi';
                accountDetails.upiId = upiId;
            } else {
                throw new Error("Please fill in all required fields.");
            }
            console.log(accountDetails);
            await PaymentServices.fundaccount(accountDetails);
            // Navigate to another page or show success message if needed
        } catch (error) {
            console.error("Error occurred while adding fund account:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleWithdraw = async () => {
        setIsSubmitting(true);
        try {
            console.log("Withdrawing amount:", amount);
            await PaymentServices.payOut({ amount });
            // Navigate to another page or show success message if needed
        } catch (error) {
            console.error("Error occurred while withdrawing:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Add Bank Account or UPI Details
                </Typography>
                <Typography variant="body1">
                    Choose any one method
                </Typography>
            </Box>
            <form onSubmit={handleAddFundAccount}>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormLabel component="legend">Payment Method</FormLabel>
                    <RadioGroup
                        aria-label="payment-method"
                        name="payment-method"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <FormControlLabel value="bank" control={<Radio />} label="Bank" />
                        <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                    </RadioGroup>
                </FormControl>

                {selectedOption === 'bank' && (
                    <> 
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Registered Name"
                                variant="outlined"
                                value={registeredName}
                                onChange={(e) => setRegisteredName(e.target.value)}
                                required
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Account Number"
                                variant="outlined"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="IFSC Code"
                                variant="outlined"
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value)}
                                required
                            />
                        </Box>
                    </>
                )}

                {selectedOption === 'upi' && (
                    <>
                         <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Registered Name"
                                variant="outlined"
                                value={registeredName}
                                onChange={(e) => setRegisteredName(e.target.value)}
                                required
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="UPI ID"
                                variant="outlined"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                required
                            />
                        </Box>
                       
                    </>
                )}

                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Amount"
                        variant="outlined"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleWithdraw}
                        disabled={isSubmitting}
                        sx={{ ml: 2 }}
                    >
                        {isSubmitting ? 'Withdrawing...' : 'Withdraw'}
                    </Button>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleAddFundAccount} 
                        disabled={isSubmitting}
                        sx={{ ml: 2 }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Fund Account'}
                    </Button>
                  
                </Box>
            </form>
        </Container>
    );
};

export default AddBankAccountForm;
