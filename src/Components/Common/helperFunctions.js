import { PaymentServices } from "../../Services/PaymentServices";

export const handlePayment = async (amount, currency, name, email, contact, userId ) => {
    const { data: order } = await PaymentServices.paymentOrder({ amount, currency, email });

    const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: process.env.REACT_APP_RAZORPAY_COMPANY_NAME,
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response) {
            const paymentId = response.razorpay_payment_id;
            try {
                const result = await PaymentServices.paymentSuccess( {
                    paymentId,
                    amount,
                    userId
                });
                if (result.data.success) {
                    alert('Payment successful and balance updated!');
                } else {
                    alert('Payment verification failed.');
                }
            } catch (error) {
                alert('Error in verifying payment: ' + error.response.data.error);
            }
        },
        prefill: {
            name: name,
            email: email,
            contact: contact
        },
        notes: {
            address: 'Razorpay Corporate Office'
        },
        theme: {
            color: '#F37254'
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
};


export const addingBenificiaryAccount = async (e, accountNumber, ifsc, phone, email, userName, userId) => {
    e.target.disabled = true;
    await PaymentServices.addingBenificiary({ accountNumber, ifsc, phone, email, userName, userId }).then((res) => {
        console.log(res.data)
        e.target.disabled = false;
    }).catch(err => {
        alert(err.response.data)
    })
}