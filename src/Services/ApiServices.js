import axiosInstance from "../Components/axiosInstance";

export const ApiServices = {
  verifyAccessToken: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/verifyApiAccessToken`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  updateuserProfileImage: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/updateProfileImage`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  deleteuserProfileImage: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/deleteProfileImage`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  refreshToken: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/refresh-token`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  sendOtp: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/sendEmailOtp`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  sendMobileOtp: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/sendMobileOtp`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  verifyOtp: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/verifyOtp`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  register: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/register`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  sendForApproval: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/editprofile`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  getProfile: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/getUser`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  login: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/login`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  mobileLogin: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/mobile/login`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  resetPassword: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/forgotPassword`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getAllUsers: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/getUsers`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  getHistoricalConversations: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/getConversation`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getAllNotification: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/notification/getNotification`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  changeNotification: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/notification/notificationStatusChange`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addConversation: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/addConversation`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  checkConvBtwTwo: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/checkConversation`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getMessages: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/getMessages`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getTotalMessagesCount: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/getTotalMessages`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },


  changeStatusMessage: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/changeChatSeen`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  chatBlock: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/blockUserschat`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  sendMessages: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/addMessage`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getUserRequest: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/getUserRequest`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  updateUserMessageRequest: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/updateMessageRequest`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getlastUpdatedPitch: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/recentpitch`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getAllRoles: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/role/getAllRoles`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  fetchSinglePitch: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/singlePitch`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addPitchComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/addPitchComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addPitchSubComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/addPitchSubComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addUserComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/addUserComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  removeUserComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/deleteUserComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addPitchReview: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/addStar`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addUserReview: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/addUserReview`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getUsersStarsFrom: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/getUserReview`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addIntrest: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/addIntrest`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  removeIntrest: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/removeFromIntrest`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getStarsFrom: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/getStar`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  removePitchComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/removePitchComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  livePitches: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/pitch/livePitch`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  // use for both add and update
  addPitch: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/createPitch`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  userLivePitches: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/pitch/userLivePitch`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getuserPitches: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/pitch/userPitches`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  updatePitch: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/updatePitch`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  deletePitch: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/deletePitch`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getFriendByConvID: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/getFriendByConversationId`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getConversationById: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/getConversationById`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  deleteConversation: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/deleteConversation`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  directConversationCreation: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/chat/directConversationCreation`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  likeComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(`/userDetails/likeComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  likePitchComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(`/pitch/likePitchComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  dislikePitchComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(`/pitch/dispitchlikeComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },


  getuserComments: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/getUserComment`, obj)
        .then((res) => {
          if (res) {
            // console.log(res);
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },


  
  dislikeComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(`/userDetails/dislikeComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },



  getPitchComments: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/pitch/getPitchComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

};
