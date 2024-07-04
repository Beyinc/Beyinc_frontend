import axiosInstance from "../Components/axiosInstance";



export const PaymentServices = {

    paymentOrder: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/orders`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },

    addingBenificiary: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/addBenificiaryAccount`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },

    paymentSuccess: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/success`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },

}