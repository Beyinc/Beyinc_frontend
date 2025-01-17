import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';

// Modal component
const UpiandBankModal = ({ isOpen, onClose, currency }) => {
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [bankNameError, setBankNameError] = useState('');
    const [accountNumberError, setAccountNumberError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    // Regex for validating bank name (only alphabets) and account number (only digits)
    const bankNameRegex = /^[A-Za-z\s]+$/;
    const accountNumberRegex = /^[0-9]+$/;

    useEffect(() => {
        // Check if form is valid when any field changes
        const validateForm = () => {
            if (selectedMethod === 'upi') {
                setIsFormValid(upiId.trim() !== '');
            } else if (selectedMethod === 'bank') {
                setIsFormValid(
                    accountHolderName.trim() !== '' &&
                    bankName.trim() !== '' &&
                    accountNumber.trim() !== '' &&
                    ifscCode.trim() !== '' &&
                    currency.trim() !== '' &&
                    !bankNameError &&
                    !accountNumberError
                );
            }
        };

        validateForm();  // Re-validate on every field change
    }, [selectedMethod, upiId, accountHolderName, bankName, accountNumber, ifscCode, currency, bankNameError, accountNumberError]);

    const toggleModal = () => {
        onClose();  // Close the modal when the user clicks on close button
    };

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);  // Set selected method (UPI or Bank Transfer)
    };

    const handleBankNameChange = (e) => {
        const value = e.target.value;
        setBankName(value);

        // Real-time validation for bank name
        if (!bankNameRegex.test(value)) {
            setBankNameError('Bank name should only contain alphabets');
        } else {
            setBankNameError('');
        }
    };

    const handleAccountNumberChange = (e) => {
        const value = e.target.value;
        setAccountNumber(value);

        // Real-time validation for account number
        if (!accountNumberRegex.test(value)) {
            setAccountNumberError('Account number should only contain digits');
        } else {
            setAccountNumberError('');
        }
    };

    const handleSubmit = async () => {
        const payload = {};

        if (selectedMethod === 'upi') {
            payload.upiId = upiId;
        } else if (selectedMethod === 'bank') {
            payload.bankName = bankName;
            payload.accountHolderName = accountHolderName;
            payload.accountNumber = accountNumber;
            payload.ifscCode = ifscCode;
            payload.currency = currency;
        }

        try {
            const response = await axiosInstance.post('http://localhost:4000/api/payment/savePayoutDetails', payload);
            console.log(response.data);
            alert('Payout details saved successfully');
            onClose();  // Close the modal after saving
        } catch (error) {
            console.error('Error saving payout details:', error);
            alert('Error saving payout details');
        }
    };

    return (
        <div>
            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md w-80 relative">
                        {/* Close button */}
                        <span
                            onClick={toggleModal}
                            className="absolute top-2 right-2 text-xl cursor-pointer"
                        >
                            &times;
                        </span>
                        <div>
                            <h3 className="text-2xl mb-4">Payout Preference</h3>
                            {/* Select Payout Method */}
                            <div className="mb-4 flex gap-x-4">
                                <button
                                    className={`w-full py-2 ${selectedMethod === 'upi' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                    onClick={() => handleMethodSelect('upi')}
                                >
                                    UPI
                                </button>
                                <button
                                    className={`w-full py-2 ${selectedMethod === 'bank' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                    onClick={() => handleMethodSelect('bank')}
                                >
                                    Bank Transfer
                                </button>
                            </div>
                            <div className="mr-5">
                                {/* Conditional form rendering based on the selected method */}
                                {selectedMethod === 'upi' && (
                                    <div>
                                        <label className='text-base'>UPI Id</label>
                                        <input
                                            type="text"
                                            placeholder="Enter UPI ID"
                                            className="w-full p-2 border mb-2"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                )}

                                {selectedMethod === 'bank' && (
                                    <div className="m-2">
                                        <label className='text-base'>Account holder name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Account holder name"
                                            className="w-full border mb-2"
                                            value={accountHolderName}
                                            onChange={(e) => setAccountHolderName(e.target.value)}
                                        />
                                        <label className='text-base'>Bank Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Bank Name"
                                            className="w-full border mb-2"
                                            value={bankName}
                                            onChange={handleBankNameChange}
                                        />
                                        {bankNameError && <p className="text-red-500 text-sm">{bankNameError}</p>}
                                        <label className='text-base'>Account Number</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Account Number"
                                            className="w-full border mb-2"
                                            value={accountNumber}
                                            onChange={handleAccountNumberChange}
                                        />
                                        {accountNumberError && <p className="text-red-500 text-sm">{accountNumberError}</p>}
                                        <label className='text-base'>IFSC code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter IFSC Code"
                                            className="w-full border mb-2"
                                            value={ifscCode}
                                            onChange={(e) => setIfscCode(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md"
                                onClick={handleSubmit}
                                disabled={!isFormValid}
                            >
                                Confirm Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpiandBankModal;
