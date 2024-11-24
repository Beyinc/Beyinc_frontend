import axiosInstance from "../Components/axiosInstance";



export const PaymentServices = {

    paymentOrder: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/order`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },

    addingProffesional: (obj) => {
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

    paymentVerification: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/verification`, obj)
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

    payOut: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/payouts/transfer`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },



    fundaccount: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/fundaccount`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },


    deleteAccount: (obj) => {
        console.log('deleteAccount payment service working')
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/deleteFundAccount`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },
    saveWithdrawData : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/saveWithdrawl`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },


    getTransactions : (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/payment/getTransactions`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res)
                    }
                })
                .catch((err) => reject(err));

        })
    },

}