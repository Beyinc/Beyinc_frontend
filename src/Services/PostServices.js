import axiosInstance from "../Components/axiosInstance";

export const ReactionServices = {

    addOrUpdate: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance
                .post(`/post/reaction`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res);
                    }
                })
                .catch((err) => reject(err));
        });
    },
};
