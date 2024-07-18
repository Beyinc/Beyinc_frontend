import { PaymentServices } from "../../Services/PaymentServices";
import axios from "axios";
const RAZORPAY_API_KEY= "rzp_test_27zQwT5eoOdkCi"

const RAZORPAY_API_SECRET="gzbsiSfsVVCSXJDDl3PMAtga"

export const handlePayment = async (amount, currency, name, email, contact, userId, setInputs ) => {
        
    // const RAZORPAY_API_KEY="rzp_test_27zQwT5eoOdkCi"
    const { data: {order} } = await PaymentServices.paymentOrder({ amount });
      
      console.log(order.amount)

        const options = {
            key: RAZORPAY_API_KEY,
            amount: order.amount,
            currency: currency,
            name: "BEYINC",
            description: "Testing payment",
            image: "/logo.png",
            order_id: order.id,
            handler: async function (response) {
              
              try {
               
                console.log(response)
                const paymentId = response.razorpay_payment_id;
                
          
                const result = await PaymentServices.paymentVerification(response)
                
                console.log(result)
                      if (result.data.success) {
                        alert(`Payment successful and payment id is ${paymentId}`);
                      }
                      else {
                        alert('Payment not captured.');
                      }  

              } catch (error) {
                  alert('Error in verifying payment: ' + error.response.data.error);
              }
          },
            prefill: {
                name: name,
                email: email,
                contact: contact,
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