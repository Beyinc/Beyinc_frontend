import { PaymentServices } from "../../Services/PaymentServices";
import axios from "axios";

const ENV = process.env;

export const handlePayment = async (amount, currency, name, email, contact, onPaymentSuccessCallbacks) => {
    // Ensure Razorpay script is loaded
    if (!window.Razorpay) {
        console.error("Razorpay script is not loaded.");
        alert('Payment service is currently unavailable.');
        return;
    }

    try {
        console.log("handlePayment", amount);

        // Create payment order
        const { data: { order } } = await PaymentServices.paymentOrder({ amount });
        console.log("Order amount:", order.amount);

        // Set up Razorpay options
        const options = {
            key: ENV.REACT_APP_RAZORPAY_API_KEY, // Your Razorpay API key
            amount: order.amount, // Amount in paise
            currency: currency,
            name: "BEYINC",
            description: "Testing payment",
            image: "/logo.png",
            order_id: order.id,
            handler: async function (response) {
                try {
                    console.log("Payment response:", response);
                    const paymentId = response.razorpay_payment_id;

                    // Verify the payment
                    const result = await PaymentServices.paymentVerification(response);
                    console.log("Verification result:", result);

                    if (result.data.success) {
                        // Execute success callbacks
                        for (const callback of onPaymentSuccessCallbacks) {
                            await callback(paymentId, response);
                        }
                        alert(`Payment successful and payment id is ${paymentId}`);
                    } else {
                        alert('Payment not captured.');
                    }
                } catch (error) {
                    console.error('Error in verifying payment:', error);
                    alert('Error in verifying payment: ' + (error.response?.data?.error || error.message));
                }
            },
            prefill: {
                name: name,
                email: email,
                contact: contact,
            },
            notes: {
                "address": "Razorpay Corporate Office",
            },
            theme: {
                "color": "#121212",
            },
        };

        // Initialize and open Razorpay payment modal
        const razor = new window.Razorpay(options);
        razor.open();
    } catch (error) {
        console.error('Error initiating payment:', error);
        alert('Error initiating payment: ' + (error.response?.data?.error || error.message));
    }
};


// export const addingFundAccount = async ( ) => {
   
//     await PaymentServices.fundaccount().then((res) => {
//         console.log(res.data)
       
//     }).catch(err => {
//         alert(err.response.data)
//     })
// }




// export const addingBenificiaryAccount = async ({mobile, email, userName, userId}) => {

  
//       const contactInfo = response.data;
//       console.log(contactInfo);
  

 
//   };

export const transferringMoney = async (e, user_id, id, fee) => {
    e.target.disabled = true;
    await PaymentServices.transferMoney({ senderId: user_id, receiverId: id, amount: +fee }).then((res) => {
        console.log(res.data)
        e.target.disabled = false;
    }).catch(err => {
        console.log(err)
        alert(err.response.data)
    })
}