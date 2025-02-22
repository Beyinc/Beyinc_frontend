import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PaymentServices } from '../../Services/PaymentServices';

const BookingCard = () => {
  const [bookings, setBookings] = useState([]); // Set initial state for bookings

  // Fetch data function
  const fetchData = async () => {
    try {
      // const payoutData = await axios.post('http://localhost:4000/api/getpayoutdetailsadmin');
      const payoutData = await PaymentServices.fetchTransactionsAdmin();
      // console.log("This is the payoutData for admin: ", payoutData.data.payoutDetails);

      const payoutDetails = payoutData.data.payoutDetails;
      const updatedBookings = [];

      payoutDetails.forEach((detail) => {
        const withdrawlData = detail.withdrawlData;

        const bookingsData = {
          _id: detail._id,
          mentorId: detail.mentorId,
          withdrawlData: withdrawlData,
          bank: detail.bank,
        };

        updatedBookings.push(bookingsData);
      });

      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error fetching payout data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // console.log("This is the booking the constructor: ", bookings);
  }, []);

  
const handleStatusChange = async (payoutId, withdrawlDataId, newStatus) => {
  try {
    const response = await PaymentServices.updatePayoutStatus({
      payoutId,
      withdrawlDataId,
      newPayoutStatus: newStatus, // Pass the status change
    });

    // Update the state to reflect the new status
    setBookings((prevBookings) =>
      prevBookings.map((booking) => ({
        ...booking,
        withdrawlData: booking.withdrawlData.map((data) =>
          data._id === withdrawlDataId
            ? { ...data, payoutStatus: newStatus }
            : data
        ),
      }))
    );

    if(response.status === 200){
      toggleEditMode(withdrawlDataId);
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
};


  const toggleEditMode = (withdrawlDataId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) => ({
        ...booking,
        withdrawlData: booking.withdrawlData.map((data) =>
          data._id === withdrawlDataId
            ? { ...data, isEditing: !data.isEditing }
            : data
        ),
      }))
    );
  };

  const BookingRow = ({_id, mentorId, withdrawlData, payoutId }) => (
    <div className="p-4 bg-white rounded-lg shadow-sm mb-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <span className="text-lg font-semibold flex items-center justify-center pr-4">
              <img src="/profile.png" alt="" className='h-14 w-auto rounded-full'/>
              </span>
          </div>
          <div>
            <h3 className="font-semibold">Mentor ID: {mentorId}</h3>
            <p>{withdrawlData ? `${withdrawlData.length} Withdrawal(s)` : "No Withdrawals"}</p>
          </div>
        </div>
  
        {/* Table for displaying withdrawal data */}
        <table className="w-full table-auto mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Booking ID</th>
              <th className="border px-4 py-2">Total Amount</th>
              <th className="border px-4 py-2">Withdraw Amount</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawlData.map((data) => (
              <tr key={data._id}>
                <td className="border px-4 py-2">
                  {data.bookingIds.map((id, index) => (
                    <React.Fragment key={index}>
                      {id}
                      {index < data.bookingIds.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </td>
                <td className="border px-4 py-2">₹{data.totalAmount}</td>
                <td className="border px-4 py-2">₹{data.withdrawlAmount}</td>
                <td className="border px-4 py-2">
                  {data.isEditing ? (
                    <select
                      value={data.payoutStatus}
                      onChange={(e) =>{
                        // console.log("This is the _id from the select: ", payoutId);
                        handleStatusChange(payoutId, data._id, e.target.value)  // Pass the payoutId here
                      }}
                      className="py-1 px-3 border rounded-md text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Complete">Complete</option>
                      <option value="Failed">Failed</option>
                      <option value="Incorrect Bank Details">Incorrect Bank Details</option>
                    </select>
                  ) : (
                    <span>{data.payoutStatus}</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => toggleEditMode(data._id)}
                    className="py-1 px-3 text-sm bg-blue-500 text-white rounded-md"
                  >
                    {data.isEditing ? "Save" : "Edit"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <BookingRow
            key={index}
            mentorId={booking.mentorId}
            withdrawlData={booking.withdrawlData}
            payoutId={booking._id}
            // id={booking._id}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingCard;
