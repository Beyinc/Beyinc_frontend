
import React, { useState, useEffect } from "react";
import { Checkbox, Tabs } from "@mui/material";

import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

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
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Payment() {
  const [activeTab, setActiveTab] = useState(0);
  const [mentorBookings, setMentorBookings] = useState([]);

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

  const {
    email: userEmail,
    user_id,
    userName,
  } = useSelector((store) => store.auth.loginDetails);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const { mentorBookings } = await CalendarServices.mentorBookings({
          mentorId: user_id,
        });
        console.log("mentor Bookings:", mentorBookings);
        setMentorBookings(mentorBookings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookingData();
  }, [user_id]);

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

  const saveToDatabase = () => {
    const data = {
      selectedIds,
      totalAmount,
      commission,
      remainingAmount,
    };
    console.log("Sending data to backend:", data);
    if (totalAmount !== 0) {
      // Call the saveWithdrawl API function
      PaymentServices.saveWithdrawData(data)
        .then((response) => {
          console.log("Data saved successfully:", response);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    }
  };

  return (
    <Box px={4} py={3}>
      <Box p={8} bgcolor={"white"} borderRadius={3} boxShadow={2}>
        <Typography variant="h5" align="left" style={{ fontFamily: "Roboto" }}>
          Availability
        </Typography>

        {/* Tab selection */}
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            label="WithDrawals"
            className={`available-tab ${
              activeTab === 0 ? "available-tab-active" : ""
            }`}
          />

          <Tab
            label="Transactions"
            className={`available-tab ${
              activeTab === 1 ? "availabe-tab-active" : ""
            }`}
          />
        </Tabs>

        {/* Divider Below Tabs */}
        <Box
          mt={2}
          mb={3}
          bgcolor="grey.300"
          height=".5px"
          width="100%"
          marginTop={"0px"}
        />

        {activeTab === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#fafafa" }}>
                  {" "}
                  {/* Gray background for header */}
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "15px",
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
                    <TableCell style={{ color: "black", fontSize: "15px" }}>
                      {new Date(booking.startDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell style={{ color: "black", fontSize: "15px" }}>
                      {booking.duration}
                    </TableCell>
                    <TableCell style={{ color: "black", fontSize: "15px" }}>
                      {booking.mentorId.userName}
                    </TableCell>
                    <TableCell style={{ color: "black", fontSize: "15px" }}>
                      {booking.title}
                    </TableCell>
                    <TableCell style={{ color: "black", fontSize: "15px" }}>
                      {booking.amount} {booking.currency}
                    </TableCell>
                    <TableCell style={{ color: "black", fontSize: "15px" }}>
                      <Checkbox
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
        <div className="flex justify-around mt-20">
          <div className="font-bold"> Charge: {commission} %</div>
          <div className="font-bold"> Withdraw Amount: {remainingAmount}</div>
          <div className="font-bold"> Total Amount: {totalAmount}</div>
        </div>
        <div>
        <button
            type="button"
            className="mt-10 ml-[650px] flex justify-center items-center h-14 w-36 text-lg border-2 border-[#4f55c7] px-2 py-3 rounded-full"
            onClick={saveToDatabase}
          >
           {`Withdraw ${remainingAmount}`}
          </button>
        </div>
      </Box>
    </Box>
  );
}





















// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Tabs,
//   Tab,
//   Box,
//   Typography,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import { PaymentServices } from "../../../Services/PaymentServices";

// export default function Payment() {
//   const [activeTab, setActiveTab] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [mentorBookings, setMentorBookings] = useState([]);

//   const { user_id } = useSelector((store) => store.auth.loginDetails);

//   // Fetch transactions on component mount
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await PaymentServices.getTransactions(user_id); // API call for transactions
//         console.log('Transaction',transactions)
//         setTransactions(response.data);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       }
//     };

//     fetchTransactions();
//   }, [user_id]);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   const transactionColumns = ["Date", "Amount", "Currency", "Status"];
//   const withdrawalColumns = [
//     "DateTime",
//     "Duration",
//     "UserName",
//     "Title",
//     "Amount",
//     "Withdraw",
//   ];

//   return (
//     <Box px={4} py={3}>
//       <Box p={8} bgcolor="white" borderRadius={3} boxShadow={2}>
//         <Typography variant="h5" align="left" style={{ fontFamily: "Roboto" }}>
//           Payments
//         </Typography>

//         {/* Tabs */}
//         <Tabs value={activeTab} onChange={handleTabChange}>
//           <Tab label="Withdrawals" />
//           <Tab label="Transactions" />
//         </Tabs>

//         <Box mt={2} mb={3} bgcolor="grey.300" height=".5px" width="100%" />

//         {activeTab === 0 && (
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   {withdrawalColumns.map((column) => (
//                     <TableCell
//                       key={column}
//                       style={{ fontWeight: "bold", fontSize: "15px" }}
//                     >
//                       {column}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {mentorBookings.map((booking) => (
//                   <TableRow key={booking._id}>
//                     <TableCell>{new Date(booking.startDateTime).toLocaleString()}</TableCell>
//                     <TableCell>{booking.duration}</TableCell>
//                     <TableCell>{booking.mentorId?.userName || "N/A"}</TableCell>
//                     <TableCell>{booking.title}</TableCell>
//                     <TableCell>{booking.amount}</TableCell>
//                     <TableCell>
//                       {/* Implement your checkbox logic here */}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}

//         {activeTab === 1 && (
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   {transactionColumns.map((column) => (
//                     <TableCell
//                       key={column}
//                       style={{ fontWeight: "bold", fontSize: "15px" }}
//                     >
//                       {column}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {transactions.map((transaction) => (
//                   <TableRow key={transaction._id}>
//                     <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
//                     <TableCell>{transaction.amount}</TableCell>
//                     <TableCell>{transaction.currency}</TableCell>
//                     <TableCell>{transaction.status}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// }
