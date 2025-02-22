import React, { useState, useEffect } from "react";
import { Checkbox, Tabs, useMediaQuery, useTheme } from "@mui/material";
// ... other imports remain the same ...
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import connectPayoutModal from './ConnectPayoutModal'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { CalendarServices } from "../../../Services/CalendarServices";
// import { saveWithdrawData } from "../../../Services/PaymentServices";
import { PaymentServices } from "../../../Services/PaymentServices";
import ConnectPayoutModal from "./ConnectPayoutModal";
import UpiandBankModal from "./UpiandBankModal";
import axiosInstance from "../../axiosInstance";
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Payment() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // ... existing state and logic remains the same ...
  const [activeTab, setActiveTab] = useState(0);
  const [mentorBookings, setMentorBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const chargePerCent = 10;
  const [currency, setCurrency] = useState();

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isUpiandBankModalOpen, setIsUpiandBankModalOpen] = useState(false);
  const [transactionData, setTransactionData] = useState();


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const columns = [
    "DateTime",
    "Duration",
    "UserName",
    "Title",
    "Amount",
    "Withdraw",
  ];

  const trasactionsColoumn = [
    "BookingIds",
    "Total Amount",
    "Withdrawl Amount",
    "Status",
    "Payment Proof",
  ]

  const {
    email: userEmail,
    user_id,
    userName,
  } = useSelector((store) => store.auth.loginDetails);
  const fetchTransactionsData = async () => {
    try {
      const transactionDataResponse = await axiosInstance.post('/payment/getPayoutDetails',);
      console.log("This is the response from backend: ", transactionDataResponse.data.withdrawlData);
      setTransactionData(transactionDataResponse.data.withdrawlData);
      // console.log("This is the transactionData.data: ", transactionData);


    } catch (error) {
      console.log("There was an error fetching transactions data: ", error);
    }
  }
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const { mentorBookings } = await CalendarServices.mentorBookings({
          mentorId: user_id,
        });
        console.log("mentor Bookings:", mentorBookings);
        setMentorBookings(mentorBookings);
        // console.log("This is the transactionData.data: ", transactionData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookingData();
  }, [user_id]);

  useEffect(() => {
    fetchTransactionsData();
    setSelectedAmounts([]);
    setSelectedIds([]);

  }, [activeTab]);



  const [selectedAmounts, setSelectedAmounts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id, amount, isChecked) => {
    setSelectedAmounts((prevSelectedAmounts) => {
      if (isChecked) {
        return [...prevSelectedAmounts, amount];
      } else {
        return prevSelectedAmounts.filter((item) => item !== amount);
      }
    });

    setSelectedIds((prevSelectedIds) => {
      if (isChecked) {
        return [...prevSelectedIds, id];
      } else {
        return prevSelectedIds.filter((itemId) => itemId !== id);
      }
    });
  };

  const totalAmount = selectedAmounts.reduce((acc, curr) => acc + curr, 0);
  const commission = totalAmount * 0.1;
  const remainingAmount = totalAmount - commission;

  // Example function to send data to backend



  const saveToDatabase = async () => {
    const data = {
      // BookingId of the person
      selectedIds,
      totalAmount,
      commission,
      remainingAmount,
    };
    console.log("Sending data to backend:", data);

    if (totalAmount !== 0) {
      // Set loading to true before making the API call
      setLoading(true);

      try {
        // Await the API call to save the withdrawal data
        const response = await PaymentServices.saveWithdrawData(data);
        console.log("Data saved successfully:", response);
      } catch (error) {
        console.error("Error saving data:", error);
      } finally {
        // Set loading to false after the request is complete
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Box px={{ xs: 2, sm: 4 }} py={3}>
        <Box p={{ xs: 2, sm: 4, md: 8 }} bgcolor={"white"} borderRadius={3} boxShadow={2}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <Typography variant="h5" align="left" style={{ fontFamily: "Roboto" }}>
              Availability
            </Typography>
            <button
              className="bg-customPurple rounded-md w-full sm:w-40 py-2"
              onClick={() => setIsPayoutModalOpen(true)}
            >
              Connect Payout
            </button>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab label="WithDrawals" />
            <Tab label="Transactions" />
          </Tabs>

          {/* Divider */}
          <Box mt={2} mb={3} bgcolor="grey.300" height=".5px" width="100%" />

          {activeTab === 0 && (
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#fafafa" }}>
                    {columns.map((column) => (
                      <TableCell
                        key={column}
                        sx={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: { xs: '12px', sm: '15px' },
                          py: 1
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mentorBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {new Date(booking.startDateTime).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {booking.duration}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {booking.mentorId.userName}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {booking.title}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {booking.amount} {booking.currency}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Checkbox
                          size={isMobile ? "small" : "medium"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              booking._id,
                              booking.amount,
                              e.target.checked
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#fafafa" }}>
                    {trasactionsColoumn.map((column) => (
                      <TableCell
                        key={column}
                        sx={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: { xs: '12px', sm: '15px' },
                          py: 1
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionData.map((transaction, index) => (
                    <TableRow key={index}>
                      {/* <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {new Date(booking.startDateTime).toLocaleString()}
                      </TableCell> */}
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {transaction.bookingIds.map((bookingId, index) => (
                        <div key={index}>
                          {bookingId}
                        </div> 
                        ))}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {transaction.totalAmount}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {transaction.withdrawlAmount}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {transaction.payoutStatus}
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '12px', sm: '15px' }, py: 1 }}>
                        {transaction.paymentProof}
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        {/* <Checkbox
                          size={isMobile ? "small" : "medium"}
                          onChange={(e) =>
                            handleCheckboxChange(
                              booking._id,
                              booking.amount,
                              e.target.checked
                            )
                          }
                        /> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          )}

          {activeTab === 0 && (
            <>
              <Box
                mt={4}
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-around"
                gap={2}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle2">Charge:</Typography>
                  <Typography fontWeight="bold">{chargePerCent}%</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="subtitle2">Withdraw Amount:</Typography>
                  <Typography fontWeight="bold">{remainingAmount}</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="subtitle2">Total Amount:</Typography>
                  <Typography fontWeight="bold">{totalAmount}</Typography>
                </Box>
              </Box>

              <Box mt={4} display="flex" justifyContent="center">
                <button
                  type="button"
                  className={`flex justify-center items-center h-14 w-full sm:w-36 text-lg border-2 border-[#4f55c7] px-2 py-3 rounded-full ${loading ? "bg-blue-300" : "bg-customPurple"
                    }`}
                  onClick={saveToDatabase}
                >
                  {loading ? "Loading..." : `Withdraw ${remainingAmount}`}
                </button>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <ConnectPayoutModal setIsUpiandBankModalOpen={setIsUpiandBankModalOpen} currency={currency} setCurrency={setCurrency} isOpen={isPayoutModalOpen} onClose={() => setIsPayoutModalOpen(false)} />
      <UpiandBankModal currency={currency} isOpen={isUpiandBankModalOpen} onClose={() => setIsUpiandBankModalOpen(false)} />

      {/* Modals remain the same */}
    </div>
  );
}