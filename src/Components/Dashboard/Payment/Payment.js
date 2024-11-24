import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { PaymentServices } from "../../../Services/PaymentServices";

export default function Payment() {
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [mentorBookings, setMentorBookings] = useState([]);

  const { user_id } = useSelector((store) => store.auth.loginDetails);

  // Fetch transactions on component mount
  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const response = await PaymentServices.getTransactions(user_id); // API call for transactions
  //       console.log('Transaction',transactions)
  //       setTransactions(response.data);
  //     } catch (error) {
  //       console.error("Error fetching transactions:", error);
  //     }
  //   };

  //   fetchTransactions();
  // }, [user_id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const transactionColumns = ["Date", "Amount", "Currency", "Status"];
  const withdrawalColumns = [
    "DateTime",
    "Duration",
    "UserName",
    "Title",
    "Amount",
    "Withdraw",
  ];

  return (
    <Box px={4} py={3}>
      <Box p={8} bgcolor="white" borderRadius={3} boxShadow={2}>
        <Typography variant="h5" align="left" style={{ fontFamily: "Roboto" }}>
          Payments
        </Typography>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Withdrawals" />
          <Tab label="Transactions" />
        </Tabs>

        <Box mt={2} mb={3} bgcolor="grey.300" height=".5px" width="100%" />

        {activeTab === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {withdrawalColumns.map((column) => (
                    <TableCell
                      key={column}
                      style={{ fontWeight: "bold", fontSize: "15px" }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {mentorBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{new Date(booking.startDateTime).toLocaleString()}</TableCell>
                    <TableCell>{booking.duration}</TableCell>
                    <TableCell>{booking.mentorId?.userName || "N/A"}</TableCell>
                    <TableCell>{booking.title}</TableCell>
                    <TableCell>{booking.amount}</TableCell>
                    <TableCell>
                      {/* Implement your checkbox logic here */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* {activeTab === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {transactionColumns.map((column) => (
                    <TableCell
                      key={column}
                      style={{ fontWeight: "bold", fontSize: "15px" }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.currency}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )} */}
      </Box>
    </Box>
  );
}
