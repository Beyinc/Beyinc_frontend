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
  SSORegister: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/auth/ssoRegister`, obj)
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
  updateStatusDirectly: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/updateStatusDirect`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  updateStatusByAdmin: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/updateVerificationByAdmin`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  sendDirectUpdate: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/directeditprofile`, obj)
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

  saveFollowers: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/followerControl`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  unfollowUser: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/unfollow`, obj)
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

  getDashboardDetails: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/dashboard/details`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  isFirstTimeLogin: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/userDetails/isProfileComplete`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  editUserFirstTime: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`userDetails/updateProfile`, obj)
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

  getReceivedPitches: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/pitch/userReceivedPitch`)
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
  deleteUserComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/deleteUserComment`, obj)
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

  createPost: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/createPost`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  updatePost: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/editPost`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getUsersPost: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/getUsersPost`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getAllPosts: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/getAllPosts`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getTopTrendingPosts: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/getTopTrendingPosts`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getRecommendedUsers: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/userDetails/recommendedUsers`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getPost: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/getPost`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  likePost: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/likePost`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  dislikePost: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/disLikePost`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  requestIntoOpenDiscussion: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/requestIntoOpenDiscussion`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  updaterequestIntoOpenDiscussion: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/updaterequestIntoOpenDiscussion`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getPostRequestDiscussion: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/getPostRequestDiscussion`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  deletepost: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/deletePost`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getPostComments: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/post/getPostComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addPostComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/post/addPostComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  likePostComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(`/post/likePostComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  DislikePostComment: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(`/post/DislikePostComment`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  getReportedPosts: () => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/posts/getReportedPosts`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  addReport: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/addReport`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  updateReport: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/updateReport`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getCoupons: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/referral/getCoupons`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  updateCoupon: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/referral/updateCoupon`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  saveBeyincProfessional: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/saveBeyincProfessional`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  saveOrUpdateProfessionalProfile: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .put(`/professionalProfile/update`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  fetchProfessionalProfile: () => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/professionalProfile/fetch`)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  SaveData: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/savedata`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  InputFormData: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/inputFormData`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  FilterData: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/filterdata`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  getFilterPosts: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/posts/filterPosts`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
  InputEntryData: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/inputEntryData`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  searchProfiles: (query) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/searchProfiles?query=${query}`) // Use query param
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  },

  FilterSearchProfiles: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/filterSearchProfiles`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  SaveDocuments: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/saveDocuments`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },

  SaveDocument: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(`/saveDocument`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
    getNewProfiles: (obj) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`/newProfiles`, obj)
        .then((res) => {
          if (res) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  },
};
