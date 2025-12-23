import axiosInstance from "../Components/axiosInstance";

export const ReactionServices = {

    addOrUpdate: (obj) => {
        return new Promise((resolve, reject) => {
            axiosInstance
                .post(`/posts/reactToPost`, obj)
                .then((res) => {
                    if (res) {
                        resolve(res);
                    }
                })
                .catch((err) => reject(err));
        });
    },
};
