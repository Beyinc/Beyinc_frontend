import React, { useState } from 'react';
import UpiandBankModal from './UpiandBankModal';

// Modal component
const ConnectPayoutModal = ({ isOpen, onClose, setCurrency, currency, setIsUpiandBankModalOpen }) => {
    const [selectedCurrency, setSelectedCurrency] = useState("Rupees");
    const [selectedCountry, setSelectedCountry] = useState("India");


    // List of countries (for example purposes, you can add more)
    const countries = [
        "India",
        "United States",
        "United Kingdom",
        "Australia",
        "Canada",
        "Germany",
        "France",
        "Japan",
        "Brazil",
        "South Africa",
    ];

    const handleOpenSecondModal = () => {

        
        setCurrency(selectedCurrency);
        setIsUpiandBankModalOpen(true);
        onClose();
    }

    // Handle the currency change
    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };

    // Handle the country change
    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    const toggleModal = () => {
        onClose();  // Close the modal when the user clicks on close button
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
                        <div className="">
                            <h3 className='text-2xl'>Payout Preference</h3>
                            <p className='align-baseline text-sm text-gray-600'>Please confirm the currency and country you want to receive your payout in. </p>
                        </div>

                        {/* Currency selection */}
                        <div className='text-base mt-4'>
                            <label htmlFor="currency" className="block text-base">Currency</label>
                            <select
                                id="currency"
                                value={selectedCurrency}
                                onChange={handleCurrencyChange}
                                className="mt-1 p-2 border rounded-md w-full text-base focus:outline-none focus:ring-0"
                            >
                                <option value="Rupees">Rupees</option>
                                <option value="Euro">Euro</option>
                                <option value="USD">USD</option>
                                <option value="Pound">Pound</option>
                            </select>
                        </div>

                        {/* Country selection */}
                        <div className="">
                            <label htmlFor="country" className="block text-base">Country</label>
                            <select
                                id="country"
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                className=" p-2 border rounded-md w-full text-base focus:outline-none focus:ring-0"
                            >
                                {countries.map((country, index) => (
                                    <option key={index} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className='w-full' onClick={handleOpenSecondModal}>
                            Confirm details
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ConnectPayoutModal;
